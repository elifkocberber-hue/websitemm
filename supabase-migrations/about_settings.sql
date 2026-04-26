-- Hikayemiz / About sayfası ayarları tablosu
CREATE TABLE IF NOT EXISTS about_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80',
  story_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  founded TEXT NOT NULL DEFAULT 'Kuruluş · 1994',
  story_title TEXT NOT NULL DEFAULT 'Topraktan\nDünyaya',
  story_p1 TEXT NOT NULL DEFAULT 'Üç kuşaklık seramik geleneğini taşıyan atölyemiz, 1994 yılında kuruldu. Babamızın başlattığı bu yolculuk, bugün aynı tutku ve titizlikle devam etmektedir.',
  story_p2 TEXT NOT NULL DEFAULT 'Her ürünümüz, el yapımı teknikleri ve ustalarımızın birikimi ile özenle şekillendirilir. Geleneksel topraklar ve modern tasarımlar bir araya gelerek çağdaş bir koleksiyon oluşturmuştur.',
  story_p3 TEXT NOT NULL DEFAULT 'Biz sadece ürün satmıyoruz — sanat ve kültüre saygı içinde yaratılan, hayatın her anını güzelleştiren eserler sunuyoruz.',
  stat1_value TEXT NOT NULL DEFAULT '30+',
  stat1_label TEXT NOT NULL DEFAULT 'Yıl Deneyim',
  stat2_value TEXT NOT NULL DEFAULT '400+',
  stat2_label TEXT NOT NULL DEFAULT 'Benzersiz Tasarım',
  stat3_value TEXT NOT NULL DEFAULT '%98',
  stat3_label TEXT NOT NULL DEFAULT 'Müşteri Memnuniyeti',
  stat4_value TEXT NOT NULL DEFAULT '3',
  stat4_label TEXT NOT NULL DEFAULT 'Kuşak Gelenek',
  val1_title TEXT NOT NULL DEFAULT 'Geleneksel Zanaat',
  val1_desc TEXT NOT NULL DEFAULT 'Yüzyıllık seramik tekniklerini modern formlarla harmanlıyoruz.',
  val2_title TEXT NOT NULL DEFAULT 'El Yapımı Kalite',
  val2_desc TEXT NOT NULL DEFAULT 'Her parça, ustalarımızın deneyimli elleri tarafından tek tek şekillendirilir.',
  val3_title TEXT NOT NULL DEFAULT 'Doğal Malzeme',
  val3_desc TEXT NOT NULL DEFAULT 'En kaliteli topraklar ve organik cilalarla çevre dostu üretim yapıyoruz.',
  val4_title TEXT NOT NULL DEFAULT 'Sürdürülebilirlik',
  val4_desc TEXT NOT NULL DEFAULT 'Doğaya saygılı üretim süreçleriyle geleceğe yatırım yapıyoruz.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Varsayılan satırı ekle (tablo boşsa)
INSERT INTO about_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
