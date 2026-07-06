import { Metadata } from 'next';
import { ceramicProducts } from '@/data/ceramicProducts';
import { buildProductMetadata, ProductDetailView } from '../../_lib/productDetail';

export const revalidate = 60; // 60 saniyede bir yeniden render

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildProductMetadata(id, 'tr');
}

// Admin panelinden eklenen UUID'li ürünler dinamik render edilsin
export const dynamicParams = true;

// Statik sayfa oluşturma — build zamanında yerel ürün sayfaları oluşturulur
export async function generateStaticParams() {
  return ceramicProducts.map((product) => ({ id: String(product.id) }));
}

export default async function CeramicDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailView id={id} locale="tr" />;
}
