import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sepetim',
  description: 'Alışveriş sepetinizi görüntüleyin ve ödemeye geçin. El yapımı seramik ürünler güvenle kapınıza gelsin.',
  robots: {
    index: false,
  },
  openGraph: {
    title: 'Sepetim | El\'s Dream Factory',
    description: 'El yapımı seramik ürünlerinizi sipariş edin.',
    type: 'website',
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
