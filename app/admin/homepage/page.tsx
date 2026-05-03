'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';
import { ImageCropModal } from '@/components/ImageCropModal';

interface HomepageSettings {
  cta_image: string;
  cta_overlay_opacity: number;
  hero_subtitle: string;
  hero_title: string;
  hero_desc: string;
  collection_label: string;
  featured_title: string;
  philosophy_label: string;
  philosophy_title: string;
  philosophy_desc: string;
  pillar1_title: string;
  pillar1_desc: string;
  pillar2_title: string;
  pillar2_desc: string;
  pillar3_title: string;
  pillar3_desc: string;
  cta_title: string;
  cta_btn: string;
  newsletter_title: string;
  newsletter_desc: string;
}

const DEFAULT: HomepageSettings = {
  cta_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&q=80',
  hero_subtitle: 'El Yapımı Seramik Ürünler & Hediyeler',
  hero_title: 'Fırından Yeni Çıkan\nMutluluklar',
  hero_desc: 'Doğanın toprağından, ustalarımızın elleriyle şekillenen; evinize anlam ve güzellik katan eserler.',
  collection_label: 'Koleksiyon',
  featured_title: 'Öne Çıkan Eserler',
  philosophy_label: 'Felsefemiz',
  philosophy_title: 'Wabi-Sabi',
  philosophy_desc: 'Kusursuzlukta güzellik aramıyoruz. Her çatlak, her doku, her asimetri — tabiatın ve insan elinin imzası.',
  pillar1_title: 'Geleneksel Zanaat',
  pillar1_desc: 'Yüzyıllık teknikleri modern formlarla buluşturuyoruz.',
  pillar2_title: 'Doğal Malzeme',
  pillar2_desc: 'En kaliteli topraklar ve organik cilalarla üretiyoruz.',
  pillar3_title: 'Benzersiz Tasarım',
  pillar3_desc: 'Her parça tek ve tekrarlanamaz bir sanat eseridir.',
  cta_overlay_opacity: 60,
  cta_title: 'Evinize Sanat Katın',
  cta_btn: 'Alışverişe Başla',
  newsletter_title: 'Haberdar Olun',
  newsletter_desc: 'Yeni koleksiyonlar, özel teklifler ve atölyeden haberler.',
};

function Field({
  id,
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] resize-y"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56]"
        />
      )}
    </div>
  );
}

