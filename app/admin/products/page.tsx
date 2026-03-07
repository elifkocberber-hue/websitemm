'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  clay_type: string;
  category: string;
  handmade: boolean;
  glaze: string;
  dimensions: Record<string, number>;
  weight: number | null;
  dishwasher_safe: boolean;
  microwave: boolean;
  images: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  clayType: 'stoneware' as string,
  category: '',
  handmade: true,
  glaze: '',
  dimensions: {} as Record<string, number>,
  weight: null as number | null,
  dishwasherSafe: false,
  microwave: false,
  images: [] as string[],
  featured: false,
};

const CLAY_TYPES = [
  { value: 'stoneware', label: 'Stoneware' },
  { value: 'porcelain', label: 'Porselen' },
  { value: 'earthenware', label: 'Toprak' },
  { value: 'bone-china', label: 'Bone China' },
  { value: 'terracotta', label: 'Terracotta' },
];

const CATEGORIES = [
  'Çanak & Kase', 'Fincan & Tabak', 'Vazolar', 'Tabaklar', 'Kaplar',
  'Dekorasyon', 'Mutfak', 'Pişirme Kapları', 'Figürler', 'Saksılar',
];

export default function ProductsAdminPage() {
  const { isAuthenticated, adminEmail, logout, loading: authLoading } = useAdmin();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sergenim/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      clayType: product.clay_type,
      category: product.category,
      handmade: product.handmade,
      glaze: product.glaze || '',
      dimensions: product.dimensions || {},
      weight: product.weight,
      dishwasherSafe: product.dishwasher_safe,
      microwave: product.microwave,
      images: product.images || [],
      featured: product.featured,
    });
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setFormData({ ...EMPTY_PRODUCT, images: [] });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setFormData(EMPTY_PRODUCT);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newImages = [...formData.images];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        } else {
          const err = await res.json();
          showMessage('error', err.error || 'Resim yüklenemedi');
        }
      } catch {
        showMessage('error', 'Resim yüklenirken hata oluştu');
      }
    }

    setFormData(prev => ({ ...prev, images: newImages }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showMessage('error', 'Ürün adı zorunludur');
      return;
    }
    if (formData.price <= 0) {
      showMessage('error', 'Fiyat 0\'dan büyük olmalıdır');
      return;
    }

    setSaving(true);
    try {
      const url = isCreating 
        ? '/api/admin/products' 
        : `/api/admin/products/${editingProduct?.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showMessage('success', isCreating ? 'Ürün eklendi!' : 'Ürün güncellendi!');
        handleCancel();
        fetchProducts();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'İşlem başarısız');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Ürün silindi');
        setDeleteConfirm(null);
        fetchProducts();
      } else {
        showMessage('error', 'Ürün silinemedi');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
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

  const isEditing = editingProduct !== null || isCreating;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Ürün Yönetimi</h1>
            <p className="text-gray-600 mt-1">{adminEmail}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition">← Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Çıkış Yap</button>
          </div>
        </div>
      </header>

      {/* Mesaj */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isEditing ? (
          <>
            {/* Ürün Listesi */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">{products.length} ürün</p>
              <button
                onClick={handleCreate}
                className="bg-[#5C0A1A] hover:bg-[#7a1025] text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Yeni Ürün Ekle
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20"><p className="text-gray-600">Yükleniyor...</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg mb-4">Henüz ürün eklenmemiş</p>
                <button onClick={handleCreate} className="bg-[#DD6B56] hover:bg-[#C45540] text-white font-bold py-3 px-6 rounded-lg transition">
                  İlk Ürününü Ekle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden group">
                    {/* Resim */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                      )}
                      {!product.active && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs px-3 py-1 rounded">PASİF</span>
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">⭐ ÖNE ÇIKAN</span>
                      )}
                      <span className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded text-gray-700">
                        {product.images?.length || 0} resim
                      </span>
                    </div>
                    {/* Bilgi */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#DD6B56]">{product.price.toFixed(2)} ₺</span>
                        <span className="text-sm text-gray-500">Stok: {product.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-[#5C0A1A] hover:bg-[#7a1025] text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          ✏️ Düzenle
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition">Evet</button>
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 rounded-lg text-sm transition">İptal</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(product.id)} className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition">
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Ürün Düzenleme / Oluşturma Formu */
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? '➕ Yeni Ürün Ekle' : `✏️ ${editingProduct?.name}`}
              </h2>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 transition">
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-8">
              {/* Resimler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📷 Ürün Resimleri</h3>
                
                {/* Mevcut resimler */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                        <Image src={img} alt={`Ürün resmi ${i + 1}`} fill className="object-cover" sizes="200px" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {i > 0 && (
                            <button onClick={() => handleMoveImage(i, 'up')} className="bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-gray-100" title="Sola taşı">←</button>
                          )}
                          <button onClick={() => handleRemoveImage(i)} className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-700" title="Sil">✕</button>
                          {i < formData.images.length - 1 && (
                            <button onClick={() => handleMoveImage(i, 'down')} className="bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-gray-100" title="Sağa taşı">→</button>
                          )}
                        </div>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#5C0A1A] text-white text-[10px] px-2 py-0.5 rounded">Ana Resim</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Yükleme butonu */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#DD6B56] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploading ? (
                      <div className="text-[#DD6B56] font-medium">Yükleniyor...</div>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📤</div>
                        <p className="text-gray-600 font-medium">Resim yüklemek için tıklayın</p>
                        <p className="text-gray-400 text-sm mt-1">JPEG, PNG, WebP — Maks. 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Temel Bilgiler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Temel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="Örn: El Yapımı Seramik Vazo"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none resize-none"
                      placeholder="Ürün açıklaması yazın..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      title="Kategori seçin"
                    >
                      <option value="">Seçiniz</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Malzeme</label>
                    <select
                      value={formData.clayType}
                      onChange={(e) => setFormData(prev => ({ ...prev, clayType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      title="Malzeme seçin"
                    >
                      {CLAY_TYPES.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sır (Glaze)</label>
                    <input
                      type="text"
                      value={formData.glaze}
                      onChange={(e) => setFormData(prev => ({ ...prev, glaze: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="Örn: Mat beyaz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ağırlık (gr)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || null }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="Gram cinsinden"
                    />
                  </div>
                </div>

                {/* Boyutlar */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boyutlar (cm)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['diameter', 'height', 'width', 'depth'].map(dim => (
                      <div key={dim}>
                        <label className="text-xs text-gray-500 capitalize">{dim === 'diameter' ? 'Çap' : dim === 'height' ? 'Yükseklik' : dim === 'width' ? 'Genişlik' : 'Derinlik'}</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.dimensions[dim] || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFormData(prev => ({
                              ...prev,
                              dimensions: val ? { ...prev.dimensions, [dim]: val } : (() => { const d = { ...prev.dimensions }; delete d[dim]; return d; })(),
                            }));
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                          title={dim === 'diameter' ? 'Çap' : dim === 'height' ? 'Yükseklik' : dim === 'width' ? 'Genişlik' : 'Derinlik'}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkbox'lar */}
                <div className="mt-6 flex flex-wrap gap-6">
                  {[
                    { key: 'handmade', label: '🤲 El Yapımı' },
                    { key: 'dishwasherSafe', label: '🫧 Bulaşık Makinesine Uygun' },
                    { key: 'microwave', label: '📡 Mikrodalgaya Uygun' },
                    { key: 'featured', label: '⭐ Öne Çıkan Ürün' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#DD6B56] focus:ring-[#DD6B56]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kaydet Butonları */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#5C0A1A] hover:bg-[#7a1025] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
                >
                  {saving ? 'Kaydediliyor...' : isCreating ? '✅ Ürünü Ekle' : '💾 Değişiklikleri Kaydet'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
