import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Şifre Sıfırla',
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
