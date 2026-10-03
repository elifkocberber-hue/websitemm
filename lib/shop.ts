// Satış modu anahtarı.
//
// false → site PORTFOLYO olarak çalışır: sepet, fiyat, stok, "Sepete Ekle",
// ödeme, sipariş ve üyelik arayüzü gizlenir; aşağıdaki sayfalar ana sayfaya
// yönlendirilir ve satış API'leri middleware'de kapatılır. Admin paneli,
// ürünler, fiyatlar ve tüm satış kodu olduğu gibi durur.
//
// Satışa geri dönmek için yalnızca bunu true yapıp yeniden deploy edin.
export const SHOP_ENABLED: boolean = false;

// Satış kapalıyken erişilemeyen sayfalar (alt yollarıyla birlikte).
export const SHOP_ONLY_PAGES = [
  '/cart',
  '/payment',
  '/payment-failed',
  '/thank-you',
  '/orders',
  '/returns',
  '/mesafeli-satis-sozlesmesi',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Satış kapalıyken kapatılan API'ler (alt yollarıyla birlikte). /api/admin açık kalır.
export const SHOP_ONLY_APIS = ['/api/payment', '/api/user', '/api/shipping'];

export const matchesPath = (pathname: string, bases: string[]) =>
  bases.some((base) => pathname === base || pathname.startsWith(`${base}/`));
