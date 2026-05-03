import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_price,
      status,
      created_at,
      shipping_address,
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        image_url
      ),
      return_requests (
        id,
        return_code,
        status,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Siparişler alınamadı' }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
