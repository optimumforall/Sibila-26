-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de emails permitidos (whitelist)
CREATE TABLE IF NOT EXISTS allowed_users (
  email TEXT PRIMARY KEY
);

-- Insertar el email de Juana
INSERT INTO allowed_users (email) VALUES ('REEMPLAZAR_CON_EMAIL_DE_JUANA');

-- 2. Tabla de análisis
CREATE TABLE IF NOT EXISTS analyses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  file_url          TEXT NOT NULL,
  file_type         TEXT CHECK (file_type IN ('video', 'image')) NOT NULL,
  caption_original  TEXT,
  transcription     TEXT,
  veredicto         TEXT CHECK (veredicto IN ('APROBADO', 'APROBADO_CON_CAMBIOS', 'NO_PUBLICAR')) NOT NULL,
  puntuacion        INTEGER CHECK (puntuacion BETWEEN 1 AND 10) NOT NULL,
  problemas         JSONB DEFAULT '[]',
  caption_sugerido  TEXT,
  explicacion       TEXT
);

-- 3. Row Level Security (RLS) — cada usuario solo ve sus datos
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven solo sus análisis"
  ON analyses FOR ALL
  USING (auth.uid() = user_id);

-- 4. Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);

-- 5. Bucket de Storage (ejecutar en Storage > New bucket si no existe)
-- Nombre: content-uploads
-- Public: false (archivos privados)
