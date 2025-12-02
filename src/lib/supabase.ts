import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'customer';
  area?: string;
  custom_area?: string;
  detailed_address?: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  weight?: string;
  image_url: string;
  sugar_free: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  phone: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
};
