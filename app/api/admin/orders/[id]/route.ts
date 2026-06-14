import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

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
        iyzico_payment_id,
        tracking_number,
        carrier,
        shipping_address,
        customer_email,
        customer_name,
        created_at,
        updated_at
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
      // log silently
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems || [],
      },
    });
  } catch {
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
    const body = await request.json();
    const { status, tracking_number, carrier } = body;

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
      }
    }

    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updatePayload.status = status;
    if (tracking_number !== undefined) updatePayload.tracking_number = tracking_number;
    if (carrier !== undefined) updatePayload.carrier = carrier;
    // Takip numarası girildiyse durumu otomatik 'shipped' yap (admin status göndermediyse)
    if (tracking_number && status === undefined) updatePayload.status = 'shipped';

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()
      .single();

    // Kargo takip numarası girildiğinde müşteriye e-posta gönder
    if (!error && tracking_number && data) {
      try {
        // Müşteri bilgisi artık doğrudan siparişte tutuluyor (Phase 2) — eski users join'i kullanılmaz
        const customerEmail = data.customer_email;
        const customerName = data.customer_name || 'Değerli Müşterimiz';

        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && customerEmail) {
          const { Resend } = await import('resend');
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "El's Dream Factory <noreply@elsdreamfactory.com>",
            to: customerEmail,
            subject: 'Siparişiniz Kargoya Verildi!',
            html: `
              <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#2C2C2C;line-height:1.7;">
                <h2 style="font-size:22px;font-weight:normal;">Siparişiniz Yola Çıktı!</h2>
                <p>Merhaba ${customerName},</p>
                <p>Siparişiniz <strong>${carrier || 'kargo'}</strong> ile yola çıktı. Kargo takip numaranız:</p>
                <div style="background:#5C0A1A;color:#fff;padding:16px 24px;border-radius:8px;margin:20px 0;font-size:20px;letter-spacing:0.12em;font-weight:bold;text-align:center;">
                  ${tracking_number}
                </div>
                <p>Bu numarayı <strong>${carrier || 'kargo firmasının'}</strong> web sitesi veya uygulaması üzerinden takip edebilirsiniz.</p>
                <p>Teslimattan itibaren <strong>14 gün</strong> içinde cayma hakkınızı kullanabilirsiniz.</p>
                <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;" />
                <p style="color:#9B8E85;font-size:12px;">
                  Sorularınız için: <a href="mailto:elsdreamfactory@gmail.com" style="color:#5C0A1A;">elsdreamfactory@gmail.com</a><br/>
                  El's Dream Factory — ELİF KOÇBERBER DESIGN HOUSE
                </p>
              </div>
            `,
          });
        }
      } catch { /* e-posta hatası güncellemeyi etkilemez */ }
    }

    if (error) {
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
  } catch {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
