-- Ürünlere İngilizce ad alanı. Müşteri EN modundayken (ve /en sayfalarında) bu ad
-- gösterilir; boşsa Türkçe 'name' alanına düşülür (kod tarafında). Mevcut ürünlerin
-- Türkçe adları 'name' sütununda kalır, dokunulmaz.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_en TEXT;
