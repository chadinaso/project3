/*
  # Optimize RLS Policies for Performance

  ## Changes Made

  1. **Optimize Auth Function Calls in RLS Policies**
     - Wrap `auth.uid()` calls with `(select auth.uid())` to prevent re-evaluation for each row
     - This significantly improves query performance at scale
     - Tables affected: `order_items`, `orders`, `profiles`

  2. **Why This Matters**
     - Without SELECT wrapper: auth.uid() is called for EVERY row being checked
     - With SELECT wrapper: auth.uid() is called ONCE and cached for the entire query
     - Performance improvement is critical for tables with many rows

  ## Security
     - Functionality remains identical
     - Security is not compromised
     - Only performance optimization applied
*/

-- ============================================
-- Optimize order_items SELECT policy
-- ============================================

DROP POLICY IF EXISTS "Users can view order items" ON order_items;

CREATE POLICY "Users can view order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = (select auth.uid())
    )
  );

-- ============================================
-- Optimize orders SELECT policy
-- ============================================

DROP POLICY IF EXISTS "Users can view orders" ON orders;

CREATE POLICY "Users can view orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
    OR
    customer_id = (select auth.uid())
  );

-- ============================================
-- Optimize profiles SELECT policy
-- ============================================

DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (select auth.uid())
      AND p.role = 'admin'
    )
    OR
    id = (select auth.uid())
  );

-- ============================================
-- Optimize other policies that use auth.uid()
-- ============================================

-- Optimize order_items INSERT policy
DROP POLICY IF EXISTS "Customers can create order items" ON order_items;

CREATE POLICY "Customers can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = (select auth.uid())
    )
  );

-- Optimize order_items DELETE policy
DROP POLICY IF EXISTS "Admins can delete order items" ON order_items;

CREATE POLICY "Admins can delete order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Optimize orders INSERT policy
DROP POLICY IF EXISTS "Customers can create own orders" ON orders;

CREATE POLICY "Customers can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (select auth.uid()));

-- Optimize orders UPDATE policy
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

CREATE POLICY "Admins can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Optimize orders DELETE policy
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

CREATE POLICY "Admins can delete orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Optimize profiles INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Optimize profiles UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (
    id = (select auth.uid())
    AND (
      -- Users can only update their own non-role fields
      role = (SELECT role FROM profiles WHERE id = (select auth.uid()))
      OR
      -- Or they are admin (admins can change roles)
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'
      )
    )
  );

-- Optimize products policies
DROP POLICY IF EXISTS "Admins can insert products" ON products;

CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update products" ON products;

CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Optimize settings policies
DROP POLICY IF EXISTS "Admins can insert settings" ON settings;

CREATE POLICY "Admins can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update settings" ON settings;

CREATE POLICY "Admins can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete settings" ON settings;

CREATE POLICY "Admins can delete settings"
  ON settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );