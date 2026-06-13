import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const BOT_UA_PATTERNS = /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|preview|python-requests|curl|wget|scrapy|headless|phantom|selenium|googlebot|bingbot|yandex|baidu|duckduckbot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBot(v: any): boolean {
  if (v.browser === 'Unknown') return true;
  if (v.user_agent && BOT_UA_PATTERNS.test(v.user_agent)) return true;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
    }

    const allVisitors = visitors || [];

    // Bot / insan ayrımı
    const humanVisitors = allVisitors.filter(v => !isBot(v));
    const botVisitors = allVisitors.filter(v => isBot(v));

    // ── İnsan ziyaretçi istatistikleri ──────────────────────────────────────

    const totalVisits = humanVisitors.length;
    const uniqueSessions = new Set(humanVisitors.map(v => v.session_id)).size;

    const today = new Date().toISOString().split('T')[0];
    const todayVisits = humanVisitors.filter(v => v.created_at.startsWith(today)).length;

    const visitorsWithDuration = humanVisitors.filter(v => v.duration && v.duration > 0);
    const avgDuration = visitorsWithDuration.length > 0
      ? Math.round(visitorsWithDuration.reduce((sum, v) => sum + (v.duration || 0), 0) / visitorsWithDuration.length)
      : 0;

    const sessionDurations: Record<string, number> = {};
    humanVisitors.forEach(v => {
      if (v.session_id && v.duration) {
        sessionDurations[v.session_id] = (sessionDurations[v.session_id] || 0) + (v.duration || 0);
      }
    });
    const sessionDurArr = Object.values(sessionDurations);
    const avgSessionDuration = sessionDurArr.length > 0
      ? Math.round(sessionDurArr.reduce((a, b) => a + b, 0) / sessionDurArr.length)
      : 0;

    const pageStats: Record<string, { count: number; totalDuration: number; durCount: number }> = {};
    humanVisitors.forEach(v => {
      if (!pageStats[v.page]) pageStats[v.page] = { count: 0, totalDuration: 0, durCount: 0 };
      pageStats[v.page].count += 1;
      if (v.duration && v.duration > 0) {
        pageStats[v.page].totalDuration += v.duration;
        pageStats[v.page].durCount += 1;
      }
    });
    const topPages = Object.entries(pageStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([page, stats]) => ({
        page,
        count: stats.count,
        avgDuration: stats.durCount > 0 ? Math.round(stats.totalDuration / stats.durCount) : 0,
      }));

    const deviceStats: Record<string, number> = {};
    humanVisitors.forEach(v => { deviceStats[v.device] = (deviceStats[v.device] || 0) + 1; });

    const browserStats: Record<string, number> = {};
    humanVisitors.forEach(v => { browserStats[v.browser] = (browserStats[v.browser] || 0) + 1; });

    const countryStats: Record<string, number> = {};
    humanVisitors.forEach(v => { countryStats[v.country] = (countryStats[v.country] || 0) + 1; });
    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    const dailyStats: Record<string, { count: number; totalDuration: number; durCount: number }> = {};
    humanVisitors.forEach(v => {
      const day = v.created_at.split('T')[0];
      if (!dailyStats[day]) dailyStats[day] = { count: 0, totalDuration: 0, durCount: 0 };
      dailyStats[day].count += 1;
      if (v.duration && v.duration > 0) {
        dailyStats[day].totalDuration += v.duration;
        dailyStats[day].durCount += 1;
      }
    });
    const dailyTrend = Object.entries(dailyStats)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, stats]) => ({
        date,
        count: stats.count,
        avgDuration: stats.durCount > 0 ? Math.round(stats.totalDuration / stats.durCount) : 0,
      }));

    const hourlyStats: Record<number, number> = {};
    humanVisitors.forEach(v => {
      const hour = new Date(v.created_at).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    const recentVisitors = humanVisitors.slice(0, 20).map(v => ({
      id: v.id,
      page: v.page,
      device: v.device,
      browser: v.browser,
      os: v.os,
      country: v.country,
      city: v.city,
      duration: v.duration || 0,
      created_at: v.created_at,
    }));

    // ── Bot istatistikleri ───────────────────────────────────────────────────

    const botCountryStats: Record<string, number> = {};
    botVisitors.forEach(v => { botCountryStats[v.country] = (botCountryStats[v.country] || 0) + 1; });
    const botTopCountries = Object.entries(botCountryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    const botPageStats: Record<string, number> = {};
    botVisitors.forEach(v => { botPageStats[v.page] = (botPageStats[v.page] || 0) + 1; });
    const botTopPages = Object.entries(botPageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    const botUaStats: Record<string, number> = {};
    botVisitors.forEach(v => {
      const ua = (v.user_agent || 'Unknown').slice(0, 60);
      botUaStats[ua] = (botUaStats[ua] || 0) + 1;
    });
    const botTopUAs = Object.entries(botUaStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ua, count]) => ({ ua, count }));

    const botRecentVisitors = botVisitors.slice(0, 20).map(v => ({
      id: v.id,
      page: v.page,
      device: v.device,
      browser: v.browser,
      os: v.os,
      country: v.country,
      city: v.city,
      user_agent: (v.user_agent || '').slice(0, 120),
      created_at: v.created_at,
    }));

    return NextResponse.json({
      totalVisits,
      uniqueSessions,
      todayVisits,
      avgDuration,
      avgSessionDuration,
      topPages,
      deviceStats,
      browserStats,
      topCountries,
      dailyTrend,
      hourlyStats,
      recentVisitors,
      // Bot verileri
      botVisits: botVisitors.length,
      botTopCountries,
      botTopPages,
      botTopUAs,
      botRecentVisitors,
    });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
