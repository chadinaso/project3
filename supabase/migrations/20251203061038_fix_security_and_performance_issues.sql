/*
  # Fix Security and Performance Issues

  1. Remove Unused Indexes
    - Drop `idx_orders_status` from orders table (not being used)
    - Drop `idx_order_items_product_id` from order_items table (not being used)
    - Drop `idx_settings_updated_by` from settings table (not being used)

  2. Remove Duplicate Indexes
    - Drop duplicate constraint `profiles_phone_unique` from profiles table
    - Keep `profiles_phone_key` as the primary unique constraint for phone numbers

  ## Security Notes
  - Removing unused indexes improves write performance
  - Removing duplicate constraints reduces storage overhead
  - All changes are safe and non-destructive to data
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_settings_updated_by;

-- Drop duplicate constraint (keep profiles_phone_key)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phone_unique;
