# Guía de Despliegue para Ohana Laundry App

## Despliegue en la Nube (Acceso desde cualquier lugar)

### Opción 1: Vercel (Recomendado)

1. Crea una cuenta en [Vercel](https://vercel.com/) usando tu cuenta de GitHub
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Configura las variables de entorno:
   - VITE_SUPABASE_URL: [Tu URL de Supabase]
   - VITE_SUPABASE_ANON_KEY: [Tu clave anónima de Supabase]
5. Haz clic en "Deploy"
6. Una vez desplegado, podrás acceder a tu aplicación desde la URL proporcionada por Vercel

### Opción 2: Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Haz clic en "Add new site" > "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno igual que en Vercel
5. Haz clic en "Deploy site"

## Despliegue Local (Acceso en red local)

Si quieres que la aplicación sea accesible solo en tu red local:

1. Clona el repositorio:
   ```
   git clone https://github.com/juance/ohanaapp.git
   cd ohanaapp
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Construye la aplicación para producción:
   ```
   npm run build
   ```

5. Inicia el servidor local:
   ```
   npm run serve
   ```

6. La aplicación estará disponible en:
   - Desde el mismo dispositivo: http://localhost:8080
   - Desde otros dispositivos en la misma red: http://[IP-DE-TU-COMPUTADORA]:8080
     (Puedes encontrar tu IP con el comando `ipconfig` en Windows o `ifconfig` en Mac/Linux)

## Configuración de Dominio Personalizado (Opcional)

Si deseas usar un dominio personalizado:

1. Compra un dominio en un proveedor como Namecheap, GoDaddy, etc.
2. En el dashboard de Vercel o Netlify:
   - Ve a la configuración de tu proyecto
   - Busca la sección "Domains"
   - Agrega tu dominio personalizado
   - Sigue las instrucciones para configurar los registros DNS

## Solución de Problemas

### La aplicación no se conecta a Supabase

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que las reglas de seguridad de Supabase permitan conexiones desde tu dominio

### Error "Page Not Found" al recargar la página

- Verifica que la configuración de redirecciones esté correcta en vercel.json o netlify.toml
- Para despliegue local, asegúrate de estar usando el comando `npm run serve`

### La aplicación es lenta

- Considera usar un CDN como Cloudflare para mejorar el rendimiento
- Optimiza las imágenes y recursos estáticos
