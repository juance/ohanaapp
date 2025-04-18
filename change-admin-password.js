// Script con instrucciones para cambiar la contraseña del administrador
// Este script muestra las instrucciones para cambiar la contraseña manualmente

console.log(`
=======================================================================
INSTRUCCIONES PARA CAMBIAR LA CONTRASEÑA DEL ADMINISTRADOR EN SUPABASE
=======================================================================

1. Accede al panel de control de Supabase
2. Ve a la sección "SQL Editor"
3. Crea un nuevo script SQL
4. Copia y pega el contenido del archivo "supabase/migrations/20240417000006_update_admin_password.sql"
5. Ejecuta el script haciendo clic en el botón "Run"
6. Verifica que la contraseña se haya actualizado correctamente

DETALLES DE LA NUEVA CONTRASEÑA:

- Usuario: Administrador (teléfono: 1123989718)
- Nueva contraseña: NuevaContraseñaSegura123!

IMPORTANTE:
Esta contraseña es solo un ejemplo. Por seguridad, deberías:

1. Generar tu propia contraseña segura
2. Usar el script "generate-password-hash.js" para generar un nuevo hash
3. Actualizar el script SQL con tu propio hash antes de ejecutarlo

Para generar un nuevo hash:
1. Edita el archivo "generate-password-hash.js" y cambia la contraseña
2. Ejecuta: npm install bcryptjs (si aún no lo has hecho)
3. Ejecuta: node generate-password-hash.js
4. Copia el SQL generado y ejecútalo en Supabase

=======================================================================
`);
