import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    // Tüm ziyaretçi verilerini al
    const { data: visitors, error } = await supabase
      .from('visitors')
      .select('*')
      .gte('created_at', sinceStr)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Analytics fetch error:', error);
      return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
    }

    const allVisitors = visitors || [];

    // Toplam ziyaret
    const totalVisits = allVisitors.length;

    // Benzersiz oturum sayısı
    const uniqueSessions = new Set(allVisitors.map(v => v.session_id)).size;

    // Bugünkü ziyaretler
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = allVisitors.filter(v => 
      v.created_at.startsWith(today)
    ).length;

    // Sayfa bazlı istatistikler
    const pageStats: Record<string, number> = {};
    allVisitors.forEach(v => {
      pageStats[v.page] = (pageStats[v.page] || 0) + 1;
    });
    const topPages = Object.entries(pageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Cihaz istatistikleri
    const deviceStats: Record<string, number> = {};
    allVisitors.forEach(v => {
      deviceStats[v.device] = (deviceStats[v.device] || 0) + 1;
    });

    // Tarayıcı istatistikleri
    const browserStats: Record<string, number> = {};
    allVisitors.forEach(v => {
      browserStats[v.browser] = (browserStats[v.browser] || 0) + 1;
    });

    // Ülke istatistikleri
    const countryStats: Record<string, number> = {};
    allVisitors.forEach(v => {
      countryStats[v.country] = (countryStats[v.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Günlük ziyaret trendi
    const dailyStats: Record<string, number> = {};
    allVisitors.forEach(v => {
      const day = v.created_at.split('T')[0];
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });
    const dailyTrend = Object.entries(dailyStats)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    // Saatlik dağılım
    const hourlyStats: Record<number, number> = {};
    allVisitors.forEach(v => {
      const hour = new Date(v.created_at).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    // Son ziyaretçiler
    const recentVisitors = allVisitors.slice(0, 20).map(v => ({
      id: v.id,
      page: v.page,
      device: v.device,
      browser: v.browser,
      os: v.os,
      country: v.country,
      city: v.city,
      created_at: v.created_at,
    }));

    return NextResponse.json({
      totalVisits,
      uniqueSessions,
      todayVisits,
      topPages,
      deviceStats,
      browserStats,
      topCountries,
      dailyTrend,
      hourlyStats,
      recentVisitors,
    });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
