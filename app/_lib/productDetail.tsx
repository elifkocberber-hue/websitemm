import { notFound } from 'next/navigation';
import { fetchProducts, fetchProductById, getCeramicProductById } from '@/data/ceramicProducts';
import { jsonLdSafe } from '@/lib/format';
import CeramicDetailClient from '../ceramic/[id]/CeramicDetailClient';
import type { Metadata } from 'next';

const BASE = 'https://www.elsdreamfactory.com';

// TR ve /en ürün sayfaları arasında paylaşılan metadata üreticisi.
// locale='en' ise İngilizce açıklama (descriptionEn, boşsa description) ve
// /en URL'leri kullanılır; hreflang her iki yönde tanımlanır.
export async function buildProductMetadata(id: string, locale: 'tr' | 'en'): Promise<Metadata> {
  const product = (await fetchProductById(id)) ?? getCeramicProductById(id);
  if (!product) {
    return { title: locale === 'en' ? 'Product Not Found' : 'Ürün Bulunamadı' };
  }

  const imageUrl = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `${BASE}${product.images[0]}`;

  const enDesc = product.descriptionEn?.trim() || product.description;
  const description = locale === 'en' ? enDesc : product.description;
  // EN sayfada İngilizce ad (varsa); boşsa Türkçe ada düşülür
  const displayName =
    locale === 'en' && product.nameEn?.trim() ? product.nameEn : product.name;
  const path = locale === 'en' ? `/en/ceramic/${product.id}` : `/ceramic/${product.id}`;

  const title =
    locale === 'en'
      ? `${displayName} | Handmade Ceramics`
      : `${displayName} | El Yapımı Seramik`;
  const keywords =
    locale === 'en'
      ? `${displayName}, ${product.category}, handmade ceramics, ${product.clayType}, ceramic gift`
      : `${displayName}, ${product.category}, el yapımı seramik, ${product.clayType}, seramik hediye`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${displayName} | El's Dream Factory`,
      description,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'tr_TR',
      url: `${BASE}${path}`,
      images: [{ url: imageUrl, width: 800, height: 800, alt: displayName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} | El's Dream Factory`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${BASE}${path}`,
      languages: {
        tr: `${BASE}/ceramic/${product.id}`,
        en: `${BASE}/en/ceramic/${product.id}`,
        'x-default': `${BASE}/ceramic/${product.id}`,
      },
    },
  };
}

// TR ve /en ürün sayfalarının ortak gövdesi: JSON-LD (dile göre) + client görünüm.
export async function ProductDetailView({ id, locale }: { id: string; locale: 'tr' | 'en' }) {
  const product = (await fetchProductById(id)) ?? getCeramicProductById(id);
  const allProducts = await fetchProducts();

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const isEn = locale === 'en';
  const productUrl = isEn ? `${BASE}/en/ceramic/${product.id}` : `${BASE}/ceramic/${product.id}`;
  const jsonDescription = isEn ? (product.descriptionEn?.trim() || product.description) : product.description;
  const jsonName = isEn && product.nameEn?.trim() ? product.nameEn : product.name;

  const breadcrumb = isEn
    ? [
        { name: 'Home', item: `${BASE}/en` },
        { name: 'Collection', item: `${BASE}/en/ceramics` },
      ]
    : [
        { name: 'Ana Sayfa', item: BASE },
        { name: 'Koleksiyon', item: `${BASE}/ceramics` },
      ];

  // Dil, kök LanguageProvider tarafından /en yolunda otomatik 'en'e kilitlenir;
  // burada yalnız JSON-LD/metadata locale'e göre değişir.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdSafe({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: jsonName,
            description: jsonDescription,
            image: product.images.map((img) =>
              img.startsWith('http') ? img : `${BASE}${img}`
            ),
            brand: { '@type': 'Brand', name: "El's Dream Factory" },
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: 'TRY',
              price: product.price.toFixed(2),
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: "El's Dream Factory" },
            },
            category: product.category,
            material: product.clayType,
            ...(product.weight && {
              weight: { '@type': 'QuantitativeValue', value: product.weight, unitCode: 'GRM' },
            }),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdSafe({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              ...breadcrumb.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: b.name,
                item: b.item,
              })),
              {
                '@type': 'ListItem',
                position: breadcrumb.length + 1,
                name: jsonName,
                item: productUrl,
              },
            ],
          }),
        }}
      />
      <CeramicDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
