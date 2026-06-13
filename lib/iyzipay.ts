import Iyzipay from 'iyzipay';

// iyzico API yanıtının ihtiyaç duyduğumuz alanları
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

// Resmi iyzipay SDK client'ı — imza/kimlik doğrulamayı SDK kendi halleder.
function getClient() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const uri = process.env.IYZICO_BASE_URL;
  if (!apiKey || !secretKey || !uri) {
    throw new Error('iyzico ortam değişkenleri eksik (IYZICO_API_KEY / IYZICO_SECRET_KEY / IYZICO_BASE_URL).');
  }
  return new Iyzipay({ apiKey, secretKey, uri });
}

// 3D Secure başlatma (kart bilgisiyle) — banka OTP HTML içeriğini döndürür
export function threedsInitialize(request: Record<string, unknown>): Promise<IyzicoResult> {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.threedsInitialize.create(request, (err: Error | null, result: IyzicoResult) =>
      err ? reject(err) : resolve(result)
    );
  });
}

// 3D Secure tamamlama (banka OTP sonrası callback'te çağrılır)
export function threedsComplete(request: Record<string, unknown>): Promise<IyzicoResult> {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.threedsPayment.create(request, (err: Error | null, result: IyzicoResult) =>
      err ? reject(err) : resolve(result)
    );
  });
}
