import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('adminToken')?.value;
  return !!token;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = id;

    // Siparişi al
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_price,
        status,
        payment_id,
        shipping_address,
        created_at,
        updated_at,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          created_at
        )
        `
      )
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Sipariş ürünlerini al
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Order items error:', itemsError);
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems || [],
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = id;
    const { status } = await request.json();

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Sipariş güncellenemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sipariş başarıyla güncellendi',
      order: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
