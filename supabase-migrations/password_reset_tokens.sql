-- Şifre sıfırlama tokenları tablosu
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES site_users(id) ON DELETE CASCADE,
  token       text        NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Token ile hızlı arama için index
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_full_access" ON password_reset_tokens
  FOR ALL USING (true) WITH CHECK (true);
