/*
  # تنظيف السياسات المكررة

  ## المشكلة
    - هناك سياسات قديمة ومكررة في بعض الجداول
    - هذا قد يسبب مشاكل في الأداء والأمان

  ## الحل
    - حذف جميع السياسات القديمة
    - الإبقاء فقط على السياسات الجديدة المحسّنة
*/

-- ============================================
-- تنظيف سياسات products
-- ============================================

DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- الإبقاء على:
-- - "Anyone can view products"
-- - "Admins can insert products"
-- - "Admins can update products"
-- - "Admins can delete products"

-- ============================================
-- تنظيف سياسات settings
-- ============================================

DROP POLICY IF EXISTS "Anyone can read settings" ON settings;

-- الإبقاء على:
-- - "Admins can view settings"
-- - "Admins can insert settings"
-- - "Admins can update settings"
-- - "Admins can delete settings"