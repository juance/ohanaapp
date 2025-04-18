-- Función para crear un usuario administrador con credenciales específicas
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar si la tabla users existe
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Verificar si el usuario ya existe
    IF NOT EXISTS (
      SELECT FROM public.users
      WHERE phone_number = '1123989718'
    ) THEN
      -- Insertar el usuario administrador
      -- La contraseña 'Juance001' está hasheada con bcrypt
      INSERT INTO public.users (name, phone_number, password, role)
      VALUES (
        'Admin General',
        '1123989718',
        '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
        'admin'
      );
    ELSE
      -- Actualizar el usuario existente para asegurarse de que tenga el rol de admin
      UPDATE public.users
      SET 
        name = 'Admin General',
        password = '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
        role = 'admin'
      WHERE phone_number = '1123989718';
    END IF;
  END IF;
END;
$$;
