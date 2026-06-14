import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let query = supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_price,
        status,
        payment_id,
        shipping_address,
        customer_email,
        customer_name,
        tracking_number,
        created_at,
        updated_at,
        users:user_id (
          email,
          first_name,
          last_name
        )
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Siparişler alınamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
