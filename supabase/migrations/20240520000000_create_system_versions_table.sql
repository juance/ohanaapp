-- Create system_versions table
CREATE TABLE IF NOT EXISTS public.system_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  changes JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on version for faster lookups
CREATE INDEX IF NOT EXISTS system_versions_version_idx ON public.system_versions (version);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS system_versions_is_active_idx ON public.system_versions (is_active);

-- Create function to ensure only one active version
CREATE OR REPLACE FUNCTION public.ensure_single_active_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.system_versions
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one active version
DROP TRIGGER IF EXISTS ensure_single_active_version_trigger ON public.system_versions;
CREATE TRIGGER ensure_single_active_version_trigger
BEFORE INSERT OR UPDATE OF is_active ON public.system_versions
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.ensure_single_active_version();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_system_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_system_versions_updated_at_trigger ON public.system_versions;
CREATE TRIGGER update_system_versions_updated_at_trigger
BEFORE UPDATE ON public.system_versions
FOR EACH ROW
EXECUTE FUNCTION public.update_system_versions_updated_at();

-- Insert initial version data
INSERT INTO public.system_versions (version, release_date, changes, is_active)
VALUES (
  '1.0.0',
  '2023-10-15T00:00:00Z',
  '[
    {
      "type": "feature",
      "title": "Lanzamiento inicial",
      "description": "Primera versión del sistema de gestión de lavandería"
    },
    {
      "type": "feature",
      "title": "Sistema de tickets",
      "description": "Implementación del sistema básico de tickets"
    },
    {
      "type": "feature",
      "title": "Gestión de clientes",
      "description": "Funcionalidad para administrar clientes"
    }
  ]'::jsonb,
  true
)
ON CONFLICT (version) DO NOTHING;

-- Insert version 1.1.0
INSERT INTO public.system_versions (version, release_date, changes, is_active)
VALUES (
  '1.1.0',
  '2023-11-20T00:00:00Z',
  '[
    {
      "type": "feature",
      "title": "Programa de fidelidad",
      "description": "Implementación del sistema de puntos de fidelidad para clientes frecuentes"
    },
    {
      "type": "improvement",
      "title": "Mejora en la interfaz de usuario",
      "description": "Rediseño de la interfaz para mejorar la experiencia de usuario"
    },
    {
      "type": "fix",
      "title": "Corrección de errores en tickets",
      "description": "Solución a problemas con la numeración de tickets"
    }
  ]'::jsonb,
  false
)
ON CONFLICT (version) DO NOTHING;

-- Insert version 1.2.0
INSERT INTO public.system_versions (version, release_date, changes, is_active)
VALUES (
  '1.2.0',
  '2024-01-10T00:00:00Z',
  '[
    {
      "type": "feature",
      "title": "Gestión de inventario",
      "description": "Nueva funcionalidad para administrar el inventario de productos"
    },
    {
      "type": "security",
      "title": "Mejoras de seguridad",
      "description": "Implementación de medidas de seguridad adicionales"
    }
  ]'::jsonb,
  false
)
ON CONFLICT (version) DO NOTHING;

-- Insert version 1.3.0
INSERT INTO public.system_versions (version, release_date, changes, is_active)
VALUES (
  '1.3.0',
  '2024-03-05T00:00:00Z',
  '[
    {
      "type": "feature",
      "title": "Notificaciones por WhatsApp",
      "description": "Integración con WhatsApp para enviar notificaciones a clientes"
    },
    {
      "type": "improvement",
      "title": "Optimización de rendimiento",
      "description": "Mejoras en la velocidad y rendimiento general de la aplicación"
    }
  ]'::jsonb,
  false
)
ON CONFLICT (version) DO NOTHING;

-- Insert version 1.4.0
INSERT INTO public.system_versions (version, release_date, changes, is_active)
VALUES (
  '1.4.0',
  '2024-05-20T00:00:00Z',
  '[
    {
      "type": "feature",
      "title": "Alertas de tickets no retirados",
      "description": "Sistema de alertas para tickets que no han sido retirados después de 45 y 90 días"
    },
    {
      "type": "improvement",
      "title": "Mejoras en el panel de administración",
      "description": "Nuevas funcionalidades en el panel de administración"
    },
    {
      "type": "feature",
      "title": "Control de versiones",
      "description": "Implementación del sistema de control de versiones con capacidad de rollback"
    }
  ]'::jsonb,
  false
)
ON CONFLICT (version) DO NOTHING;
