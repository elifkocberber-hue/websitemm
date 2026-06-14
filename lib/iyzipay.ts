import crypto from 'crypto';

// iyzico ödeme entegrasyonu — resmi imza algoritması (IYZWSv2 / HMAC-SHA256)
// doğrudan fetch ile uygulanır. Böylece 'iyzipay' npm paketine (ve onun ağır,
// dinamik require'lı 'postman-request' bağımlılığına) gerek kalmaz; Vercel
// serverless ortamında sorunsuz çalışır.

export interface IyzicoResult {
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  threeDSHtmlContent?: string;
  paymentId?: string;
  paidPrice?: string;
  price?: string;
  conversationId?: string;
  mdStatus?: string;
  [key: string]: unknown;
}

function getConfig() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL;
  if (!apiKey || !secretKey || !baseUrl) {
    throw new Error('iyzico ortam değişkenleri eksik (IYZICO_API_KEY / IYZICO_SECRET_KEY / IYZICO_BASE_URL).');
  }
  return { apiKey, secretKey, baseUrl };
}

function generateRandomString(): string {
  return Date.now().toString() + crypto.randomBytes(8).toString('hex');
}

// IYZWSv2 yetkilendirme başlığı:
//   signature = HMAC_SHA256(secretKey, randomString + uriPath + body).hex
//   header    = "IYZWSv2 " + base64("apiKey:..&randomKey:..&signature:..")
function buildAuthHeader(
  apiKey: string,
  secretKey: string,
  uriPath: string,
  bodyStr: string,
  randomString: string
): string {
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(randomString + uriPath + bodyStr)
    .digest('hex');

  const params = [
    `apiKey:${apiKey}`,
    `randomKey:${randomString}`,
    `signature:${signature}`,
  ];
  return 'IYZWSv2 ' + Buffer.from(params.join('&')).toString('base64');
}

async function post(uriPath: string, payload: Record<string, unknown>): Promise<IyzicoResult> {
  const { apiKey, secretKey, baseUrl } = getConfig();
  // İmza, gönderilen body string'i ÜZERİNDEN hesaplanır — ikisi birebir aynı olmalı.
  const bodyStr = JSON.stringify(payload);
  const randomString = generateRandomString();
  const authHeader = buildAuthHeader(apiKey, secretKey, uriPath, bodyStr, randomString);

  const response = await fetch(`${baseUrl}${uriPath}`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'x-iyzi-rnd': randomString,
      'x-iyzi-client-version': 'iyzipay-node-2.0.65',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: bodyStr,
  });

  return (await response.json()) as IyzicoResult;
}

// 3D Secure başlatma (kart bilgisiyle) — banka OTP HTML içeriğini döndürür
export function threedsInitialize(payload: Record<string, unknown>): Promise<IyzicoResult> {
  return post('/payment/3dsecure/initialize', payload);
}

// 3D Secure tamamlama (banka OTP sonrası callback'te çağrılır)
export function threedsComplete(payload: Record<string, unknown>): Promise<IyzicoResult> {
  return post('/payment/3dsecure/auth', payload);
}

// Tam para iadesi: önce iptal (aynı gün), olmazsa transaction bazlı iade (gün kapandıysa).
// Döner: { ok, method } başarılıysa, { ok:false, error } değilse.
export async function refundFullPayment(
  paymentId: string,
  ip: string
): Promise<{ ok: boolean; method?: 'cancel' | 'refund'; error?: string }> {
  if (!paymentId) return { ok: false, error: 'paymentId yok' };

  // 1) İptal dene (aynı gün, tam tutar tek seferde)
  const cancelRes = await post('/payment/cancel', {
    locale: 'tr',
    conversationId: generateRandomString(),
    paymentId,
    ip,
  });
  if (cancelRes.status === 'success') return { ok: true, method: 'cancel' };

  // 2) İptal olmadıysa (ör. gün kapandı) → ödeme detayından transaction'ları al ve tek tek iade et
  const detail = await post('/payment/detail', {
    locale: 'tr',
    conversationId: generateRandomString(),
    paymentId,
  });

  const itemTransactions =
    (detail.itemTransactions as Array<{ paymentTransactionId: string; paidPrice: number | string }>) || [];

  if (detail.status !== 'success' || itemTransactions.length === 0) {
    return { ok: false, error: detail.errorMessage || cancelRes.errorMessage || 'İade detayları alınamadı' };
  }

  let allOk = true;
  let lastErr = '';
  for (const tx of itemTransactions) {
    const refundRes = await post('/payment/refund', {
      locale: 'tr',
      conversationId: generateRandomString(),
      paymentTransactionId: tx.paymentTransactionId,
      price: String(tx.paidPrice),
      ip,
      currency: 'TRY',
    });
    if (refundRes.status !== 'success') {
      allOk = false;
      lastErr = refundRes.errorMessage || lastErr;
    }
  }

  return allOk ? { ok: true, method: 'refund' } : { ok: false, error: lastErr || 'İade başarısız' };
}
