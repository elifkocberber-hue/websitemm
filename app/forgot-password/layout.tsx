import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Şifremi Unuttum',
  description: 'El\'s Dream Factory hesap şifre sıfırlama.',
  robots: { index: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
