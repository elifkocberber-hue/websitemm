'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import Image from 'next/image';

interface ProductVariations {
  typeName: string;
  options: Array<{ name: string; stock: number }>;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  clay_type: string;
  category: string;
  categories: string[];
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
  variations: ProductVariations | null;
}

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  clayType: '',
  categories: [] as string[],
  handmade: true,
  dimensions: {} as Record<string, number>,
  dishwasherSafe: false,
  microwave: false,
  images: [] as string[],
  featured: false,
  variations: null as ProductVariations | null,
};

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
  const [seeding, setSeeding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragImageIndex, setDragImageIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sergenim/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
    }
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.map((c: { name: string }) => c.name));
      }
    } catch {
      // silently fail
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
      categories: (product.categories?.length > 0) ? product.categories : (product.category ? [product.category] : []),
      handmade: product.handmade,
      dimensions: product.dimensions || {},
      dishwasherSafe: product.dishwasher_safe,
      microwave: product.microwave,
      images: product.images || [],
      featured: product.featured,
      variations: product.variations || null,
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

  const handleDropFiles = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    const newImages = [...formData.images];

    for (const file of Array.from(files)) {
      const name = file.name.toLowerCase();
      const isVideo = /\.(mp4|webm|mov)$/.test(name);
      const isImage = /\.(jpg|jpeg|png|webp)$/.test(name);

      if (!isVideo && !isImage) {
        showMessage('error', `"${file.name}" desteklenmiyor. Kabul edilenler: JPG, PNG, WebP, MP4, WebM, MOV`);
        continue;
      }

      // Dosya uzantısından content-type belirle (tarayıcının verdiğine güvenme)
      const contentType = isVideo
        ? (/\.webm$/.test(name) ? 'video/webm' : 'video/mp4')
        : (file.type || 'image/jpeg');

      try {
        const signRes = await fetch('/api/admin/upload/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, contentType }),
        });
        if (!signRes.ok) {
          const err = await signRes.json().catch(() => ({}));
          showMessage('error', err.error || 'URL alınamadı');
          continue;
        }
        const { signedUrl, publicUrl } = await signRes.json();

        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: file,
        });
        if (!uploadRes.ok) {
          showMessage('error', `"${file.name}" yüklenemedi (${uploadRes.status})`);
          continue;
        }
        newImages.push(publicUrl);
      } catch (err) {
        showMessage('error', 'Yükleme hatası: ' + (err instanceof Error ? err.message : String(err)));
      }
    }

    setFormData(prev => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Image drag-to-reorder
  const handleImageDragStart = (index: number) => {
    setDragImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragImageIndex === null || dragImageIndex === index) return;
    const newImages = [...formData.images];
    const dragged = newImages.splice(dragImageIndex, 1)[0];
    newImages.splice(index, 0, dragged);
    setFormData(prev => ({ ...prev, images: newImages }));
    setDragImageIndex(index);
  };

  const handleImageDragEnd = () => {
    setDragImageIndex(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showMessage('error', 'Ürün adı zorunludur');
      return;
    }
    if (formData.price <= 0) {
      showMessage('error', "Fiyat 0'dan büyük olmalıdır");
      return;
    }

    // Varyasyon varsa toplam stoğu otomatik hesapla
    const dataToSave = { ...formData };
    if (dataToSave.variations?.options?.length) {
      dataToSave.stock = dataToSave.variations.options.reduce((sum, opt) => sum + (opt.stock || 0), 0);
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
        body: JSON.stringify(dataToSave),
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

  const handleSeed = async () => {
    if (!confirm("Yerel koleksiyondaki 23 ürün Supabase'e aktarılacak. Devam edilsin mi?")) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message);
        fetchProducts();
      } else {
        showMessage('error', data.error || 'Aktarım başarısız');
      }
    } catch {
      showMessage('error', 'Bir hata oluştu');
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Variation handlers
  const addVariations = () => {
    setFormData(prev => ({
      ...prev,
      variations: { typeName: '', options: [{ name: '', stock: 0 }] },
    }));
  };

  const removeVariations = () => {
    setFormData(prev => ({ ...prev, variations: null }));
  };

  const addVariationOption = () => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations
        ? { ...prev.variations, options: [...prev.variations.options, { name: '', stock: 0 }] }
        : null,
    }));
  };

  const removeVariationOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations
        ? { ...prev.variations, options: prev.variations.options.filter((_, i) => i !== index) }
        : null,
    }));
  };

  const updateVariationOption = (index: number, field: 'name' | 'stock', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations
        ? {
            ...prev.variations,
            options: prev.variations.options.map((opt, i) =>
              i === index ? { ...opt, [field]: value } : opt
            ),
          }
        : null,
    }));
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
            <Link href="/admin/categories" className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-2 px-4 rounded-lg transition">
              🏷️ Kategoriler
            </Link>
            <Link href="/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition">
              ← Dashboard
            </Link>
            <button type="button" onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Çıkış Yap
            </button>
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
              <div className="flex gap-3">
                {products.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeed}
                    disabled={seeding}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
                  >
                    {seeding ? 'Aktarılıyor...' : '📥 Koleksiyonu İçe Aktar'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCreate}
                  className="bg-[#5C0A1A] hover:bg-[#7a1025] text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
                >
                  <span className="text-xl">+</span> Yeni Ürün Ekle
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20"><p className="text-gray-600">Yükleniyor...</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg mb-4">Henüz ürün eklenmemiş</p>
                <button type="button" onClick={handleCreate} className="bg-[#DD6B56] hover:bg-[#C45540] text-white font-bold py-3 px-6 rounded-lg transition">
                  İlk Ürününü Ekle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden group">
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
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">ÖNE ÇIKAN</span>
                      )}
                      <span className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded text-gray-700">
                        {product.images?.length || 0} resim
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#DD6B56]">{product.price.toFixed(2)} ₺</span>
                        <span className="text-sm text-gray-500">Stok: {product.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-[#5C0A1A] hover:bg-[#7a1025] text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          ✏️ Düzenle
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex gap-1">
                            <button type="button" onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition">Evet</button>
                            <button type="button" onClick={() => setDeleteConfirm(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 rounded-lg text-sm transition">İptal</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setDeleteConfirm(product.id)} className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition">
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
              <button type="button" onClick={handleCancel} className="text-gray-500 hover:text-gray-800 transition">
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-8">
              {/* Resimler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">📷 Ürün Resimleri</h3>
                <p className="text-sm text-gray-500 mb-4">Görselleri sürükleyerek sıralarını değiştirebilirsiniz. İlk görsel ana resim olarak kullanılır.</p>

                {/* Resim grid - sürükle & bırak ile sıralama */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, i) => (
                      <div
                        key={img + i}
                        draggable
                        onDragStart={() => handleImageDragStart(i)}
                        onDragOver={(e) => handleImageDragOver(e, i)}
                        onDragEnd={handleImageDragEnd}
                        className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing select-none ${
                          dragImageIndex === i ? 'opacity-50 ring-2 ring-[#DD6B56]' : ''
                        }`}
                      >
                        {/\.(mp4|webm|mov)$/i.test(img) ? (
                          <video src={img} className="w-full h-full object-cover pointer-events-none" muted playsInline />
                        ) : (
                          <Image src={img} alt={`Ürün resmi ${i + 1}`} fill className="object-cover pointer-events-none" sizes="200px" />
                        )}
                        {/\.(mp4|webm|mov)$/i.test(img) && (
                          <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">▶ Video</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-700"
                            title="Sil"
                          >
                            ✕
                          </button>
                        </div>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#5C0A1A] text-white text-[10px] px-2 py-0.5 rounded">Ana Resim</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Yükleme alanı */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-[#DD6B56] bg-[#DD6B56]/5' : 'border-gray-300 hover:border-[#DD6B56]'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length) handleDropFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
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
                        <div className="text-4xl mb-2">{isDragging ? '📂' : '📤'}</div>
                        <p className="text-gray-600 font-medium">
                          {isDragging ? 'Bırakın, yüklensin!' : 'Sürükle bırak veya tıklayarak seçin'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Resim: JPEG, PNG, WebP (maks. 5MB) · Video: MP4, WebM, MOV (maks. 100MB)</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Malzeme</label>
                    <input
                      type="text"
                      value={formData.clayType}
                      onChange={(e) => setFormData(prev => ({ ...prev, clayType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                      placeholder="Örn: Stoneware, Porselen, Terracotta..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriler</label>
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        Henüz kategori eklenmemiş.{' '}
                        <a href="/admin/categories" className="text-[#DD6B56] underline">Kategori ekle →</a>
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <label key={cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-colors ${
                            formData.categories.includes(cat)
                              ? 'border-[#DD6B56] bg-[#DD6B56]/10 text-[#DD6B56]'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={formData.categories.includes(cat)}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                categories: e.target.checked
                                  ? [...prev.categories, cat]
                                  : prev.categories.filter(c => c !== cat),
                              }))}
                            />
                            <span className="text-sm font-medium">{cat}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Boyutlar */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boyutlar (cm)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['diameter', 'height', 'width', 'depth'].map(dim => (
                      <div key={dim}>
                        <label className="text-xs text-gray-500">
                          {dim === 'diameter' ? 'Çap' : dim === 'height' ? 'Yükseklik' : dim === 'width' ? 'Genişlik' : 'Derinlik'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.dimensions[dim] || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFormData(prev => ({
                              ...prev,
                              dimensions: val
                                ? { ...prev.dimensions, [dim]: val }
                                : (() => { const d = { ...prev.dimensions }; delete d[dim]; return d; })(),
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
                    { key: 'handmade', label: 'El Yapımı' },
                    { key: 'dishwasherSafe', label: 'Bulaşık Makinesine Uygun' },
                    { key: 'microwave', label: 'Mikrodalgaya Uygun' },
                    { key: 'featured', label: 'Öne Çıkan Ürün' },
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

              {/* Varyasyonlar */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">🎨 Varyasyonlar</h3>
                  {!formData.variations ? (
                    <button
                      type="button"
                      onClick={addVariations}
                      className="bg-[#DD6B56] hover:bg-[#C45540] text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                    >
                      + Varyasyon Ekle
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={removeVariations}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Varyasyonları Kaldır
                    </button>
                  )}
                </div>

                {formData.variations ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Varyasyon Türü Adı</label>
                      <input
                        type="text"
                        value={formData.variations.typeName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          variations: prev.variations ? { ...prev.variations, typeName: e.target.value } : null,
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                        placeholder="Örn: Renk, Boyut, Model..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>
                      <div className="space-y-2">
                        {formData.variations.options.map((opt, i) => (
                          <div key={i} className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={opt.name}
                              onChange={(e) => updateVariationOption(i, 'name', e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                              placeholder="Seçenek adı (Örn: Mavi, Küçük...)"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500 whitespace-nowrap">Stok:</span>
                              <input
                                type="number"
                                min="0"
                                value={opt.stock}
                                onChange={(e) => updateVariationOption(i, 'stock', parseInt(e.target.value) || 0)}
                                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#DD6B56] focus:border-transparent outline-none"
                                title="Stok adedi"
                              />
                            </div>
                            {formData.variations!.options.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariationOption(i)}
                                className="text-red-500 hover:text-red-700 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 transition flex-shrink-0"
                                title="Seçeneği sil"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addVariationOption}
                        className="mt-3 text-[#DD6B56] hover:text-[#C45540] text-sm font-medium transition"
                      >
                        + Seçenek Ekle
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Renk, boyut gibi farklı seçenekler için varyasyon ekleyebilirsiniz.</p>
                )}
              </div>

              {/* Kaydet Butonları */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#5C0A1A] hover:bg-[#7a1025] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
                >
                  {saving ? 'Kaydediliyor...' : isCreating ? 'Ürünü Ekle' : 'Değişiklikleri Kaydet'}
                </button>
                <button
                  type="button"
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
