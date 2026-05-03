'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string | null;
}

const SLOT_LABELS = ['Sol Büyük', 'Sağ Üst', 'Sağ Orta', 'Alt Geniş'];

export default function AdminFeaturedPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredIds, setFeaturedIds] = useState<(number | string)[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/admin/featured')
      .then((r) => r.json())
      .then((d) => {
        setAllProducts(d.products ?? []);
        setFeaturedIds(d.featuredIds ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const featuredProducts = featuredIds
    .map((id) => allProducts.find((p) => String(p.id) === String(id)))
    .filter(Boolean) as Product[];

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) => !featuredIds.some((id) => String(id) === String(p.id)) &&
        p.name.toLowerCase().includes(q)
    );
  }, [allProducts, featuredIds, search]);

  const addToFeatured = (product: Product) => {
    if (featuredIds.length >= 4) return;
    setFeaturedIds((prev) => [...prev, product.id]);
    setMessage(null);
  };

  const removeFromFeatured = (id: number | string) => {
    setFeaturedIds((prev) => prev.filter((fid) => String(fid) !== String(id)));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFeaturedIds((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= featuredIds.length - 1) return;
    setFeaturedIds((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Kaydedildi!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Bir hata oluştu' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">Yükleniyor...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">⭐ Öne Çıkan Eserler</h1>
            <p className="text-gray-500 text-sm mt-1">Anasayfada gösterilecek 4 ürünü seçin ve sıralayın</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900 underline">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : (
          <>
            {/* ── Seçili Slotlar ── */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Seçili Ürünler
                  <span className={`ml-2 text-sm font-normal px-2 py-0.5 rounded-full ${featuredIds.length === 4 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {featuredIds.length} / 4
                  </span>
                </h2>
              </div>

              {/* Anasayfa düzeni gösterimi */}
              <div className="mb-5 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wider">Anasayfa Düzeni</p>
                <div className="grid grid-cols-3 gap-1.5 h-28">
                  <div className="row-span-2 bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500 font-medium">1 — Sol Büyük</div>
                  <div className="bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500 font-medium">2 — Sağ Üst</div>
                  <div className="bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500 font-medium">3 — Sağ Orta</div>
                  <div className="col-span-2 bg-stone-200 rounded flex items-center justify-center text-xs text-stone-500 font-medium">4 — Alt Geniş</div>
                </div>
              </div>

              <div className="space-y-2">
                {[0, 1, 2, 3].map((slot) => {
                  const product = featuredProducts[slot];
                  return (
                    <div
                      key={slot}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${product ? 'border-amber-200 bg-amber-50' : 'border-dashed border-gray-200 bg-gray-50'}`}
                    >
                      <span className="w-6 h-6 flex-shrink-0 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                        {slot + 1}
                      </span>

                      {product ? (
                        <>
                          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('http')} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">₺{product.price.toLocaleString('tr-TR')}</p>
                          </div>
                          <p className="text-xs text-stone-400 hidden sm:block flex-shrink-0">{SLOT_LABELS[slot]}</p>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveUp(slot)} disabled={slot === 0}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded hover:bg-gray-100 transition">↑</button>
                            <button type="button" onClick={() => moveDown(slot)} disabled={slot >= featuredIds.length - 1}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded hover:bg-gray-100 transition">↓</button>
                            <button type="button" onClick={() => removeFromFeatured(product.id)}
                              className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition text-lg leading-none">×</button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Boş — aşağıdan ürün ekleyin</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Tüm Ürünler ── */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Tüm Ürünler</h2>
                <span className="text-xs text-gray-400">{filteredProducts.length} ürün</span>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] mb-4"
              />

              {filteredProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  {search ? 'Arama sonucu bulunamadı.' : 'Tüm ürünler zaten seçili.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={String(product.id)}
                      type="button"
                      onClick={() => addToFeatured(product)}
                      disabled={featuredIds.length >= 4}
                      className="group relative text-left border border-gray-100 rounded-xl overflow-hidden hover:border-amber-400 hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('http')} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">[ ]</div>
                        )}
                        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/20 transition flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow">+</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">₺{product.price.toLocaleString('tr-TR')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Kaydet ── */}
            <div className="flex items-center gap-4 pb-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || featuredIds.length === 0}
                className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {message && (
                <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </span>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
