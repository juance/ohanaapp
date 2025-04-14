# Instrucciones para la Base de Datos

Este documento proporciona instrucciones detalladas sobre cómo configurar y mantener la base de datos para la aplicación Ohana Laundry.

## Creación de Tablas

Las tablas necesarias para la aplicación son:

1. `customers`: Almacena información sobre los clientes
2. `tickets`: Almacena información sobre los tickets de lavandería
3. `dry_cleaning_items`: Almacena los servicios de lavado en seco asociados a un ticket
4. `ticket_laundry_options`: Almacena las opciones de lavandería seleccionadas para un ticket
5. `ticket_sequence`: Almacena la secuencia para generar números de ticket

### Método 1: Usando la Página de Diagnóstico

La forma más sencilla de crear las tablas es utilizando la página de diagnóstico de la aplicación:

1. Accede a la aplicación y navega a la página de diagnóstico (`/diagnostics`)
2. Ejecuta el diagnóstico haciendo clic en el botón "Ejecutar diagnóstico"
3. Si faltan tablas, aparecerá un botón "Crear tablas faltantes"
4. Haz clic en ese botón para crear todas las tablas necesarias
5. Espera a que se complete el proceso y se ejecute un nuevo diagnóstico automáticamente

### Método 2: Usando la Consola SQL de Supabase

Si prefieres crear las tablas manualmente, puedes utilizar la consola SQL de Supabase:

1. Accede al panel de control de Supabase
2. Ve a la sección "SQL Editor"
3. Crea un nuevo script
4. Copia y pega el contenido del archivo `docs/CREATE_TABLES.sql`
5. Ejecuta el script

## Verificación de la Base de Datos

Para verificar que la base de datos está configurada correctamente:

1. Accede a la página de diagnóstico (`/diagnostics`)
2. Ejecuta el diagnóstico haciendo clic en el botón "Ejecutar diagnóstico"
3. Verifica que no haya tablas faltantes ni columnas faltantes
4. Si todo está correcto, deberías ver marcas de verificación verdes

## Creación de un Ticket de Prueba

Para verificar que todo funciona correctamente, puedes crear un ticket de prueba:

1. Accede a la página de diagnóstico (`/diagnostics`)
2. Haz clic en el botón "Crear ticket de prueba"
3. Verifica que el ticket se haya creado correctamente
4. Navega a la página "Listos para Retirar" (`/pickup`) para ver el ticket

## Solución de Problemas

### Si los tickets no aparecen en "Pedidos Listos para Retirar":

1. Verifica que los tickets tengan el estado "ready" en la base de datos
2. Asegúrate de que la conexión a Supabase funcione correctamente
3. Comprueba que la estructura de la base de datos sea correcta
4. Intenta crear un ticket de prueba desde la página de diagnóstico

### Si la aplicación no funciona en la red local:

1. Asegúrate de que el servidor esté configurado para escuchar en todas las interfaces (0.0.0.0)
2. Verifica que no haya restricciones de CORS en Supabase
3. Comprueba que el firewall no esté bloqueando las conexiones
4. Intenta acceder usando la IP del servidor en lugar del nombre de host

## Mantenimiento de la Base de Datos

### Reinicio de la Secuencia de Tickets

Si necesitas reiniciar la secuencia de tickets a 0:

1. Accede a la consola SQL de Supabase
2. Ejecuta el siguiente comando:

```sql
SELECT reset_ticket_sequence();
```

### Backup de la Base de Datos

Es recomendable realizar backups periódicos de la base de datos:

1. Accede al panel de control de Supabase
2. Ve a la sección "Database"
3. Haz clic en "Backups"
4. Haz clic en "Create Backup"

### Restauración de la Base de Datos

Si necesitas restaurar la base de datos desde un backup:

1. Accede al panel de control de Supabase
2. Ve a la sección "Database"
3. Haz clic en "Backups"
4. Selecciona el backup que deseas restaurar
5. Haz clic en "Restore"
