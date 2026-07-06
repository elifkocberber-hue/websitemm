import { Metadata } from 'next';
import { ceramicProducts } from '@/data/ceramicProducts';
import { buildProductMetadata, ProductDetailView } from '../../../_lib/productDetail';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildProductMetadata(id, 'en');
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return ceramicProducts.map((product) => ({ id: String(product.id) }));
}

export default async function CeramicDetailPageEn({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailView id={id} locale="en" />;
}
