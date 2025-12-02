/*
  # Clean Up Security Issues

  1. Remove Unused Indexes
    - Drop unused indexes that were created but never utilized
    - Removes idx_profiles_phone, idx_products_category, idx_orders_customer_id
    - Removes idx_order_items_product_id, idx_settings_updated_by

  2. Fix Duplicate RLS Policies
    - Remove duplicate policies for products (insert, update, delete)
    - Remove duplicate policies for orders (update)
    - Keep only the newer policy versions
    - Multiple permissive SELECT policies are intentional (admin + user access)

  3. Notes
    - Unused indexes consume storage and slow down writes
    - Duplicate policies create confusion and potential security gaps
    - Multiple SELECT policies are kept as they serve different access patterns
*/

-- ============================================
-- 1. Drop Unused Indexes
-- ============================================

DROP INDEX IF EXISTS idx_profiles_phone;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_settings_updated_by;

-- ============================================
-- 2. Remove Duplicate RLS Policies
-- ============================================

-- Products: Keep only "Only admins..." versions, drop "Admins..." versions
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Orders: Keep only "Admins can update all orders", drop "Admins can update orders"
DROP POLICY IF EXISTS "Admins can update orders" ON orders;