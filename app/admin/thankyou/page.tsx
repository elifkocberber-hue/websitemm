'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

export default function AdminThankYouPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/thankyou')
        .then(r => r.json())
        .then(d => { setTitle(d.title || ''); setBody(d.body || ''); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/thankyou', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Teşekkür metni kaydedildi' });
      } else {
        setMessage({ type: 'error', text: 'Kaydetme başarısız' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Bir hata oluştu' });
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
            <h1 className="text-2xl font-bold text-gray-900">Ödeme Sonrası Metin</h1>
            <p className="text-gray-500 text-sm mt-1">Ödeme başarılı olduğunda gösterilen "Teşekkürler" sayfası metni</p>
          </div>
          <Link href="/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition">
            Dashboard
          </Link>
        </div>
      </header>

      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.text}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metin</label>
                <p className="text-xs text-gray-500 mb-2">
                  Her paragrafı boş bir satırla ayırın. Tırnak (&quot;...&quot;) ile başlayan paragraf vurgulu (italik) gösterilir.
                </p>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={16}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] resize-y"
                />
              </div>
            </>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
