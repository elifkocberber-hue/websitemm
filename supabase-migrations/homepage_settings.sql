-- Anasayfa metin ayarları tablosu
CREATE TABLE IF NOT EXISTS homepage_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_subtitle TEXT NOT NULL DEFAULT 'El Yapımı Seramik Ürünler & Hediyeler',
  hero_title TEXT NOT NULL DEFAULT 'Fırından Yeni Çıkan\nMutluluklar',
  hero_desc TEXT NOT NULL DEFAULT 'Doğanın toprağından, ustalarımızın elleriyle şekillenen; evinize anlam ve güzellik katan eserler.',
  collection_label TEXT NOT NULL DEFAULT 'Koleksiyon',
  featured_title TEXT NOT NULL DEFAULT 'Öne Çıkan Eserler',
  philosophy_label TEXT NOT NULL DEFAULT 'Felsefemiz',
  philosophy_title TEXT NOT NULL DEFAULT 'Wabi-Sabi',
  philosophy_desc TEXT NOT NULL DEFAULT 'Kusursuzlukta güzellik aramıyoruz. Her çatlak, her doku, her asimetri — tabiatın ve insan elinin imzası.',
  pillar1_title TEXT NOT NULL DEFAULT 'Geleneksel Zanaat',
  pillar1_desc TEXT NOT NULL DEFAULT 'Yüzyıllık teknikleri modern formlarla buluşturuyoruz.',
  pillar2_title TEXT NOT NULL DEFAULT 'Doğal Malzeme',
  pillar2_desc TEXT NOT NULL DEFAULT 'En kaliteli topraklar ve organik cilalarla üretiyoruz.',
  pillar3_title TEXT NOT NULL DEFAULT 'Benzersiz Tasarım',
  pillar3_desc TEXT NOT NULL DEFAULT 'Her parça tek ve tekrarlanamaz bir sanat eseridir.',
  cta_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&q=80',
  featured_product_ids JSONB NOT NULL DEFAULT '[]',
  cta_title TEXT NOT NULL DEFAULT 'Evinize Sanat Katın',
  cta_btn TEXT NOT NULL DEFAULT 'Alışverişe Başla',
  newsletter_title TEXT NOT NULL DEFAULT 'Haberdar Olun',
  newsletter_desc TEXT NOT NULL DEFAULT 'Yeni koleksiyonlar, özel teklifler ve atölyeden haberler.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO homepage_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
