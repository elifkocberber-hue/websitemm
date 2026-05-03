'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export default function CategoriesAdminPage() {
  const { isAuthenticated, adminEmail, logout, loading: authLoading } = useAdmin();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sergenim/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName('');
        showMessage('success', 'Kategori eklendi');
        fetchCategories();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Eklenemedi');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        showMessage('success', 'Kategori güncellendi');
        fetchCategories();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Güncellenemedi');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Kategori silindi');
        fetchCategories();
      } else {
        showMessage('error', 'Silinemedi');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
    }
  };

  // Drag-to-reorder
  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const newList = [...categories];
    const dragged = newList.splice(dragIndex.current, 1)[0];
    newList.splice(index, 0, dragged);
    dragIndex.current = index;
    setCategories(newList);
  };

  const handleDragEnd = async () => {
    dragIndex.current = null;
    try {
      await fetch('/api/admin/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: categories.map(c => c.id) }),
      });
    } catch {
      showMessage('error', 'Sıralama kaydedilemedi');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
            <p className="text-gray-600 mt-1">{adminEmail}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition">
              ← Ürünler
            </Link>
            <button type="button" onClick={handleLogout} className="bg-[#5C0A1A] hover:bg-[#7a1025] text-white font-bold py-2 px-4 rounded-lg transition">
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.text}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Yeni kategori ekle */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Kategori adı..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="bg-[#5C0A1A] hover:bg-[#7a1025] disabled:opacity-50 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              Ekle
            </button>
          </div>
        </div>

        {/* Mevcut kategoriler */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Mevcut Kategoriler ({categories.length})</h2>
            <span className="text-sm text-gray-400">Sıralamak için sürükleyin</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">Yükleniyor...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Henüz kategori eklenmemiş.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((cat, index) => (
                <li
                  key={cat.id}
                  draggable={editingId !== cat.id}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 px-6 py-4 cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors"
                >
                  {/* Sürükleme tutacağı */}
                  <span className="text-gray-300 select-none text-lg" title="Sürükle">⠿</span>

                  {editingId === cat.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        placeholder="Kategori adı"
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(cat.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 border border-[#DD6B56] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition"
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900 font-medium">{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="text-[#5C0A1A] hover:text-[#7a1025] text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-gray-100 transition"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition"
                      >
                        Sil
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
