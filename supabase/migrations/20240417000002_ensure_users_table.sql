-- Asegurarse de que la tabla users exista
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índice para búsquedas por teléfono si no existe
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);

-- Insertar el usuario administrador si no existe
INSERT INTO public.users (name, phone_number, password, role)
VALUES (
  'Admin General',
  '1123989718',
  '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
  'admin'
)
ON CONFLICT (phone_number) 
DO UPDATE SET 
  name = 'Admin General',
  password = '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK',
  role = 'admin';
