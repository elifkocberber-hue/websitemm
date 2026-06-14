-- Teşekkür sayfasına ayrı "alt başlık" alanı ekler (başlık + alt başlık + metin)
-- Supabase → SQL Editor'da bir kez çalıştır.
alter table thankyou_settings add column if not exists subtitle text;
