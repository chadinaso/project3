/*
  # Add Indexes for Foreign Keys

  1. Performance Improvements
    - Add index on `order_items.product_id` to optimize foreign key lookups
    - Add index on `settings.updated_by` to optimize foreign key lookups

  2. Benefits
    - Faster JOIN operations on these foreign keys
    - Improved DELETE/UPDATE cascade performance
    - Better query planning by PostgreSQL optimizer

  ## Security Notes
  - These indexes improve query performance without any security risks
  - All foreign key constraints remain intact
*/

-- Add index for order_items.product_id foreign key
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Add index for settings.updated_by foreign key
CREATE INDEX IF NOT EXISTS idx_settings_updated_by ON settings(updated_by);