export default function AdminHomepagePage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const ctaFileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/homepage')
        .then((r) => r.json())
        .then((d) => setSettings({ ...DEFAULT, ...d }))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const set = (key: keyof HomepageSettings) => (value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const loadForCrop = useCallback(async (imageUrl: string) => {
    setLoadingCrop(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/proxy-image?url=${encodeURIComponent(imageUrl)}`);
      const data = await res.json();
      if (res.ok && data.dataUrl) {
        setCropSrc(data.dataUrl);
      } else {
        setMessage({ type: 'error', text: 'Görsel kırpma için yüklenemedi' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Görsel kırpma için yüklenemedi' });
    } finally {
      setLoadingCrop(false);
    }
  }, []);

  const uploadFile = useCallback((file: File) => {
    const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!ACCEPTED.includes(file.type)) {
      setMessage({ type: 'error', text: 'Desteklenen formatlar: JPEG, PNG, WebP' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Dosya 10 MB\'dan küçük olmalıdır' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCropConfirm = useCallback(async (blob: Blob) => {
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('file', blob, 'cta.jpg');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev) => ({ ...prev, cta_image: data.url }));
        setMessage({ type: 'success', text: 'Görsel yüklendi! Kaydetmeyi unutmayın.' });
        setCropSrc(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Yükleme başarısız' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Yükleme sırasında hata oluştu' });
    } finally {
      setUploading(false);
      if (ctaFileInputRef.current) ctaFileInputRef.current.value = '';
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Anasayfa Metin Yönetimi</h1>
            <p className="text-gray-500 text-sm mt-1">Anasayfadaki tüm metin alanlarını düzenleyin</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900 underline">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : (
          <>
            {/* ── Hero ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Hero Bölümü</h2>
              <Field id="hero_subtitle" label="Alt başlık" value={settings.hero_subtitle} onChange={set('hero_subtitle')} hint='Örn: "El Yapımı Seramik Ürünler & Hediyeler"' />
              <Field id="hero_title" label="Ana başlık" value={settings.hero_title} onChange={set('hero_title')} multiline hint='Satır kesmek için Enter kullanın.' />
              <Field id="hero_desc" label="Açıklama metni" value={settings.hero_desc} onChange={set('hero_desc')} multiline />
            </div>

            {/* ── Öne Çıkan Ürünler ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Öne Çıkan Ürünler Bölümü</h2>
              <Field id="collection_label" label="Bölüm etiketi" value={settings.collection_label} onChange={set('collection_label')} hint='Örn: "Koleksiyon"' />
              <Field id="featured_title" label="Başlık" value={settings.featured_title} onChange={set('featured_title')} hint='Örn: "Öne Çıkan Eserler"' />
            </div>

            {/* ── Felsefe ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Felsefe Bölümü</h2>
              <Field id="philosophy_label" label="Bölüm etiketi" value={settings.philosophy_label} onChange={set('philosophy_label')} hint='Örn: "Felsefemiz"' />
              <Field id="philosophy_title" label="Başlık" value={settings.philosophy_title} onChange={set('philosophy_title')} hint='Örn: "Wabi-Sabi"' />
              <Field id="philosophy_desc" label="Açıklama" value={settings.philosophy_desc} onChange={set('philosophy_desc')} multiline />

              <div className="pt-2 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">3 Sütun</p>
                {([1, 2, 3] as const).map((n) => (
                  <div key={n} className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <Field
                      id={`pillar${n}_title`}
                      label={`${n}. Sütun Başlığı`}
                      value={settings[`pillar${n}_title`]}
                      onChange={set(`pillar${n}_title`)}
                    />
                    <Field
                      id={`pillar${n}_desc`}
                      label={`${n}. Sütun Açıklaması`}
                      value={settings[`pillar${n}_desc`]}
                      onChange={set(`pillar${n}_desc`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">CTA Bölümü</h2>
                <p className="text-sm text-gray-500 mt-1">&quot;Evinize Sanat Katın — Alışverişe Başla&quot; bölümünün arka plan görseli ve metinleri.</p>
              </div>

              {/* Görsel yükleme */}
              <div
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onClick={() => !uploading && ctaFileInputRef.current?.click()}
                className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                  ${dragOver ? 'border-[#DD6B56] bg-[#DD6B56]/5 scale-[1.01]' : 'border-gray-300 hover:border-[#DD6B56] hover:bg-gray-50'}
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={settings.cta_image}
                    alt="CTA arka plan önizleme"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={settings.cta_image.startsWith('http')}
                  />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors rounded-lg
                    ${dragOver ? 'bg-[#DD6B56]/60' : 'bg-black/40 hover:bg-black/50'}`}
                  >
                    {dragOver ? (
                      <>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /><path d="M20 21H4" />
                        </svg>
                        <p className="text-white text-sm font-semibold">Bırak!</p>
                      </>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        <div className="text-center">
                          <p className="text-white text-sm font-semibold">Görseli buraya sürükle</p>
                          <p className="text-white/70 text-xs mt-0.5">veya tıkla ve seç</p>
                        </div>
                        <span className="text-white/50 text-xs">JPEG · PNG · WebP · Maks. 10 MB</span>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={ctaFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
                  className="hidden"
                  aria-label="CTA arka plan görseli yükle"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => loadForCrop(settings.cta_image)}
                  disabled={loadingCrop || uploading}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#DD6B56] border border-gray-300 hover:border-[#DD6B56] rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                  {loadingCrop ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/>
                    </svg>
                  )}
                  Mevcut görseli kırp
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1.5">Ya da görsel URL&apos;si girin:</p>
                <Field id="cta_image" label="" value={settings.cta_image} onChange={set('cta_image')} />
              </div>

              {/* Overlay opaklık slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Karartma Opaklığı</label>
                  <span className="text-sm font-semibold text-[#DD6B56] w-10 text-right">%{settings.cta_overlay_opacity}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.cta_overlay_opacity}
                  onChange={(e) => setSettings((prev) => ({ ...prev, cta_overlay_opacity: Number(e.target.value) }))}
                  className="w-full accent-[#DD6B56]"
                  aria-label="Karartma opaklığı"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>%0 — Görsel net</span>
                  <span>%100 — Tam siyah</span>
                </div>
              </div>

              <Field id="cta_title" label="Başlık" value={settings.cta_title} onChange={set('cta_title')} hint='Örn: "Evinize Sanat Katın"' />
              <Field id="cta_btn" label="Buton metni" value={settings.cta_btn} onChange={set('cta_btn')} hint='Örn: "Alışverişe Başla"' />
            </div>

            {/* ── Newsletter ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Bülten Bölümü</h2>
              <Field id="newsletter_title" label="Başlık" value={settings.newsletter_title} onChange={set('newsletter_title')} hint='Örn: "Haberdar Olun"' />
              <Field id="newsletter_desc" label="Açıklama" value={settings.newsletter_desc} onChange={set('newsletter_desc')} multiline />
            </div>

            {/* ── Kaydet ── */}
            <div className="flex items-center gap-4 pb-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
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

      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          aspect={16 / 9}
          uploading={uploading}
          onConfirm={handleCropConfirm}
          onClose={() => { setCropSrc(null); if (ctaFileInputRef.current) ctaFileInputRef.current.value = ''; }}
        />
      )}
    </div>
  );
}
