'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/countries';

interface Rate {
  code: string;
  name: string;
  cost: number;
  freeOverThreshold: boolean;
}

export default function ShippingAdminPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [rates, setRates] = useState<Rate[]>([]);
  const [threshold, setThreshold] = useState<string>(''); // '' = kapalı
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Yeni ülke ekleme formu
  const [newCountry, setNewCountry] = useState('');
  const [newCost, setNewCost] = useState('');

  // Satır düzenleme (ücret alanları için yerel taslak değerler)
  const [draftCosts, setDraftCosts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sergenim/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/shipping');
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates ?? []);
        setThreshold(data.threshold === null || data.threshold === undefined ? '' : String(data.threshold));
        setDraftCosts({});
      }
    } catch {
      showMessage('error', 'Veriler alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const saveThreshold = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: threshold.trim() === '' ? null : Number(threshold) }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', threshold.trim() === '' ? 'Ücretsiz kargo eşiği kapatıldı' : 'Eşik kaydedildi');
      } else {
        showMessage('error', data.error || 'Kaydedilemedi');
      }
    } catch {
      showMessage('error', 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const saveRate = async (code: string, cost: number, freeOverThreshold: boolean) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: { countryCode: code, cost, freeOverThreshold } }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', 'Kaydedildi');
        await fetchData();
      } else {
        showMessage('error', data.error || 'Kaydedilemedi');
      }
    } catch {
      showMessage('error', 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const addCountry = async () => {
    if (!newCountry) { showMessage('error', 'Ülke seçin'); return; }
    const cost = Number(newCost);
    if (!Number.isFinite(cost) || cost < 0) { showMessage('error', 'Geçerli bir kargo ücreti girin'); return; }
    await saveRate(newCountry, cost, false);
    setNewCountry('');
    setNewCost('');
  };

  const deleteRate = async (code: string, name: string) => {
    if (!confirm(`${name} kaydını silmek istediğinize emin misiniz?\n\nBu ülkeye satış KAPANIR — müşteri "gönderim yapmıyoruz" mesajı görür.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/shipping?code=${code}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', `${name} silindi — bu ülkeye satış kapatıldı`);
        await fetchData();
      } else {
        showMessage('error', 'Silinemedi');
      }
    } catch {
      showMessage('error', 'Silinemedi');
    } finally {
      setSaving(false);
    }
  };

  // Henüz eklenmemiş ülkeler (ekleme dropdown'ı için)
  const availableCountries = COUNTRIES.filter((c) => !rates.some((r) => r.code === c.code));

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kargo Ücretleri</h1>
            <p className="text-sm text-gray-500 mt-1">
              Yalnız burada ücreti tanımlı ülkelere satış yapılır. Listede olmayan ülkeyi seçen müşteri
              &quot;gönderim yapmıyoruz&quot; mesajı görür.
            </p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-[#DD6B56] hover:text-[#C45540] font-medium">
            ← Panele Dön
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Ücretsiz kargo eşiği */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Ücretsiz Kargo Eşiği</h2>
          <p className="text-sm text-gray-500 mb-4">
            Sepet ara toplamı bu tutarı geçen siparişlerde kargo ücretsiz olur — yalnız aşağıda
            &quot;Eşik geçerli&quot; işaretli ülkelerde. Boş bırakıp kaydederseniz eşik tamamen kapanır.
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Örn: 1500"
                className="w-40 border border-gray-300 rounded-lg pl-4 pr-8 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
            </div>
            <button
              type="button"
              onClick={saveThreshold}
              disabled={saving}
              className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              Kaydet
            </button>
            {threshold.trim() === '' && (
              <span className="text-sm text-gray-400">Eşik şu an kapalı</span>
            )}
          </div>
        </section>

        {/* Ülke listesi */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ülke Bazlı Kargo Ücretleri</h2>

          {loading ? (
            <p className="text-gray-500 py-8 text-center">Yükleniyor...</p>
          ) : rates.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              Henüz ülke eklenmemiş. Aşağıdan ülke ekleyin — eklemediğiniz ülkelere satış yapılmaz.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {rates.map((rate) => {
                const draft = draftCosts[rate.code] ?? String(rate.cost);
                const draftNum = Number(draft);
                const changed = Number.isFinite(draftNum) && draftNum !== rate.cost;
                return (
                  <div key={rate.code} className="py-3 flex flex-wrap items-center gap-3">
                    <div className="w-44 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{rate.name}</p>
                      <p className="text-xs text-gray-400">{rate.code}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft}
                        onChange={(e) => setDraftCosts((prev) => ({ ...prev, [rate.code]: e.target.value }))}
                        className="w-32 border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                        aria-label={`${rate.name} kargo ücreti`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rate.freeOverThreshold}
                        onChange={(e) => saveRate(rate.code, Number.isFinite(draftNum) ? draftNum : rate.cost, e.target.checked)}
                        className="w-4 h-4 accent-[#5C0A1A]"
                      />
                      Eşik geçerli
                    </label>
                    <div className="ml-auto flex items-center gap-2">
                      {changed && (
                        <button
                          type="button"
                          onClick={() => saveRate(rate.code, draftNum, rate.freeOverThreshold)}
                          disabled={saving}
                          className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition"
                        >
                          Kaydet
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteRate(rate.code, rate.name)}
                        disabled={saving}
                        className="text-red-500 hover:text-red-700 text-sm font-medium py-1.5 px-2 transition"
                        title="Sil — bu ülkeye satış kapanır"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Yeni ülke ekle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ülke Ekle</h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none min-w-52"
                aria-label="Ülke seç"
              >
                <option value="">Ülke seçin...</option>
                {availableCountries.map((c) => (
                  <option key={c.code} value={c.code}>{c.tr}</option>
                ))}
              </select>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="Kargo ücreti"
                  className="w-36 border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
              </div>
              <button
                type="button"
                onClick={addCountry}
                disabled={saving}
                className="bg-[#5C0A1A] hover:bg-[#7a1025] disabled:opacity-50 text-white font-medium py-2.5 px-6 rounded-lg transition"
              >
                Ekle
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
