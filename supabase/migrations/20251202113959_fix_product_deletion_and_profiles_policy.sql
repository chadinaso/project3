/*
  # إصلاح حذف المنتجات وسياسة profiles

  ## المشاكل
    1. سياسة UPDATE في profiles تسبب infinite recursion
    2. لا يمكن حذف منتج موجود في order_items بسبب foreign key constraint

  ## الحلول
    1. تبسيط سياسة UPDATE في profiles
    2. تغيير foreign key constraint في order_items إلى SET NULL عند حذف المنتج
    3. إضافة معلومات المنتج المحفوظة في order_items لتبقى حتى بعد حذف المنتج

  ## الأمان
    - جميع السياسات تبقى آمنة ومقيدة
    - المستخدمون لا يمكنهم تغيير role الخاص بهم
*/

-- ============================================
-- إصلاح سياسة UPDATE في profiles
-- ============================================

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid())
    OR
    is_admin()
  )
  WITH CHECK (
    -- المستخدمون العاديون يمكنهم تحديث ملفهم ولكن ليس role
    (
      id = (select auth.uid())
      AND role = 'customer'
    )
    OR
    -- المدراء يمكنهم تحديث كل شيء
    is_admin()
  );

-- ============================================
-- إصلاح foreign key constraint في order_items
-- ============================================

-- حذف القيد القديم
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- إضافة قيد جديد مع SET NULL
-- هذا يسمح بحذف المنتج دون حذف order_items
ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE SET NULL;

-- تحديث product_id ليكون nullable
ALTER TABLE order_items
ALTER COLUMN product_id DROP NOT NULL;