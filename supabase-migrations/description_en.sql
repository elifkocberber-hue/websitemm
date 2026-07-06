-- Ürünlere İngilizce açıklama alanı. Müşteri EN modundayken bu metin gösterilir;
-- boşsa Türkçe 'description' alanına düşülür (kod tarafında). Mevcut ürünlerin
-- Türkçe açıklamaları 'description' sütununda kalır, dokunulmaz.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description_en TEXT;
