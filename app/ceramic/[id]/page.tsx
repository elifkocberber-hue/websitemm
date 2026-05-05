import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProducts, fetchProductById, getCeramicProductById, ceramicProducts } from '@/data/ceramicProducts';
import CeramicDetailClient from './CeramicDetailClient';

export const revalidate = 60; // 60 saniyede bir yeniden render

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dinamik meta etiketleri — Google ürün bilgilerini görsün
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id) ?? getCeramicProductById(id);

  if (!product) {
    return { title: 'Ürün Bulunamadı' };
  }

  const imageUrl = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `https://elsdreamfactory.com${product.images[0]}`;

  return {
    title: `${product.name} | El Yapımı Seramik`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, el yapımı seramik, ${product.clayType}, seramik hediye`,
    openGraph: {
      title: `${product.name} | El's Dream Factory`,
      description: product.description,
      type: 'website',
      url: `https://elsdreamfactory.com/ceramic/${product.id}`,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | El's Dream Factory`,
      description: product.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://elsdreamfactory.com/ceramic/${product.id}`,
    },
  };
}

// Admin panelinden eklenen UUID'li ürünler dinamik render edilsin
export const dynamicParams = true;

// Statik sayfa oluşturma — build zamanında yerel ürün sayfaları oluşturulur
export async function generateStaticParams() {
  return ceramicProducts.map((product) => ({
    id: String(product.id),
  }));
}

export default async function CeramicDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Önce ID'ye göre direkt çek (cache yok), bulamazsa yerel veriye bak
  const product = await fetchProductById(id) ?? getCeramicProductById(id);

  // İlgili ürünler için tüm listeyi çek
  const allProducts = await fetchProducts();

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  return (
    <>
      {/* JSON-LD Product Schema — Google zengin sonuçları */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images.map((img) =>
              img.startsWith('http') ? img : `https://elsdreamfactory.com${img}`
            ),
            brand: {
              '@type': 'Brand',
              name: "El's Dream Factory",
            },
            offers: {
              '@type': 'Offer',
              url: `https://elsdreamfactory.com/ceramic/${product.id}`,
              priceCurrency: 'TRY',
              price: product.price.toFixed(2),
              availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: "El's Dream Factory",
              },
            },
            category: product.category,
            material: product.clayType,
            ...(product.weight && {
              weight: { '@type': 'QuantitativeValue', value: product.weight, unitCode: 'GRM' },
            }),
          }),
        }}
      />
      {/* JSON-LD BreadcrumbList — SERP'te breadcrumb göster */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Ana Sayfa',
                item: 'https://elsdreamfactory.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Koleksiyon',
                item: 'https://elsdreamfactory.com/ceramics',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: `https://elsdreamfactory.com/ceramic/${product.id}`,
              },
            ],
          }),
        }}
      />
      <CeramicDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
