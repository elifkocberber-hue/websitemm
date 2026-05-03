-- homepage_settings ve about_settings tablolarına text_colors JSONB sütunu ekle
ALTER TABLE homepage_settings
  ADD COLUMN IF NOT EXISTS text_colors JSONB NOT NULL DEFAULT '{}';

ALTER TABLE about_settings
  ADD COLUMN IF NOT EXISTS text_colors JSONB NOT NULL DEFAULT '{}';
