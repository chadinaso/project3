/*
  # إصلاح مشكلة الـ Infinite Recursion في سياسات Profiles

  ## المشكلة
    - سياسات RLS في جدول profiles تسبب infinite recursion
    - السبب: التحقق من role يتطلب قراءة profiles، وهذا يؤدي إلى تكرار لا نهائي

  ## الحل
    - إنشاء SECURITY DEFINER function للتحقق من admin role
    - هذه الدالة تتجاوز RLS وتمنع infinite recursion
    - تحديث جميع السياسات لاستخدام هذه الدالة

  ## الأمان
    - الدالة آمنة لأنها تتحقق فقط من role دون إرجاع بيانات حساسة
    - جميع السياسات الأخرى تبقى كما هي
*/

-- ============================================
-- إنشاء دالة آمنة للتحقق من admin role
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ============================================
-- تحديث سياسات profiles
-- ============================================

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- سياسة SELECT - المستخدمون يمكنهم رؤية ملفهم الشخصي، والمدراء يرون الكل
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid())
    OR
    is_admin()
  );

-- سياسة INSERT - المستخدمون يمكنهم إنشاء ملفهم الشخصي فقط
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- سياسة UPDATE - المستخدمون يمكنهم تحديث ملفهم، والمدراء يمكنهم تحديث أي ملف
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
    -- المستخدمون العاديون لا يمكنهم تغيير role
    (
      id = (select auth.uid())
      AND role = (SELECT role FROM profiles WHERE id = (select auth.uid()))
    )
    OR
    -- المدراء يمكنهم تغيير كل شيء
    is_admin()
  );

-- سياسة DELETE - المدراء فقط
CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- تحديث سياسات الجداول الأخرى لاستخدام is_admin()
-- ============================================

-- تحديث سياسات products
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- تحديث سياسات orders
DROP POLICY IF EXISTS "Users can view orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

CREATE POLICY "Users can view orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id = (select auth.uid())
    OR
    is_admin()
  );

CREATE POLICY "Admins can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- تحديث سياسات order_items
DROP POLICY IF EXISTS "Users can view order items" ON order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON order_items;

CREATE POLICY "Users can view order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = (select auth.uid())
    )
    OR
    is_admin()
  );

CREATE POLICY "Admins can delete order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- تحديث سياسات settings
DROP POLICY IF EXISTS "Admins can view settings" ON settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Admins can update settings" ON settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON settings;

CREATE POLICY "Admins can view settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete settings"
  ON settings
  FOR DELETE
  TO authenticated
  USING (is_admin());