/*
  # إضافة علاقة خارجية بين orders و profiles

  ## التغييرات
  
  1. إضافة علاقة خارجية (foreign key) بين orders.customer_id و profiles.id
     - هذا سيسمح لـ Supabase بفهم العلاقة بين الجدولين
     - يتيح استخدام profiles:customer_id() في الاستعلامات
  
  ## ملاحظات مهمة
  
  - orders.customer_id يشير حالياً إلى auth.users(id)
  - profiles.id يشير أيضاً إلى auth.users(id)
  - لذلك يمكن إنشاء علاقة مباشرة بين orders.customer_id و profiles.id
*/

-- إزالة القيد القديم إذا كان موجوداً
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'orders_customer_id_fkey'
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_customer_id_fkey;
  END IF;
END $$;

-- إضافة القيد الجديد الذي يربط orders.customer_id مع profiles.id
ALTER TABLE orders 
ADD CONSTRAINT orders_customer_id_fkey 
FOREIGN KEY (customer_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;