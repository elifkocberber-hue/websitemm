-- =============================================================================
-- SİPARİŞ KAYDI UYUMLULUK MIGRATION'I (Phase 2)
-- =============================================================================
-- Supabase → SQL Editor'da bir kez çalıştır.
--
-- AMAÇ: Ödeme tamamlandığında siparişin DB'ye kaydedilebilmesi için şemayı
-- gerçek veriyle uyumlu hale getirmek.
--   1) Ürün id'leri UUID — order_items.product_id integer'dan text'e çevrilir.
--   2) Sipariş, giriş yapan kullanıcıya (site_users) bağlanabilsin diye
--      orders.user_id'deki eski FK (legacy 'users' tablosuna) kaldırılır ve
--      nullable yapılır (misafir alışverişi için).
--   3) Onay e-postası ve misafir siparişleri için orders'a müşteri bilgisi +
--      iyzico ödeme referansı kolonları eklenir.
--
-- Idempotent: tekrar tekrar çalıştırılabilir.
-- =============================================================================

-- 1) order_items.product_id: integer -> text (ürün id'leri UUID)
ALTER TABLE public.order_items
  ALTER COLUMN product_id TYPE text USING product_id::text;

-- 2a) orders.user_id üzerindeki ESKİ foreign key'i adından bağımsız olarak kaldır
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute a
      ON a.attrelid = con.conrelid AND a.attnum = ANY (con.conkey)
    WHERE con.conrelid = 'public.orders'::regclass
      AND con.contype = 'f'
      AND a.attname = 'user_id'
  LOOP
    EXECUTE format('ALTER TABLE public.orders DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- 2b) orders.user_id nullable (misafir alışverişi için) — artık site_users.id tutulur
ALTER TABLE public.orders
  ALTER COLUMN user_id DROP NOT NULL;

-- 3) Müşteri bilgisi + iyzico ödeme referansı kolonları
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS iyzico_payment_id text;
