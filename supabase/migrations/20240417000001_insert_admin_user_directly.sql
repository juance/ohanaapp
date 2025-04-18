-- Insertar directamente el usuario administrador con la contraseña correctamente hasheada
-- La contraseña 'Juance001' está hasheada con bcrypt

-- Primero, verificar si la tabla users existe
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Verificar si el usuario ya existe
    IF EXISTS (
      SELECT FROM public.users
      WHERE phone_number = '1123989718'
    ) THEN
      -- Actualizar el usuario existente
      UPDATE public.users
      SET 
        name = 'Admin General',
        password = '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
        role = 'admin'
      WHERE phone_number = '1123989718';
      
      RAISE NOTICE 'Usuario administrador actualizado con éxito';
    ELSE
      -- Insertar el usuario administrador
      INSERT INTO public.users (name, phone_number, password, role)
      VALUES (
        'Admin General',
        '1123989718',
        '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
        'admin'
      );
      
      RAISE NOTICE 'Usuario administrador creado con éxito';
    END IF;
  ELSE
    RAISE NOTICE 'La tabla users no existe. Cree la tabla primero.';
  END IF;
END $$;
