import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | El\'s Dream Factory',
  description: 'Review your items and proceed to checkout.',
  robots: {
    index: false,
  },
  openGraph: {
    title: 'Shopping Cart',
    description: 'Your shopping cart at El\'s Dream Factory',
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
