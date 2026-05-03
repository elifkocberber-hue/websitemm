'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

interface Faq {
  id: number;
  question: string;
  answer: string;
  status: 'pending' | 'published';
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  published: 'Yayında',
};

export default function AdminFaqPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');
  const [message, setMessage] = useState<{ id: number; type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sergenim/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchFaqs();
  }, [isAuthenticated]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faq');
      if (res.ok) setFaqs(await res.json());
    } catch {
      // sessiz hata
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (faq: Faq) => {
    setEditId(faq.id);
    setEditAnswer(faq.answer);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditAnswer('');
  };

  const handleSave = async (faq: Faq, publish: boolean) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/faq/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: editAnswer,
          status: publish ? 'published' : 'pending',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs((prev) => prev.map((f) => (f.id === faq.id ? data : f)));
        setEditId(null);
        setMessage({ id: faq.id, type: 'success', text: publish ? 'Yayınlandı!' : 'Kaydedildi.' });
      } else {
        setMessage({ id: faq.id, type: 'error', text: data.error || 'Hata oluştu' });
      }
    } catch {
      setMessage({ id: faq.id, type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async (faq: Faq) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faq/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: faq.answer, status: 'pending' }),
      });
      if (res.ok) {
        const data = await res.json();
        setFaqs((prev) => prev.map((f) => (f.id === faq.id ? data : f)));
      }
    } catch {
      // sessiz hata
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu soruyu silmek istiyor musunuz?')) return;
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
      if (res.ok) setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch {
      // sessiz hata
    }
  };

  const filtered = faqs.filter((f) => filter === 'all' || f.status === filter);
  const pendingCount = faqs.filter((f) => f.status === 'pending').length;

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              SSS Yönetimi
              {pendingCount > 0 && (
                <span className="ml-3 inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6">
                  {pendingCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Gelen soruları cevaplayın ve yayınlayın</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900 underline">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtreler */}
        <div className="flex gap-3 mb-8">
          {(['all', 'pending', 'published'] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === s
                  ? 'bg-[#DD6B56] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Tümü' : STATUS_LABELS[s]}
              <span className="ml-1.5 text-xs opacity-70">
                ({s === 'all' ? faqs.length : faqs.filter((f) => f.status === s).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <p className="text-gray-400 text-sm">
              {filter === 'pending' ? 'Bekleyen soru yok.' : 'Henüz soru yok.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Soru başlığı */}
                <div className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faq.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {STATUS_LABELS[faq.status]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(faq.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{faq.question}</p>
                  </div>
                  {/* Aksiyon butonları */}
                  <div className="flex items-center gap-2 shrink-0">
                    {faq.status === 'published' && (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(faq)}
                        disabled={saving}
                        className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2.5 py-1 transition"
                      >
                        Geri al
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => (editId === faq.id ? cancelEdit() : startEdit(faq))}
                      className="text-xs text-[#DD6B56] hover:text-[#C45540] border border-[#DD6B56]/30 rounded px-2.5 py-1 transition"
                    >
                      {editId === faq.id ? 'İptal' : 'Cevapla'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded px-2.5 py-1 transition"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Mevcut cevap (edit modunda değilse) */}
                {faq.answer && editId !== faq.id && (
                  <div className="px-6 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#DD6B56]/40">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cevap</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}

                {/* Edit formu */}
                {editId === faq.id && (
                  <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Cevabınız</label>
                    <textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      rows={4}
                      placeholder="Soruya cevabınızı yazın..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD6B56] resize-none"
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => handleSave(faq, true)}
                        disabled={saving || !editAnswer.trim()}
                        className="bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                      >
                        Kaydet & Yayınla
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(faq, false)}
                        disabled={saving || !editAnswer.trim()}
                        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition"
                      >
                        Sadece Kaydet
                      </button>
                    </div>
                    {message?.id === faq.id && (
                      <p className={`mt-2 text-xs font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
