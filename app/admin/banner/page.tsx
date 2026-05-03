'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';
import { ImageCropModal } from '@/components/ImageCropModal';

interface BannerSettings {
  items: string[];
  campaign_active: boolean;
  campaign_text: string;
  hero_image: string;
}

const DEFAULT_SETTINGS: BannerSettings = {
  items: ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'],
  campaign_active: false,
  campaign_text: '',
  hero_image: '/images/arkaplan.jpg',
};

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function AdminBannerPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<BannerSettings>(DEFAULT_SETTINGS);
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchSettings();
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/banner');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          items: data.items ?? DEFAULT_SETTINGS.items,
          campaign_active: data.campaign_active ?? false,
          campaign_text: data.campaign_text ?? '',
          hero_image: data.hero_image ?? DEFAULT_SETTINGS.hero_image,
        });
      }
    } catch {
      // varsayılan değerler kalır
    } finally {
      setLoading(false);
    }
  };

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
      fd.append('file', blob, 'hero.jpg');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev) => ({ ...prev, hero_image: data.url }));
        setMessage({ type: 'success', text: 'Görsel yüklendi! Kaydetmeyi unutmayın.' });
        setCropSrc(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Yükleme başarısız' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Yükleme sırasında hata oluştu' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/banner', {
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

  const addWord = () => {
    const word = newWord.trim();
    if (!word || settings.items.includes(word)) return;
    setSettings((prev) => ({ ...prev, items: [...prev.items, word] }));
    setNewWord('');
  };

  const removeWord = (index: number) =>
    setSettings((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const moveWord = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= settings.items.length) return;
    const items = [...settings.items];
    [items[index], items[next]] = [items[next], items[index]];
    setSettings((prev) => ({ ...prev, items }));
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
            <h1 className="text-2xl font-bold text-gray-900">Bant & Kampanya Yönetimi</h1>
            <p className="text-gray-500 text-sm mt-1">Anasayfadaki görseli, kayan bandı ve kampanya duyurularını düzenleyin</p>
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
                <h2 className="text-lg font-semibold text-gray-800">Anasayfa Görseli</h2>
                <p className="text-sm text-gray-500 mt-1">Anasayfadaki büyük arka plan görselini değiştirin.</p>
              </div>

              {/* Sürükle-bırak + tıkla yükleme alanı */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                  ${dragOver
                    ? 'border-[#DD6B56] bg-[#DD6B56]/5 scale-[1.01]'
                    : 'border-gray-300 hover:border-[#DD6B56] hover:bg-gray-50'
                  }
                  ${uploading ? 'cursor-not-allowed opacity-70' : ''}
                `}
              >
                {/* Mevcut görsel arka planda */}
                <div className="relative w-full h-56">
                  <Image
                    src={settings.hero_image}
                    alt="Hero görseli"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={settings.hero_image.startsWith('http')}
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors rounded-lg
                    ${dragOver ? 'bg-[#DD6B56]/60' : 'bg-black/40 hover:bg-black/50'}`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-white text-sm font-medium">Yükleniyor...</p>
                      </>
                    ) : dragOver ? (
                      <>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                          <path d="M20 21H4" />
                        </svg>
                        <p className="text-white text-sm font-semibold">Bırak!</p>
                      </>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <div className="text-center">
                          <p className="text-white text-sm font-semibold">Görseli buraya sürükle</p>
                          <p className="text-white/70 text-xs mt-0.5">veya tıkla ve seç</p>
                        </div>
                        <span className="text-white/50 text-xs">JPEG · PNG · WebP · Maks. 5 MB</span>
                      </>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                  aria-label="Hero görseli yükle"
                />
              </div>

              {/* Kırp butonu */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => loadForCrop(settings.hero_image)}
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

              {/* URL girişi */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Ya da görsel URL&apos;si girin:</p>
                <input
                  type="text"
                  value={settings.hero_image}
                  onChange={(e) => setSettings((prev) => ({ ...prev, hero_image: e.target.value }))}
                  placeholder="https://... veya /images/..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] font-mono"
                />
              </div>
            </div>

            {/* ── Bant Önizleme ── */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Bant Önizleme</h2>
              <div className="bg-[#2C2C2C] py-3 px-6 rounded overflow-hidden">
                <div className="flex items-center gap-6 text-[#E8E0D5]/80 text-xs tracking-widest uppercase font-serif flex-wrap">
                  {settings.campaign_active && settings.campaign_text ? (
                    <span className="text-[#DD6B56] font-semibold tracking-wider text-sm">{settings.campaign_text}</span>
                  ) : (
                    settings.items.map((word, i) => (
                      <span key={i} className="flex items-center gap-6">
                        <span>{word}</span>
                        {i < settings.items.length - 1 && <span className="text-[#DD6B56]">·</span>}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* ── Kampanya Duyurusu ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Kampanya Duyurusu</h2>
              <p className="text-sm text-gray-500">Aktif olduğunda bant kelimeleri yerine kampanya metni gösterilir.</p>

              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, campaign_active: !prev.campaign_active }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.campaign_active ? 'bg-[#DD6B56]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.campaign_active ? 'translate-x-6' : ''}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {settings.campaign_active ? 'Kampanya aktif' : 'Kampanya pasif'}
                </span>
              </label>

              <textarea
                value={settings.campaign_text}
                onChange={(e) => setSettings((prev) => ({ ...prev, campaign_text: e.target.value }))}
                placeholder="örn: %20 indirim — Sadece bu hafta sonu!"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] resize-none"
              />
            </div>

            {/* ── Bant Kelimeleri ── */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Bant Kelimeleri</h2>
              <p className="text-sm text-gray-500">Kampanya pasifken bu kelimeler döngüsel olarak gösterilir.</p>

              <ul className="space-y-2">
                {settings.items.map((word, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <span className="flex-1 font-medium text-gray-800">{word}</span>
                    <button type="button" onClick={() => moveWord(i, -1)} disabled={i === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-lg leading-none" title="Yukarı taşı">↑</button>
                    <button type="button" onClick={() => moveWord(i, 1)} disabled={i === settings.items.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-lg leading-none" title="Aşağı taşı">↓</button>
                    <button type="button" onClick={() => removeWord(i)}
                      className="text-red-400 hover:text-red-600 text-sm font-medium">Sil</button>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 mt-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWord()}
                  placeholder="Yeni kelime ekle..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56]"
                />
                <button type="button" onClick={addWord} disabled={!newWord.trim()}
                  className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-40 text-white font-medium px-5 py-2 rounded-lg text-sm transition">
                  Ekle
                </button>
              </div>
            </div>

            {/* ── Kaydet ── */}
            <div className="flex items-center gap-4 pb-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || settings.items.length === 0}
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
          onClose={() => { setCropSrc(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        />
      )}
    </div>
  );
}
