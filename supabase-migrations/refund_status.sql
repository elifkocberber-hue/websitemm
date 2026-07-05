-- İptal edilen siparişlerde otomatik para iadesinin sonucunu takip et.
-- refund_status: 'refunded' (iade tamam) | 'failed' (otomatik iade başarısız — manuel gerekir)
-- refund_error: başarısızsa iyzico hata mesajı
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS refund_status TEXT,
  ADD COLUMN IF NOT EXISTS refund_error TEXT;
