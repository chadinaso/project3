/*
  # إضافة Trigger لإنشاء Profile تلقائياً

  ## المشكلة
    - عند تسجيل الدخول، قد لا يكون للمستخدم profile موجود
    - هذا يسبب مشاكل في عملية تسجيل الدخول

  ## الحل
    - إنشاء trigger يقوم تلقائياً بإنشاء profile عند إنشاء مستخدم جديد في auth.users
    - هذا يضمن أن كل مستخدم لديه profile

  ## الأمان
    - الـ trigger يعمل مع SECURITY DEFINER
    - يتم إنشاء profile فقط للمستخدمين الجدد
*/

-- ============================================
-- دالة لإنشاء profile تلقائياً
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- إنشاء profile للمستخدم الجديد
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '961'),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- إنشاء trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- إصلاح المستخدمين الموجودين بدون profiles
-- ============================================

-- التحقق من المستخدمين في auth.users الذين ليس لديهم profiles وإنشائها
INSERT INTO public.profiles (id, email, full_name, phone, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'مستخدم'),
  COALESCE(au.raw_user_meta_data->>'phone', '961' || au.id::text),
  'customer'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;