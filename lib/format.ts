// <script> içine gömülecek JSON-LD için güvenli serileştirme.
// JSON.stringify '</script>' dizisini kaçırmaz; '<' karakterini <'ye çevirerek
// DB kaynaklı içerikle (ürün adı, SSS metni) script'ten kaçış (XSS) engellenir.
export function jsonLdSafe(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

// Ürün açıklamasındaki basit işaretlemeyi (admin araç çubuğundan) güvenli HTML'e çevirir.
// Önce TÜM HTML kaçırılır (XSS önlemi), sonra yalnız izinli desenler dönüştürülür:
//   **kalın** → <strong>, *italik* → <em>, satır başında "- " → madde listesi.
// Dönüş string'i güvenle dangerouslySetInnerHTML ile basılabilir.
export function renderDescriptionHtml(input: string | null | undefined): string {
  const escaped = (input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const bulletMatch = /^- (.*)$/.exec(line);
    if (bulletMatch) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inlineMarks(bulletMatch[1])}</li>`);
    } else {
      if (inList) { html.push('</ul>'); inList = false; }
      if (line.trim() === '') {
        html.push('<br/>');
      } else {
        html.push(`<p>${inlineMarks(line)}</p>`);
      }
    }
  }
  if (inList) html.push('</ul>');
  return html.join('');
}

// Satır içi kalın/italik işaretlemesi. Kaçırılmış metin üzerinde çalışır.
function inlineMarks(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
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
