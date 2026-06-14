-- =============================================================================
-- ÖDEME SONRASI (TEŞEKKÜR) METNİ AYARLARI
-- =============================================================================
-- Supabase → SQL Editor'da bir kez çalıştır.
-- Admin panelinden "Teşekkürler" sayfasının başlık + metnini düzenlemeyi sağlar.
-- Varsayılan metin route içinde tutulur; tablo yalnız özelleştirmeyi saklar.
-- =============================================================================

create table if not exists thankyou_settings (
  id         integer primary key default 1,
  title      text,
  body       text,
  updated_at timestamptz default now(),
  constraint thankyou_single_row check (id = 1)
);

-- Sunucu route'ları service_role ile okur/yazar (RLS bypass). Anon erişimine gerek yok.
alter table thankyou_settings enable row level security;
