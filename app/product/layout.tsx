import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ürünler | El Yapımı Seramik & Hediyeler',
  description: 'El yapımı seramik ürünler, dekoratif objeler ve hediye seçenekleri. Sevimli kedi figürleri, seramik kupalar ve vazolar keşfedin.',
  keywords: 'seramik ürünler, el yapımı seramik, seramik hediye, kedi figür, seramik kupa',
  openGraph: {
    title: 'Ürünler | El\'s Dream Factory',
    description: 'El yapımı seramik ürün koleksiyonumuzu keşfedin.',
    type: 'website',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
