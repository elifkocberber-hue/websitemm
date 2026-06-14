-- =============================================================================
-- KARGO FİRMASI KOLONU
-- =============================================================================
-- Supabase → SQL Editor'da bir kez çalıştır.
-- Admin, takip numarasıyla birlikte kargo firması adını da elle girer;
-- müşteri "Siparişlerim"de bu adı görür (seçim yapmaz).
-- Idempotent.
-- =============================================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier text;
