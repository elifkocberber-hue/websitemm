'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';

interface AboutSettings {
  hero_image: string;
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

// Field bileşeni dışarıda tanımlı — her render'da yeniden oluşturulmaz, focus kaybı olmaz
function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  id: string;
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

export default function AdminAboutPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [settings, setSettings] = useState<AboutSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchSettings();
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/about');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULT, ...data });
      }
    } catch {
      // varsayılan değerler kalır
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof AboutSettings) => (value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

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
            <h1 className="text-2xl font-bold text-gray-900">📖 Hikayemiz Yönetimi</h1>
            <p className="text-gray-500 text-sm mt-1">Hakkımızda sayfasındaki içerikleri düzenleyin</p>
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
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Hero Görseli</h2>
              <p className="text-sm text-gray-500">Hakkımızda sayfasının üst arka plan görseli.</p>
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={settings.hero_image}
                  alt="Hero önizleme"
                  fill
                  className="object-cover"
                  unoptimized={settings.hero_image.startsWith('http')}
                />
              </div>
              <Field id="hero_image" label="Görsel URL'si" value={settings.hero_image} onChange={set('hero_image')} />
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
                  <Field
                    id={`stat${n}_value`}
                    label={`${n}. Değer`}
                    value={settings[`stat${n}_value`]}
                    onChange={set(`stat${n}_value`)}
                    hint='Örn: "30+", "%98"'
                  />
                  <Field
                    id={`stat${n}_label`}
                    label={`${n}. Etiket`}
                    value={settings[`stat${n}_label`]}
                    onChange={set(`stat${n}_label`)}
                    hint='Örn: "Yıl Deneyim"'
                  />
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
    </div>
  );
}
