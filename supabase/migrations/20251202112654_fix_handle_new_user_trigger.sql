/*
  # إصلاح Trigger إنشاء Profile

  ## المشكلة
    - الـ trigger كان يُنشئ profile بقيم افتراضية (مستخدم، 961)
    - ثم عند محاولة إدخال البيانات الصحيحة، كان يتم تجاهلها بسبب ON CONFLICT DO NOTHING

  ## الحل
    - تحديث الـ trigger ليقرأ البيانات من raw_user_meta_data
    - هذه البيانات يتم إرسالها من الكود عند التسجيل
    - سيتم تحديث البيانات لاحقاً بمعلومات المنطقة والعنوان

  ## الأمان
    - الـ trigger آمن ويعمل مع SECURITY DEFINER
    - البيانات تأتي من عملية التسجيل الموثوقة
*/

-- ============================================
-- تحديث دالة إنشاء profile
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- إنشاء profile للمستخدم الجديد مع البيانات من user_metadata
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '961'),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    email = COALESCE(EXCLUDED.email, profiles.email);
  
  RETURN NEW;
END;
$$;