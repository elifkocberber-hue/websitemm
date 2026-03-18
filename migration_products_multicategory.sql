-- ============================================================
-- Migration: Ürünlere çoklu kategori desteği
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
