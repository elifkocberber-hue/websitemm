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

  const maxDaily = data ? Math.max(...data.dailyTrend.map(d => d.count), 1) : 1;
  const maxDailyDuration = data ? Math.max(...data.dailyTrend.map(d => d.avgDuration), 1) : 1;
  const maxHourly = data ? Math.max(...Object.values(data.hourlyStats), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Ziyaretçi Analizi</h1>
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
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Ziyaretçi Sayısı & Kalma Süresi</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[#DD6B56] inline-block" /> Ziyaret
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[#5C0A1A] inline-block" /> Ort. Süre
                  </span>
                </div>
              </div>
              <div className="relative">
                {/* Y ekseni etiketleri - sol (ziyaret) */}
                <div className="absolute left-0 top-0 h-56 flex flex-col justify-between text-xs text-gray-400 -ml-1">
                  <span>{maxDaily}</span>
                  <span>{Math.round(maxDaily / 2)}</span>
                  <span>0</span>
                </div>
                {/* Y ekseni etiketleri - sağ (süre) */}
                <div className="absolute right-0 top-0 h-56 flex flex-col justify-between text-xs text-[#5C0A1A]/60 -mr-1">
                  <span>{formatDuration(maxDailyDuration)}</span>
                  <span>{formatDuration(Math.round(maxDailyDuration / 2))}</span>
                  <span>0</span>
                </div>
                {/* Grafik alanı */}
                <div className="ml-8 mr-12">
                  {/* Yatay çizgiler */}
                  <div className="relative h-56 border-b border-gray-200">
                    <div className="absolute w-full h-px bg-gray-100 top-0" />
                    <div className="absolute w-full h-px bg-gray-100 top-1/2" />
                    
                    {/* Barlar ve çizgi grafiği */}
                    <div className="flex items-end gap-1 h-full">
                      {data.dailyTrend.map((d, i) => {
                        const barHeight = (d.count / maxDaily) * 100;
                        const dotBottom = maxDailyDuration > 0 ? (d.avgDuration / maxDailyDuration) * 100 : 0;
                        return (
                          <div key={d.date} className="flex-1 relative group h-full flex items-end">
                            {/* Ziyaret barı */}
                            <div
                              className="w-full bg-[#DD6B56]/80 rounded-t hover:bg-[#DD6B56] transition-colors min-h-0.5"
                              style={{ height: `${barHeight}%` }}
                            />
                            {/* Süre noktası */}
                            <div
                              className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#5C0A1A] border-2 border-white shadow-sm z-10"
                              style={{ bottom: `${dotBottom}%` }}
                            />
                            {/* Çizgi (sonraki noktaya) */}
                            {i < data.dailyTrend.length - 1 && (() => {
                              const nextDot = maxDailyDuration > 0 ? (data.dailyTrend[i + 1].avgDuration / maxDailyDuration) * 100 : 0;
                              const currentDot = dotBottom;
                              const rise = nextDot - currentDot;
                              const barWidth = 100; // yüzde
                              const angle = Math.atan2((-rise * 2.24) / 100, 1) * (180 / Math.PI);
                              const length = Math.sqrt(1 + Math.pow((rise * 2.24) / 100, 2)) * 100;
                              return (
                                <div
                                  className="absolute z-5 h-0.5 bg-[#5C0A1A]/50 origin-left"
                                  style={{
                                    bottom: `${currentDot}%`,
                                    left: '50%',
                                    width: `${length}%`,
                                    transform: `rotate(${angle}deg)`,
                                  }}
                                />
                              );
                            })()}
                            {/* Tooltip */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                              <div className="font-semibold">{new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</div>
                              <div className="flex gap-3 mt-1">
                                <span className="text-[#DD6B56]">🧑 {d.count} ziyaret</span>
                                <span className="text-[#D57C68]">⏱ {formatDuration(d.avgDuration)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Tarih etiketleri */}
                  <div className="flex gap-1 mt-2">
                    {data.dailyTrend.map((d, i) => (
                      <div key={d.date} className="flex-1 text-center">
                        {(data.dailyTrend.length <= 14 || i % Math.ceil(data.dailyTrend.length / 14) === 0) && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Saatlik Dağılım */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saatlik Dağılım</h2>
                <div className="flex items-end gap-0.5 h-32">
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
                      const icon = device === 'Mobile' ? '📱' : device === 'Tablet' ? '📋' : '🖥️';
                      const pct = Math.round((count / data.totalVisits) * 100);
                      return (
                        <div key={device} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{icon} {device}</span>
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
          </>
        ) : (
          <p className="text-gray-600 text-center py-20">Veri bulunamadı</p>
        )}
      </main>
    </div>
  );
}
