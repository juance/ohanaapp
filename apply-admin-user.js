// Script para aplicar el usuario administrador en Supabase
// Este script muestra las instrucciones para aplicar los cambios manualmente

console.log(`
=======================================================================
INSTRUCCIONES PARA AGREGAR EL USUARIO ADMINISTRADOR EN SUPABASE
=======================================================================

1. Accede al panel de control de Supabase
2. Ve a la sección "SQL Editor"
3. Crea un nuevo script SQL
4. Copia y pega el siguiente código:

-- Crear o actualizar el usuario administrador
DO $$
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
      
      RAISE NOTICE 'Usuario administrador creado con éxito';
    ELSE
      -- Actualizar el usuario existente para asegurarse de que tenga el rol de admin
      UPDATE public.users
      SET 
        name = 'Admin General',
        password = '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
        role = 'admin'
      WHERE phone_number = '1123989718';
      
      RAISE NOTICE 'Usuario administrador actualizado con éxito';
    END IF;
  ELSE
    RAISE NOTICE 'La tabla users no existe. Cree la tabla primero.';
  END IF;
END $$;

5. Ejecuta el script haciendo clic en el botón "Run"
6. Verifica que el usuario se haya creado correctamente

CREDENCIALES DEL USUARIO ADMINISTRADOR:
- Número de teléfono: 1123989718
- Contraseña: Juance001
- Rol: admin

=======================================================================
`);
