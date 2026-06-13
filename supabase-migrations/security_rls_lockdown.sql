-- =============================================================================
-- GÜVENLİK: RLS KİLİTLEME MIGRATION'I
-- =============================================================================
-- Bu dosyayı Supabase → SQL Editor'da bir kez çalıştır.
--
-- AMAÇ: Public "anon" anahtarının (tarayıcıda görünür) hassas tablolara
-- erişimini tamamen kapatmak. Sunucu API route'ları artık "service_role"
-- anahtarı kullanıyor; service_role RLS'i bypass ettiği ve tam yetkili olduğu
-- için bu kilitleme sunucu işlemlerini ETKİLEMEZ.
--
-- KURAL:
--   * Hassas tablolar  -> anon/authenticated'tan TÜM yetkiler geri alınır.
--   * Public-read tablolar -> anon SADECE SELECT yapabilir, yazma kapalı.
--
-- Idempotent: tekrar tekrar çalıştırılabilir.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) HASSAS TABLOLAR — anon/authenticated tamamen kapalı (yalnız service_role)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  t text;
  sensitive text[] := ARRAY[
    'site_users',
    'password_reset_tokens',
    'orders',
    'order_items',
    'users',
    'user_carts',
    'return_requests',
    'newsletter_subscribers',
    'visitors'
  ];
BEGIN
  FOREACH t IN ARRAY sensitive LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated;', t);
    END IF;
  END LOOP;
END $$;

-- Eski "herkese açık" politikaları kaldır (artık gereksiz; service_role bypass eder)
DROP POLICY IF EXISTS "Users can view their own data"        ON public.users;
DROP POLICY IF EXISTS "Users can update their own data"       ON public.users;
DROP POLICY IF EXISTS "Users can view their own orders"       ON public.orders;
DROP POLICY IF EXISTS "Users can view their order items"      ON public.order_items;
DROP POLICY IF EXISTS "Service role can manage site_users"    ON public.site_users;
DROP POLICY IF EXISTS "service_full_access"                   ON public.user_carts;
DROP POLICY IF EXISTS "service_full_access"                   ON public.password_reset_tokens;
DROP POLICY IF EXISTS "Anyone can insert visitor data"        ON public.visitors;
DROP POLICY IF EXISTS "Anyone can update visitor duration"    ON public.visitors;
DROP POLICY IF EXISTS "Admins can view visitor data"          ON public.visitors;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter"    ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can view subscribers"     ON public.newsletter_subscribers;

-- -----------------------------------------------------------------------------
-- 2) PUBLIC-READ TABLOLAR — anon yalnız SELECT, yazma kapalı
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  t text;
  readonly text[] := ARRAY[
    'products',
    'categories',
    'faqs',
    'homepage_settings',
    'about_settings',
    'banner_settings',
    'terms_settings'
  ];
BEGIN
  FOREACH t IN ARRAY readonly LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
      -- yazma yetkilerini geri al, sadece okuma bırak
      EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon, authenticated;', t);
      EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated;', t);
    END IF;
  END LOOP;
END $$;

-- products: eski "Anyone can ..." politikalarını kaldır, temiz SELECT politikası kur
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products"      ON public.products;
DROP POLICY IF EXISTS "Anyone can update products"      ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products"      ON public.products;
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

-- categories: public okuma
DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

-- faqs: yalnız yayınlanmış SSS'ler herkese açık (soru gönderimi sunucu route'undan/service_role ile yapılır)
DROP POLICY IF EXISTS "Public can read published faqs" ON public.faqs;
DROP POLICY IF EXISTS "Service role full access"        ON public.faqs;
CREATE POLICY "public_read_published_faqs" ON public.faqs
  FOR SELECT TO anon, authenticated USING (status = 'published');

-- Tekil satırlı ayar tabloları: public okuma
DROP POLICY IF EXISTS "public_read_homepage_settings" ON public.homepage_settings;
CREATE POLICY "public_read_homepage_settings" ON public.homepage_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_about_settings" ON public.about_settings;
CREATE POLICY "public_read_about_settings" ON public.about_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_banner_settings" ON public.banner_settings;
CREATE POLICY "public_read_banner_settings" ON public.banner_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_terms_settings" ON public.terms_settings;
CREATE POLICY "public_read_terms_settings" ON public.terms_settings
  FOR SELECT TO anon, authenticated USING (true);

-- =============================================================================
-- DOĞRULAMA (opsiyonel — çalıştırıp sonucu inceleyebilirsin)
-- =============================================================================
-- Hassas tablolarda anon/authenticated için yetki KALMAMALI:
--   SELECT grantee, table_name, privilege_type
--   FROM information_schema.role_table_grants
--   WHERE grantee IN ('anon','authenticated')
--     AND table_schema = 'public'
--   ORDER BY table_name, grantee;
