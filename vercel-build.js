// Este script se ejecuta durante el proceso de construcción en Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que el directorio dist existe
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Crear un archivo _redirects para asegurar que las rutas de SPA funcionen correctamente
fs.writeFileSync(
  path.join('dist', '_redirects'),
  '/* /index.html 200'
);

console.log('Configuración de Vercel completada con éxito.');
