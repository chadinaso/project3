/*
  # إضافة قيد Unique على رقم الهاتف

  ## التغيير
    - إضافة قيد unique على حقل phone في جدول profiles
    - هذا يمنع تسجيل نفس رقم الهاتف أكثر من مرة

  ## الأمان
    - القيد يضمن عدم تكرار أرقام الهواتف
    - يساعد في منع الحسابات المكررة
*/

-- ============================================
-- إضافة قيد unique على رقم الهاتف
-- ============================================

-- أولاً، نحذف أي أرقام مكررة (نبقي على الأقدم)
DELETE FROM profiles p1
WHERE EXISTS (
  SELECT 1 FROM profiles p2
  WHERE p2.phone = p1.phone
  AND p2.created_at < p1.created_at
);

-- الآن نضيف القيد
ALTER TABLE profiles
ADD CONSTRAINT profiles_phone_unique UNIQUE (phone);