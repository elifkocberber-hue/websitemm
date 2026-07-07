// Checkout ülke seçici ve admin kargo paneli için ortak ülke listesi.
// code: ISO-2 · tr/en: görünen adlar. iyzico'ya İngilizce ad gönderilir.
// Türkiye listenin başında (varsayılan seçim).

export interface Country {
  code: string;
  tr: string;
  en: string;
}

export const COUNTRIES: Country[] = [
  { code: 'TR', tr: 'Türkiye', en: 'Turkey' },
  // Avrupa
  { code: 'AL', tr: 'Arnavutluk', en: 'Albania' },
  { code: 'AT', tr: 'Avusturya', en: 'Austria' },
  { code: 'BA', tr: 'Bosna-Hersek', en: 'Bosnia and Herzegovina' },
  { code: 'BE', tr: 'Belçika', en: 'Belgium' },
  { code: 'BG', tr: 'Bulgaristan', en: 'Bulgaria' },
  { code: 'CH', tr: 'İsviçre', en: 'Switzerland' },
  { code: 'CY', tr: 'Kıbrıs', en: 'Cyprus' },
  { code: 'CZ', tr: 'Çekya', en: 'Czechia' },
  { code: 'DE', tr: 'Almanya', en: 'Germany' },
  { code: 'DK', tr: 'Danimarka', en: 'Denmark' },
  { code: 'EE', tr: 'Estonya', en: 'Estonia' },
  { code: 'ES', tr: 'İspanya', en: 'Spain' },
  { code: 'FI', tr: 'Finlandiya', en: 'Finland' },
  { code: 'FR', tr: 'Fransa', en: 'France' },
  { code: 'GB', tr: 'Birleşik Krallık', en: 'United Kingdom' },
  { code: 'GR', tr: 'Yunanistan', en: 'Greece' },
  { code: 'HR', tr: 'Hırvatistan', en: 'Croatia' },
  { code: 'HU', tr: 'Macaristan', en: 'Hungary' },
  { code: 'IE', tr: 'İrlanda', en: 'Ireland' },
  { code: 'IS', tr: 'İzlanda', en: 'Iceland' },
  { code: 'IT', tr: 'İtalya', en: 'Italy' },
  { code: 'LT', tr: 'Litvanya', en: 'Lithuania' },
  { code: 'LU', tr: 'Lüksemburg', en: 'Luxembourg' },
  { code: 'LV', tr: 'Letonya', en: 'Latvia' },
  { code: 'MD', tr: 'Moldova', en: 'Moldova' },
  { code: 'ME', tr: 'Karadağ', en: 'Montenegro' },
  { code: 'MK', tr: 'Kuzey Makedonya', en: 'North Macedonia' },
  { code: 'MT', tr: 'Malta', en: 'Malta' },
  { code: 'NL', tr: 'Hollanda', en: 'Netherlands' },
  { code: 'NO', tr: 'Norveç', en: 'Norway' },
  { code: 'PL', tr: 'Polonya', en: 'Poland' },
  { code: 'PT', tr: 'Portekiz', en: 'Portugal' },
  { code: 'RO', tr: 'Romanya', en: 'Romania' },
  { code: 'RS', tr: 'Sırbistan', en: 'Serbia' },
  { code: 'SE', tr: 'İsveç', en: 'Sweden' },
  { code: 'SI', tr: 'Slovenya', en: 'Slovenia' },
  { code: 'SK', tr: 'Slovakya', en: 'Slovakia' },
  { code: 'UA', tr: 'Ukrayna', en: 'Ukraine' },
  // Amerika
  { code: 'AR', tr: 'Arjantin', en: 'Argentina' },
  { code: 'BR', tr: 'Brezilya', en: 'Brazil' },
  { code: 'CA', tr: 'Kanada', en: 'Canada' },
  { code: 'CL', tr: 'Şili', en: 'Chile' },
  { code: 'CO', tr: 'Kolombiya', en: 'Colombia' },
  { code: 'MX', tr: 'Meksika', en: 'Mexico' },
  { code: 'US', tr: 'Amerika Birleşik Devletleri', en: 'United States' },
  // Orta Doğu & Kafkasya
  { code: 'AE', tr: 'Birleşik Arap Emirlikleri', en: 'United Arab Emirates' },
  { code: 'AZ', tr: 'Azerbaycan', en: 'Azerbaijan' },
  { code: 'BH', tr: 'Bahreyn', en: 'Bahrain' },
  { code: 'GE', tr: 'Gürcistan', en: 'Georgia' },
  { code: 'IL', tr: 'İsrail', en: 'Israel' },
  { code: 'JO', tr: 'Ürdün', en: 'Jordan' },
  { code: 'KW', tr: 'Kuveyt', en: 'Kuwait' },
  { code: 'LB', tr: 'Lübnan', en: 'Lebanon' },
  { code: 'OM', tr: 'Umman', en: 'Oman' },
  { code: 'QA', tr: 'Katar', en: 'Qatar' },
  { code: 'SA', tr: 'Suudi Arabistan', en: 'Saudi Arabia' },
  // Asya & Okyanusya
  { code: 'AU', tr: 'Avustralya', en: 'Australia' },
  { code: 'CN', tr: 'Çin', en: 'China' },
  { code: 'HK', tr: 'Hong Kong', en: 'Hong Kong' },
  { code: 'ID', tr: 'Endonezya', en: 'Indonesia' },
  { code: 'IN', tr: 'Hindistan', en: 'India' },
  { code: 'JP', tr: 'Japonya', en: 'Japan' },
  { code: 'KR', tr: 'Güney Kore', en: 'South Korea' },
  { code: 'KZ', tr: 'Kazakistan', en: 'Kazakhstan' },
  { code: 'MY', tr: 'Malezya', en: 'Malaysia' },
  { code: 'NZ', tr: 'Yeni Zelanda', en: 'New Zealand' },
  { code: 'PH', tr: 'Filipinler', en: 'Philippines' },
  { code: 'SG', tr: 'Singapur', en: 'Singapore' },
  { code: 'TH', tr: 'Tayland', en: 'Thailand' },
  { code: 'TW', tr: 'Tayvan', en: 'Taiwan' },
  { code: 'UZ', tr: 'Özbekistan', en: 'Uzbekistan' },
  { code: 'VN', tr: 'Vietnam', en: 'Vietnam' },
  // Afrika
  { code: 'DZ', tr: 'Cezayir', en: 'Algeria' },
  { code: 'EG', tr: 'Mısır', en: 'Egypt' },
  { code: 'MA', tr: 'Fas', en: 'Morocco' },
  { code: 'NG', tr: 'Nijerya', en: 'Nigeria' },
  { code: 'TN', tr: 'Tunus', en: 'Tunisia' },
  { code: 'ZA', tr: 'Güney Afrika', en: 'South Africa' },
];

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string): Country | undefined {
  return byCode.get((code || '').toUpperCase());
}

// Görünen ad (checkout dropdown / özet). Bilinmeyen kod → kodun kendisi.
export function getCountryName(code: string, lang: 'tr' | 'en'): string {
  const c = getCountry(code);
  return c ? c[lang] : code;
}

// iyzico'ya gönderilecek İngilizce ülke adı.
export function getCountryNameEn(code: string): string {
  return getCountry(code)?.en ?? 'Turkey';
}
