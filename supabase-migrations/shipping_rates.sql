-- Ülke bazlı kargo ücretleri + ücretsiz kargo eşiği.
-- Admin panelde ücreti tanımlanmayan ülkeye satış yapılmaz (checkout engeller).
-- free_over_threshold: ücretsiz kargo eşiği bu ülkede geçerli mi (ülke bazında aç/kapa).

CREATE TABLE IF NOT EXISTS shipping_rates (
  country_code TEXT PRIMARY KEY,          -- ISO-2: 'TR','DE','US'...
  country_name TEXT NOT NULL,
  cost NUMERIC(10,2) NOT NULL,
  free_over_threshold BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping_settings (
  id INT PRIMARY KEY,
  free_shipping_threshold NUMERIC(10,2)   -- NULL = eşik kapalı
);

INSERT INTO shipping_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Geçiş güvenliği: TR 0₺ ile seed edilir → mevcut "ücretsiz kargo" davranışı,
-- admin panelden ücret girilene kadar aynen devam eder.
INSERT INTO shipping_rates (country_code, country_name, cost)
  VALUES ('TR', 'Türkiye', 0) ON CONFLICT DO NOTHING;

-- RLS: erişim yalnız sunucu route'larından (service-role) — anon policy YOK.
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;
