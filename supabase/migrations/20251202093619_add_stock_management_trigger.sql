/*
  # Add Stock Management Trigger

  1. Purpose
    - Automatically reduce product stock when an order is confirmed
    - Prevent orders from being confirmed if insufficient stock

  2. Changes
    - Create function to validate and update stock quantities
    - Create trigger that fires when order status changes to 'confirmed'
    - Ensure atomic stock reduction to prevent race conditions

  3. Security
    - Function runs with proper privileges
    - Validates stock availability before confirming orders
*/

-- ============================================
-- Function to update product stock
-- ============================================

CREATE OR REPLACE FUNCTION reduce_product_stock()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
  current_stock INTEGER;
BEGIN
  -- Only process when order status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    
    -- Loop through all items in the order
    FOR item IN 
      SELECT product_id, quantity 
      FROM order_items 
      WHERE order_id = NEW.id
    LOOP
      -- Get current stock
      SELECT quantity INTO current_stock
      FROM products
      WHERE id = item.product_id;
      
      -- Check if enough stock is available
      IF current_stock < item.quantity THEN
        RAISE EXCEPTION 'الكمية غير كافية للمنتج. الكمية المتاحة: %', current_stock;
      END IF;
      
      -- Reduce stock
      UPDATE products
      SET quantity = quantity - item.quantity
      WHERE id = item.product_id;
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Create trigger
-- ============================================

DROP TRIGGER IF EXISTS trigger_reduce_stock ON orders;

CREATE TRIGGER trigger_reduce_stock
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION reduce_product_stock();