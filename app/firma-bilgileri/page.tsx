import type { Metadata } from 'next';
import { FirmaBilgileriClient } from './FirmaBilgileriClient';

export const metadata: Metadata = {
  title: 'Firma Bilgileri | El\'s Dream Factory',
  description: 'El\'s Dream Factory firma ve iletişim bilgileri.',
};

export default function FirmaBilgileriPage() {
  return <FirmaBilgileriClient />;
}
