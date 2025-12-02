/*
  # إصلاح سياسات RLS لتجنب التكرار اللا نهائي

  ## التغييرات
  
  1. حذف السياسات القديمة التي تسبب التكرار اللا نهائي
  2. إنشاء سياسات جديدة أبسط وأكثر أماناً
  3. استخدام نهج مختلف للتحقق من دور المستخدم
  
  ## الملاحظات
  
  - السياسات الجديدة تسمح للمستخدمين برؤية ملفاتهم الشخصية فقط
  - المديرون سيحتاجون لاستخدام service role للوصول لجميع البيانات من الواجهة الخلفية
  - أو يمكن تعطيل RLS للمديرين باستخدام security definer functions
*/

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- إنشاء دالة للتحقق من دور المستخدم بدون تكرار
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- سياسات profiles: السماح للمديرين برؤية جميع الملفات
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- سياسات products: السماح للمديرين بإدارة المنتجات
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- سياسات orders: السماح للمديرين برؤية وتعديل جميع الطلبات
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- سياسات order_items: السماح للمديرين برؤية جميع عناصر الطلبات
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());