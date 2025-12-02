/*
  # Fix Security Issues - Indexes and RLS Policies

  ## Changes Made

  1. **Add Missing Indexes for Foreign Keys**
     - Add index on `order_items.product_id` for foreign key `order_items_product_id_fkey`
     - Add index on `orders.customer_id` for foreign key `orders_customer_id_fkey`
     - Add index on `settings.updated_by` for foreign key `settings_updated_by_fkey`
     - These indexes improve query performance when joining tables

  2. **Fix Multiple Permissive Policies**
     - Convert multiple permissive SELECT policies to single policies with OR conditions
     - This prevents potential security issues where multiple policies might conflict
     - Tables affected: `order_items`, `orders`, `profiles`

  3. **Fix Function Search Path**
     - Update `reduce_product_stock` function to use immutable search path
     - Set explicit schema qualification to prevent search path manipulation attacks

  ## Security Improvements
     - Better query performance with proper indexing
     - Cleaner RLS policy structure
     - Protection against search path manipulation
*/

-- ============================================
-- 1. Add missing indexes for foreign keys
-- ============================================

CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_settings_updated_by ON settings(updated_by);

-- ============================================
-- 2. Fix multiple permissive policies
-- ============================================

-- Fix order_items policies
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;

CREATE POLICY "Users can view order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Fix orders policies
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;

CREATE POLICY "Users can view orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR
    customer_id = auth.uid()
  );

-- Fix profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
    OR
    id = auth.uid()
  );

-- ============================================
-- 3. Fix function search path mutability
-- ============================================

-- Drop trigger first, then function
DROP TRIGGER IF EXISTS trigger_reduce_stock ON orders;
DROP FUNCTION IF EXISTS reduce_product_stock();

-- Recreate function with immutable search path
CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  item RECORD;
  current_stock INTEGER;
BEGIN
  -- Only process when order status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    
    -- Loop through all items in the order
    FOR item IN 
      SELECT product_id, quantity 
      FROM public.order_items 
      WHERE order_id = NEW.id
    LOOP
      -- Get current stock
      SELECT quantity INTO current_stock
      FROM public.products
      WHERE id = item.product_id;
      
      -- Check if enough stock is available
      IF current_stock < item.quantity THEN
        RAISE EXCEPTION 'الكمية غير كافية للمنتج. الكمية المتاحة: %', current_stock;
      END IF;
      
      -- Reduce stock
      UPDATE public.products
      SET quantity = quantity - item.quantity
      WHERE id = item.product_id;
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER trigger_reduce_stock
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION reduce_product_stock();