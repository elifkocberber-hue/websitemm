// <script> içine gömülecek JSON-LD için güvenli serileştirme.
// JSON.stringify '</script>' dizisini kaçırmaz; '<' karakterini <'ye çevirerek
// DB kaynaklı içerikle (ürün adı, SSS metni) script'ten kaçış (XSS) engellenir.
export function jsonLdSafe(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

// İsimleri düzgün büyük harfle biçimlendirir (Türkçe karakter uyumlu).
// "elif koçberber" -> "Elif Koçberber", "ELIF" -> "Elif"
export function titleCaseName(value: string | null | undefined): string {
  return (value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR'))
    .join(' ');
}
