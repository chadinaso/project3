/*
  # إضافة سياسة حذف الطلبات للمديرين

  ## التغييرات
  
  1. إضافة سياسة DELETE للطلبات للسماح للمديرين بحذف الطلبات
  2. إضافة سياسة DELETE لعناصر الطلبات (سيتم حذفها تلقائياً عند حذف الطلب بسبب CASCADE)
  
  ## الأمان
  
  - فقط المديرون يمكنهم حذف الطلبات
  - يتم استخدام دالة is_admin() للتحقق من الصلاحيات
*/

-- إضافة سياسة حذف الطلبات للمديرين
CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (is_admin());

-- إضافة سياسة حذف عناصر الطلبات للمديرين
CREATE POLICY "Admins can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (is_admin());