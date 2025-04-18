-- Script para actualizar la contraseña del administrador
-- La contraseña está hasheada con bcrypt

-- Actualizar la contraseña del administrador
UPDATE public.users
SET
  password = '$2b$10$u9vuCKG85e.VlGaL7TyO1.jHaaCI/QwqpZV63W3/49ydrvCuKfun.', -- Contraseña: NuevaContraseñaSegura123!
  password_last_changed = now()
WHERE phone_number = '1123989718';

-- Verificar que la actualización se haya realizado correctamente
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE phone_number = '1123989718'
    AND password = '$2b$10$u9vuCKG85e.VlGaL7TyO1.jHaaCI/QwqpZV63W3/49ydrvCuKfun.';

  IF admin_count = 1 THEN
    RAISE NOTICE 'La contraseña del administrador se ha actualizado correctamente.';
  ELSE
    RAISE NOTICE 'No se pudo actualizar la contraseña del administrador.';
  END IF;
END $$;
