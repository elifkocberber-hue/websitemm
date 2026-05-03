'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

interface AnalyticsData {
  totalVisits: number;
  uniqueSessions: number;
  todayVisits: number;
  avgDuration: number;
  avgSessionDuration: number;
  topPages: { page: string; count: number; avgDuration: number }[];
  deviceStats: Record<string, number>;
  browserStats: Record<string, number>;
  topCountries: { country: string; count: number }[];
  dailyTrend: { date: string; count: number; avgDuration: number }[];
  hourlyStats: Record<number, number>;
  recentVisitors: {
    id: string;
    page: string;
    device: string;
    browser: string;
    os: string;
    country: string;
    city: string;
    duration: number;
    created_at: string;
  }[];
  botVisits: number;
  botTopCountries: { country: string; count: number }[];
  botTopPages: { page: string; count: number }[];
  botTopUAs: { ua: string; count: number }[];
  botRecentVisitors: {
    id: string;
    page: string;
    device: string;
    browser: string;
    os: string;
    country: string;
    city: string;
    user_agent: string;
    created_at: string;
  }[];
}

function DailyChart({ dailyTrend }: { dailyTrend: { date: string; count: number; avgDuration: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 800, H = 220;
  const pL = 38, pR = 52, pT = 12, pB = 28;
  const cW = W - pL - pR;
  const cH = H - pT - pB;

  const maxCount = Math.max(...dailyTrend.map(d => d.count), 1);
  const maxDur = Math.max(...dailyTrend.map(d => d.avgDuration), 1);
  const n = dailyTrend.length || 1;
  const step = cW / n;
  const bW = step * 0.55;

  const bx = (i: number) => pL + i * step + (step - bW) / 2;
  const by = (c: number) => pT + cH - (c / maxCount) * cH;
  const bh = (c: number) => Math.max((c / maxCount) * cH, 1);
  const lx = (i: number) => pL + i * step + step / 2;
  const ly = (d: number) => pT + cH - (d / maxDur) * cH;

  const linePoints = dailyTrend.map((d, i) => `${lx(i)},${ly(d.avgDuration)}`).join(' ');

  const yLabels = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      {/* Grid */}
      {yLabels.map(pct => (
        <line key={pct} x1={pL} y1={pT + cH * (1 - pct)} x2={W - pR} y2={pT + cH * (1 - pct)}
          stroke="#f3f4f6" strokeWidth="1" />
      ))}

      {/* Y sol (ziyaret) */}
      {yLabels.map(pct => (
        <text key={pct} x={pL - 5} y={pT + cH * (1 - pct) + 4}
          textAnchor="end" fontSize="10" fill="#9ca3af">
          {Math.round(maxCount * pct)}
        </text>
      ))}

      {/* Y sağ (süre) */}
      {yLabels.map(pct => (
        <text key={pct} x={W - pR + 5} y={pT + cH * (1 - pct) + 4}
          textAnchor="start" fontSize="10" fill="#5C0A1A" opacity="0.5">
          {formatDuration(Math.round(maxDur * pct))}
        </text>
      ))}

      {/* Barlar */}
      {dailyTrend.map((d, i) => (
        <rect key={d.date}
          x={bx(i)} y={by(d.count)} width={bW} height={bh(d.count)}
          fill={hovered === i ? '#DD6B56' : '#DD6B5680'} rx="3"
          style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}

      {/* Süre çizgisi */}
      {dailyTrend.length > 1 && (
        <polyline points={linePoints} fill="none"
          stroke="#5C0A1A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.65" />
      )}

      {/* Süre noktaları */}
      {dailyTrend.map((d, i) => (
        <circle key={d.date}
          cx={lx(i)} cy={ly(d.avgDuration)} r={hovered === i ? 5 : 3.5}
          fill="#5C0A1A" stroke="white" strokeWidth="2"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}

      {/* X ekseni etiketleri */}
      {dailyTrend.map((d, i) => {
        const show = n <= 14 || i % Math.ceil(n / 14) === 0;
        if (!show) return null;
        return (
          <text key={d.date} x={lx(i)} y={H - 4}
            textAnchor="middle" fontSize="10" fill="#9ca3af">
            {new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
          </text>
        );
      })}

      {/* Tooltip */}
      {hovered !== null && (() => {
        const d = dailyTrend[hovered];
        const tx = lx(hovered);
        const tw = 130, th = 46;
        const tooltipX = Math.min(Math.max(tx - tw / 2, pL), W - pR - tw);
        const tooltipY = Math.max(Math.min(by(d.count), ly(d.avgDuration)) - th - 8, pT);
        return (
          <g pointerEvents="none">
            <rect x={tooltipX} y={tooltipY} width={tw} height={th} rx="6" fill="#1f2937" />
            <text x={tooltipX + tw / 2} y={tooltipY + 15} textAnchor="middle" fontSize="11" fill="white" fontWeight="600">
              {new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </text>
            <text x={tooltipX + 10} y={tooltipY + 33} fontSize="10" fill="#DD6B56">{d.count} ziyaret</text>
            <text x={tooltipX + 75} y={tooltipY + 33} fontSize="10" fill="#D4A0A0">{formatDuration(d.avgDuration)}</text>
          </g>
        );
      })()}
    </svg>
  );
}

function BotSection({ data }: { data: AnalyticsData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-700">Bot Ziyaretleri</span>
          <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-0.5 rounded-full">
            {data.botVisits} istek
          </span>
        </div>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-6 bg-white space-y-8">
          {/* Özet */}
          <p className="text-sm text-gray-500">
            Bunlar arama motoru tarayıcıları, önizleme botları ve otomatik isteklerdir. Ana istatistiklere dahil edilmemiştir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ülkeler */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Ülke</h3>
              <div className="space-y-2">
                {data.botTopCountries.map(({ country, count }) => (
                  <div key={country} className="flex justify-between text-sm">
                    <span className="text-gray-600">{country}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sayfalar */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">En Çok Taranan Sayfalar</h3>
              <div className="space-y-2">
                {data.botTopPages.map(({ page, count }) => (
                  <div key={page} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-4">{page}</span>
                    <span className="font-medium text-gray-800 shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Agent'lar */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">User Agent</h3>
            <div className="space-y-2">
              {data.botTopUAs.map(({ ua, count }) => (
                <div key={ua} className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500 truncate font-mono text-xs">{ua}</span>
                  <span className="font-medium text-gray-800 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Son bot istekleri */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Son Bot İstekleri</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-gray-500 uppercase">
                    <th className="pb-2 text-left pr-4">Sayfa</th>
                    <th className="pb-2 text-left pr-4">Ülke</th>
                    <th className="pb-2 text-left pr-4">User Agent</th>
                    <th className="pb-2 text-left">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.botRecentVisitors.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-700">{v.page}</td>
                      <td className="py-2 pr-4 text-gray-500">{v.country}</td>
                      <td className="py-2 pr-4 text-gray-400 font-mono text-xs max-w-xs truncate">{v.user_agent}</td>
                      <td className="py-2 text-gray-500 whitespace-nowrap">
                        {new Date(v.created_at).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}sn`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}dk ${secs}sn`;
  const hours = Math.floor(mins / 60);
  return `${hours}sa ${mins % 60}dk`;
}

export default function AnalyticsPage() {
  const { isAuthenticated, adminEmail, logout, loading: authLoading } = useAdmin();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sergenim/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  const maxHourly = data ? Math.max(...Object.values(data.hourlyStats), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ziyaretçi Analizi</h1>
            <p className="text-gray-600 mt-1">{adminEmail}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              ← Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#5C0A1A] hover:bg-[#7a1025] text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Zaman Filtresi */}
        <div className="mb-8 flex gap-3">
          {[
            { label: 'Bugün', value: 1 },
            { label: 'Son 7 Gün', value: 7 },
            { label: 'Son 30 Gün', value: 30 },
            { label: 'Son 90 Gün', value: 90 },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                days === opt.value
                  ? 'bg-[#5C0A1A] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Veriler yükleniyor...</p>
          </div>
        ) : data ? (
          <>
            {/* Özet Kartlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Toplam Ziyaret</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{data.totalVisits}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Benzersiz Oturum</p>
                <p className="text-4xl font-bold text-[#DD6B56] mt-2">{data.uniqueSessions}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Bugünkü Ziyaret</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{data.todayVisits}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Ort. Oturum Süresi</p>
                <p className="text-4xl font-bold text-[#5C0A1A] mt-2">{formatDuration(data.avgSessionDuration)}</p>
                <p className="text-xs text-gray-400 mt-1">Sayfa başı: {formatDuration(data.avgDuration)}</p>
              </div>
            </div>

            {/* Ziyaretçi Sayısı + Kalma Süresi Grafiği */}
            <div className="bg-white rounded-lg shadow p-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Ziyaretçi Sayısı & Kalma Süresi</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[#DD6B56] inline-block" /> Ziyaret
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#5C0A1A] inline-block" /> Ort. Süre
                  </span>
                </div>
              </div>
              <DailyChart dailyTrend={data.dailyTrend} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Saatlik Dağılım */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saatlik Dağılım</h2>
                <div className="flex items-end gap-0.5 h-32 overflow-hidden">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div
                        className="w-full bg-[#D57C68] rounded-t min-h-px"
                        style={{ height: `${((data.hourlyStats[i] || 0) / maxHourly) * 100}%` }}
                      />
                      {i % 4 === 0 && (
                        <span className="text-[9px] text-gray-400 mt-1">{i}:00</span>
                      )}
                      <div className="absolute -top-7 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {data.hourlyStats[i] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* En Çok Ziyaret Edilen Sayfalar + Süre */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">En Popüler Sayfalar</h2>
                <div className="space-y-3">
                  {data.topPages.map((p, i) => (
                    <div key={p.page} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-800 truncate">{p.page}</span>
                          <div className="flex gap-3 ml-2 shrink-0">
                            <span className="text-sm text-gray-600">{p.count} ziyaret</span>
                            <span className="text-sm text-[#5C0A1A]">⏱ {formatDuration(p.avgDuration)}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-[#DD6B56] h-1.5 rounded-full"
                            style={{ width: `${(p.count / (data.topPages[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Cihaz */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Cihaz</h2>
                <div className="space-y-3">
                  {Object.entries(data.deviceStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([device, count]) => {
                      const pct = Math.round((count / data.totalVisits) * 100);
                      return (
                        <div key={device} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{device}</span>
                          <span className="text-sm font-medium text-gray-900">{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Tarayıcı */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tarayıcı</h2>
                <div className="space-y-3">
                  {Object.entries(data.browserStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([browser, count]) => {
                      const pct = Math.round((count / data.totalVisits) * 100);
                      return (
                        <div key={browser} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{browser}</span>
                          <span className="text-sm font-medium text-gray-900">{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Ülke */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Ülke</h2>
                <div className="space-y-3">
                  {data.topCountries.map(({ country, count }) => {
                    const pct = Math.round((count / data.totalVisits) * 100);
                    return (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{country}</span>
                        <span className="text-sm font-medium text-gray-900">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Son Ziyaretçiler */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900">Son Ziyaretçiler</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sayfa</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Süre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cihaz</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tarayıcı</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">İşletim Sistemi</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Konum</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.recentVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{v.page}</td>
                        <td className="px-4 py-3 text-sm text-[#5C0A1A] font-medium">{v.duration > 0 ? formatDuration(v.duration) : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.device}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.browser}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.os}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.city}, {v.country}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(v.created_at).toLocaleString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Bot Ziyaretleri ── */}
            <BotSection data={data} />
          </>
        ) : (
          <p className="text-gray-600 text-center py-20">Veri bulunamadı</p>
        )}
      </main>
    </div>
  );
}
