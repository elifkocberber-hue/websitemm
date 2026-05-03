'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';
import { ImageCropModal } from '@/components/ImageCropModal';

interface AboutSettings {
  hero_image: string;
  story_image: string;
  craft_image: string;
  founded: string;
  story_title: string;
  story_p1: string;
  story_p2: string;
  story_p3: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  stat4_value: string;
  stat4_label: string;
  val1_title: string;
  val1_desc: string;
  val2_title: string;
  val2_desc: string;
  val3_title: string;
  val3_desc: string;
  val4_title: string;
  val4_desc: string;
}

const DEFAULT: AboutSettings = {
  hero_image: 'https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80',
  story_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  craft_image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
  founded: 'Kuruluş · 1994',
  story_title: 'Topraktan\nDünyaya',
  story_p1: 'Üç kuşaklık seramik geleneğini taşıyan atölyemiz, 1994 yılında kuruldu.',
  story_p2: 'Her ürünümüz, el yapımı teknikleri ve ustalarımızın birikimi ile özenle şekillendirilir.',
  story_p3: 'Biz sadece ürün satmıyoruz — sanat ve kültüre saygı içinde yaratılan eserler sunuyoruz.',
  stat1_value: '30+',
  stat1_label: 'Yıl Deneyim',
  stat2_value: '400+',
  stat2_label: 'Benzersiz Tasarım',
  stat3_value: '%98',
  stat3_label: 'Müşteri Memnuniyeti',
  stat4_value: '3',
  stat4_label: 'Kuşak Gelenek',
  val1_title: 'Geleneksel Zanaat',
  val1_desc: 'Yüzyıllık seramik tekniklerini modern formlarla harmanlıyoruz.',
  val2_title: 'El Yapımı Kalite',
  val2_desc: 'Her parça, ustalarımızın deneyimli elleri tarafından tek tek şekillendirilir.',
  val3_title: 'Doğal Malzeme',
  val3_desc: 'En kaliteli topraklar ve organik cilalarla çevre dostu üretim yapıyoruz.',
  val4_title: 'Sürdürülebilirlik',
  val4_desc: 'Doğaya saygılı üretim süreçleriyle geleceğe yatırım yapıyoruz.',
};


function Field({
  id, label, value, onChange, multiline = false, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string;
}) {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] resize-y" />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56]" />
      )}
    </div>
  );
}

