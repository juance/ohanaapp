-- Crear tabla system_version si no existe
CREATE TABLE IF NOT EXISTS public.system_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  changes JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false NOT NULL,
  commit_sha TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Desactivar todas las versiones existentes
UPDATE public.system_version SET is_active = false;

-- Insertar versión 1.0.0 (Implementación de características principales)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.0.0',
  '2025-04-15T00:00:00Z',
  '[
    "Implementación del sistema de tickets",
    "Gestión de clientes y su historial",
    "Sistema de lealtad con valets gratuitos",
    "Panel de administración"
  ]',
  false,
  'b52451e',
  'https://github.com/juance/ohanaapp/commit/b52451e'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.1.0 (Impresión y compartir tickets)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.1.0',
  '2025-04-16T00:00:00Z',
  '[
    "Implementación de impresión de tickets",
    "Funcionalidad para compartir tickets por WhatsApp",
    "Mejoras en la interfaz de usuario"
  ]',
  false,
  '49e733d',
  'https://github.com/juance/ohanaapp/commit/49e733d'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.2.0 (Refactorización de formularios)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.2.0',
  '2025-04-16T12:00:00Z',
  '[
    "Refactorización de formularios de tickets",
    "Mejoras en el formulario de gastos",
    "Optimización del rendimiento"
  ]',
  false,
  '7e9764e',
  'https://github.com/juance/ohanaapp/commit/7e9764e'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.3.0 (Refactorización de la barra de navegación)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.3.0',
  '2025-04-16T18:00:00Z',
  '[
    "Refactorización de la barra de navegación",
    "Adición de nuevos elementos de menú",
    "Mejora de la experiencia de usuario en navegación"
  ]',
  false,
  '62a097a',
  'https://github.com/juance/ohanaapp/commit/62a097a'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.4.0 (Refactorización y organización de páginas)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.4.0',
  '2025-04-17T00:00:00Z',
  '[
    "Refactorización y organización de páginas",
    "Mejora de la estructura del código",
    "Optimización del rendimiento de la aplicación"
  ]',
  false,
  'e4db15e',
  'https://github.com/juance/ohanaapp/commit/e4db15e'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.5.0 (Ejecución de migraciones SQL)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.5.0',
  '2025-04-17T06:00:00Z',
  '[
    "Ejecución de migraciones SQL",
    "Actualización de la estructura de la base de datos",
    "Mejoras en el rendimiento de consultas"
  ]',
  false,
  'bed973e',
  'https://github.com/juance/ohanaapp/commit/bed973e'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.6.0 (Corrección de errores de TypeScript)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.6.0',
  '2025-04-17T12:00:00Z',
  '[
    "Corrección de errores de TypeScript",
    "Mejora de la tipificación en toda la aplicación",
    "Reducción de errores en tiempo de compilación"
  ]',
  false,
  '143b91f',
  'https://github.com/juance/ohanaapp/commit/143b91f'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.7.0 (Adición de métricas del dashboard y pestaña de clientes)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.7.0',
  '2025-04-17T18:00:00Z',
  '[
    "Adición de métricas del dashboard",
    "Nueva pestaña de clientes",
    "Mejoras en la visualización de datos"
  ]',
  false,
  '3850f33',
  'https://github.com/juance/ohanaapp/commit/3850f33'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 1.8.0 (Refactorización del servicio de datos)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '1.8.0',
  '2025-04-18T00:00:00Z',
  '[
    "Refactorización del servicio de datos",
    "Eliminación de métricas redundantes",
    "Optimización del rendimiento de la aplicación"
  ]',
  false,
  '61cc0a2',
  'https://github.com/juance/ohanaapp/commit/61cc0a2'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url;

-- Insertar versión 2.0.0 (Eliminación de opciones de reinicio de contadores)
INSERT INTO public.system_version (version, release_date, changes, is_active, commit_sha, github_url)
VALUES (
  '2.0.0',
  '2025-04-18T12:00:00Z',
  '[
    "Eliminación de opciones de reinicio de contadores",
    "Eliminación de reinicio de numeración de tickets",
    "Mejora de la seguridad del sistema"
  ]',
  true,
  '2c784e7',
  'https://github.com/juance/ohanaapp/commit/2c784e7'
)
ON CONFLICT (version) DO UPDATE SET
  changes = EXCLUDED.changes,
  commit_sha = EXCLUDED.commit_sha,
  github_url = EXCLUDED.github_url,
  is_active = true;
