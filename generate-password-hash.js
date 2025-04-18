// Script para generar un hash de contraseña usando bcrypt
import bcrypt from 'bcryptjs';

// Función para generar un hash de contraseña
async function generatePasswordHash(password) {
  try {
    // Generar un salt (10 rondas es el valor recomendado para un buen balance entre seguridad y rendimiento)
    const salt = await bcrypt.genSalt(10);

    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hash de contraseña generado con éxito:');
    console.log(hashedPassword);

    // Generar el SQL para actualizar la contraseña
    console.log('\nSQL para actualizar la contraseña del administrador:');
    console.log(`
UPDATE public.users
SET
  password = '${hashedPassword}',
  password_last_changed = now()
WHERE phone_number = '1123989718';
    `);

    return hashedPassword;
  } catch (error) {
    console.error('Error al generar el hash de la contraseña:', error);
    throw error;
  }
}

// Contraseña que deseas hashear (reemplaza esto con tu nueva contraseña segura)
const newPassword = 'NuevaContraseñaSegura123!';

// Generar el hash
generatePasswordHash(newPassword)
  .then(() => {
    console.log('\nPara usar este script:');
    console.log('1. Instala bcryptjs si aún no lo has hecho: npm install bcryptjs');
    console.log('2. Ejecuta este script: node generate-password-hash.js');
    console.log('3. Copia el SQL generado y ejecútalo en el editor SQL de Supabase');
    console.log('\nNota: Reemplaza "NuevaContraseñaSegura123!" en este script con tu contraseña deseada antes de ejecutarlo');
  })
  .catch(err => {
    console.error('Error:', err);
  });