export default function AdminAboutPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [settings, setSettings] = useState<AboutSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [dragOver, setDragOver] = useState<'hero_image' | 'story_image' | 'craft_image' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const craftFileInputRef = useRef<HTMLInputElement>(null);

  // Kırpma modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [activeImageField, setActiveImageField] = useState<'hero_image' | 'story_image' | 'craft_image'>('hero_image');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/about')
        .then((r) => r.json())
        .then((d) => setSettings({ ...DEFAULT, ...d }))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const set = (key: keyof AboutSettings) => (value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const loadForCrop = useCallback(async (imageUrl: string, field: 'hero_image' | 'story_image' | 'craft_image') => {
    setLoadingCrop(true);
    setActiveImageField(field);
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

  const openFilePicker = (field: 'hero_image' | 'story_image' | 'craft_image') => {
    setActiveImageField(field);
    if (field === 'hero_image') heroFileInputRef.current?.click();
    else if (field === 'story_image') storyFileInputRef.current?.click();
    else craftFileInputRef.current?.click();
  };

  const uploadFile = useCallback((file: File, field: 'hero_image' | 'story_image' | 'craft_image') => {
    const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!ACCEPTED.includes(file.type)) {
      setMessage({ type: 'error', text: 'Desteklenen formatlar: JPEG, PNG, WebP' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Dosya 10 MB\'dan küçük olmalıdır' });
      return;
    }
    setActiveImageField(field);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCropConfirm = useCallback(async (blob: Blob) => {
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('file', blob, `${activeImageField}.jpg`);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev) => ({ ...prev, [activeImageField]: data.url }));
        setMessage({ type: 'success', text: 'Görsel yüklendi! Kaydetmeyi unutmayın.' });
        setCropSrc(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Yükleme başarısız' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Yükleme sırasında hata oluştu' });
    } finally {
      setUploading(false);
      heroFileInputRef.current && (heroFileInputRef.current.value = '');
      storyFileInputRef.current && (storyFileInputRef.current.value = '');
      craftFileInputRef.current && (craftFileInputRef.current.value = '');
    }
  }, [activeImageField]);

  const handleFileInput = (field: 'hero_image' | 'story_image' | 'craft_image') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, field);
  };

  const handleDrop = (field: 'hero_image' | 'story_image' | 'craft_image') => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file, field);
  };

  const handleDragOver = (field: 'hero_image' | 'story_image' | 'craft_image') => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(field);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/about', {
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
            <h1 className="text-2xl font-bold text-gray-900">Hikayemiz Yönetimi</h1>
            <p className="text-gray-500 text-sm mt-1">Hikayemiz sayfasındaki içerikleri düzenleyin</p>
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
            {/* ── Hero Görseli ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Hero Görseli</h2>
                <p className="text-sm text-gray-500 mt-1">Hikayemiz sayfasının üst arka plan görseli.</p>
              </div>

              <div
                onDrop={handleDrop('hero_image')}
                onDragOver={handleDragOver('hero_image')}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && openFilePicker('hero_image')}
                className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                  ${dragOver === 'hero_image' ? 'border-[#DD6B56] bg-[#DD6B56]/5 scale-[1.01]' : 'border-gray-300 hover:border-[#DD6B56] hover:bg-gray-50'}
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={settings.hero_image}
                    alt="Hero önizleme"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={settings.hero_image.startsWith('http')}
                  />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors rounded-lg
                    ${dragOver === 'hero_image' ? 'bg-[#DD6B56]/60' : 'bg-black/40 hover:bg-black/50'}`}
                  >
                    {dragOver === 'hero_image' ? (
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
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput('hero_image')}
                  className="hidden"
                  aria-label="Hero görseli yükle"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => loadForCrop(settings.hero_image, 'hero_image')}
                  disabled={loadingCrop || uploading}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#DD6B56] border border-gray-300 hover:border-[#DD6B56] rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                  {loadingCrop && activeImageField === 'hero_image' ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg>
                  )}
                  Mevcut görseli kırp
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Ya da görsel URL&apos;si girin:</p>
                <Field id="hero_image" label="" value={settings.hero_image} onChange={set('hero_image')} />
              </div>
            </div>

            {/* ── Hikaye Görseli ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Hikaye Görseli</h2>
                <p className="text-sm text-gray-500 mt-1">Hikaye bölümünün sağında görünen dikey görsel (vazo fotoğrafı vb.).</p>
              </div>

              <div
                onDrop={handleDrop('story_image')}
                onDragOver={handleDragOver('story_image')}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && openFilePicker('story_image')}
                className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                  ${dragOver === 'story_image' ? 'border-[#DD6B56] bg-[#DD6B56]/5 scale-[1.01]' : 'border-gray-300 hover:border-[#DD6B56] hover:bg-gray-50'}
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <div className="relative w-48 mx-auto aspect-[4/5]">
                  <Image
                    src={settings.story_image}
                    alt="Hikaye görseli önizleme"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={settings.story_image.startsWith('http')}
                  />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors rounded-lg
                    ${dragOver === 'story_image' ? 'bg-[#DD6B56]/60' : 'bg-black/40 hover:bg-black/50'}`}
                  >
                    {dragOver === 'story_image' ? (
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
                  ref={storyFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput('story_image')}
                  className="hidden"
                  aria-label="Hikaye görseli yükle"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => loadForCrop(settings.story_image, 'story_image')}
                  disabled={loadingCrop || uploading}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#DD6B56] border border-gray-300 hover:border-[#DD6B56] rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                  {loadingCrop && activeImageField === 'story_image' ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg>
                  )}
                  Mevcut görseli kırp
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Ya da görsel URL&apos;si girin:</p>
                <Field id="story_image" label="" value={settings.story_image} onChange={set('story_image')} />
              </div>
            </div>

            {/* ── Zanaat Görseli ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Zanaat Görseli</h2>
                <p className="text-sm text-gray-500 mt-1">Anasayfadaki &quot;Hikayemiz&quot; bölümünde ve Hikayemiz sayfasındaki parallax bantında görünen görsel.</p>
              </div>

              <div
                onDrop={handleDrop('craft_image')}
                onDragOver={handleDragOver('craft_image')}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && openFilePicker('craft_image')}
                className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                  ${dragOver === 'craft_image' ? 'border-[#DD6B56] bg-[#DD6B56]/5 scale-[1.01]' : 'border-gray-300 hover:border-[#DD6B56] hover:bg-gray-50'}
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={settings.craft_image}
                    alt="Zanaat görseli önizleme"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={settings.craft_image.startsWith('http')}
                  />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors rounded-lg
                    ${dragOver === 'craft_image' ? 'bg-[#DD6B56]/60' : 'bg-black/40 hover:bg-black/50'}`}
                  >
                    {dragOver === 'craft_image' ? (
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
                  ref={craftFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput('craft_image')}
                  className="hidden"
                  aria-label="Zanaat görseli yükle"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => loadForCrop(settings.craft_image, 'craft_image')}
                  disabled={loadingCrop || uploading}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#DD6B56] border border-gray-300 hover:border-[#DD6B56] rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                  {loadingCrop && activeImageField === 'craft_image' ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg>
                  )}
                  Mevcut görseli kırp
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Ya da görsel URL&apos;si girin:</p>
                <Field id="craft_image" label="" value={settings.craft_image} onChange={set('craft_image')} />
              </div>
            </div>

            {/* ── Hikaye Metni ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Hikaye Bölümü</h2>
              <Field id="founded" label="Kuruluş etiketi" value={settings.founded} onChange={set('founded')} hint='Örn: "Kuruluş · 1994"' />
              <Field id="story_title" label="Başlık" value={settings.story_title} onChange={set('story_title')} multiline hint='Satır kesmek için Enter kullanın.' />
              <Field id="story_p1" label="1. Paragraf" value={settings.story_p1} onChange={set('story_p1')} multiline />
              <Field id="story_p2" label="2. Paragraf" value={settings.story_p2} onChange={set('story_p2')} multiline />
              <Field id="story_p3" label="3. Paragraf" value={settings.story_p3} onChange={set('story_p3')} multiline />
            </div>

            {/* ── İstatistikler ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">İstatistikler</h2>
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="grid grid-cols-2 gap-4">
                  <Field id={`stat${n}_value`} label={`${n}. Değer`} value={settings[`stat${n}_value`]} onChange={set(`stat${n}_value`)} hint='Örn: "30+", "%98"' />
                  <Field id={`stat${n}_label`} label={`${n}. Etiket`} value={settings[`stat${n}_label`]} onChange={set(`stat${n}_label`)} hint='Örn: "Yıl Deneyim"' />
                </div>
              ))}
            </div>

            {/* ── Değerlerimiz ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Değerlerimiz</h2>
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="space-y-2 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{n}. Değer</p>
                  <Field id={`val${n}_title`} label="Başlık" value={settings[`val${n}_title`]} onChange={set(`val${n}_title`)} />
                  <Field id={`val${n}_desc`} label="Açıklama" value={settings[`val${n}_desc`]} onChange={set(`val${n}_desc`)} multiline />
                </div>
              ))}
            </div>

            {/* ── Kaydet ── */}
            <div className="flex items-center gap-4 pb-8">
              <button type="button" onClick={handleSave} disabled={saving}
                className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition">
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

      {/* ── Kırpma Modalı ── */}
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          aspect={activeImageField === 'story_image' ? 4 / 5 : activeImageField === 'craft_image' ? 16 / 9 : 16 / 6}
          uploading={uploading}
          onConfirm={handleCropConfirm}
          onClose={() => {
            setCropSrc(null);
            heroFileInputRef.current && (heroFileInputRef.current.value = '');
            storyFileInputRef.current && (storyFileInputRef.current.value = '');
            craftFileInputRef.current && (craftFileInputRef.current.value = '');
          }}
        />
      )}
    </div>
  );
}
