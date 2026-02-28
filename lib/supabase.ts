import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

// Database Functions

// Create or get user
export const getOrCreateUser = async (email: string, firstName: string, lastName: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([{ email, first_name: firstName, last_name: lastName }], {
        onConflict: 'email',
      })
      .select()
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw error;
  }
};

// Create order
export const createOrder = async (
  userId: string,
  totalPrice: number,
  shippingAddress: string,
  paymentId: string
) => {
  try {
    const { data, error } = await supabase
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
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Create order items
export const createOrderItems = async (
  orderId: string,
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>
) => {
  try {
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (error) throw error;
    return data as OrderItem[];
  } catch (error) {
    console.error('Error creating order items:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
