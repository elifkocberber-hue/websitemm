import { createClient } from '@supabase/supabase-js';
import type { User, Order, OrderItem } from '@/lib/supabase';

// ⚠️ SUNUCU TARAFI — service_role anahtarı RLS'i bypass eder ve TAM yetkiye sahiptir.
// Bu modül ASLA bir client bileşeninden import edilmemeli. SUPABASE_SERVICE_ROLE_KEY
// NEXT_PUBLIC_ ön eki taşımadığı için client bundle'a girmez; yine de kazara kullanımı
// engellemek için aşağıdaki guard var.
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin yalnızca sunucu tarafında kullanılabilir.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Eksik ortam değişkeni: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı'
  );
}

// Service-role client: RLS'i bypass eder. Sadece güvenilir sunucu route'larında kullan.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ---- DB yardımcı fonksiyonları (sunucu tarafı, service-role ile) ----

// Kullanıcı oluştur veya getir
export const getOrCreateUser = async (email: string, firstName: string, lastName: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert([{ email, first_name: firstName, last_name: lastName }], {
      onConflict: 'email',
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

// Sipariş oluştur
export const createOrder = async (
  userId: string,
  totalPrice: number,
  shippingAddress: string,
  paymentId: string
) => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert([
      {
        user_id: userId,
        total_price: totalPrice,
        shipping_address: shippingAddress,
        payment_id: paymentId,
        status: 'completed',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

// Sipariş kalemlerini oluştur
export const createOrderItems = async (
  orderId: string,
  items: Array<{
    product_id: number | string;
    product_name: string;
    quantity: number;
    price: number;
  }>
) => {
  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { data, error } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)
    .select();

  if (error) throw error;
  return data as OrderItem[];
};
