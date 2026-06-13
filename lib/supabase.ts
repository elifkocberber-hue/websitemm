import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
}

// ⚠️ ANON (public) client — yalnızca herkese açık OKUMA işlemleri için (ürün listesi,
// yayınlanmış SSS, sayfa ayarları). RLS bunu kısıtlar. Hassas veya yazma işlemleri için
// sunucu route'larında '@/lib/supabaseAdmin' (service-role) kullanılmalıdır.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// Database Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  payment_id: string;
  shipping_address: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number | string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}
