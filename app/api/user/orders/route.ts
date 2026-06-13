import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { getSessionUser } from '@/lib/userAuth';

export async function GET(req: NextRequest) {
  // user_id ASLA client'tan alınmaz — doğrulanmış oturum cookie'sinden gelir.
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  const userId = session.id;

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
