# Instrucciones para aplicar las correcciones de TypeScript (Parte 2)

Hemos creado un archivo de parche (`0001-Corregir-errores-de-TypeScript-en-FreeValetDialog-us.patch`) que contiene las correcciones de TypeScript para varios archivos. A continuación, se detallan las instrucciones para aplicar estos cambios manualmente.

## Opción 1: Aplicar el parche directamente

Si tienes acceso al repositorio local y remoto, puedes aplicar el parche directamente:

1. Asegúrate de estar en la rama principal del repositorio remoto:
   ```
   git checkout main
   git pull origin main
   ```

2. Aplica el parche:
   ```
   git apply 0001-Corregir-errores-de-TypeScript-en-FreeValetDialog-us.patch
   ```

3. Haz commit de los cambios:
   ```
   git add .
   git commit -m "Corregir errores de TypeScript en FreeValetDialog, usePickupOrdersLogic y useDashboardData"
   ```

4. Haz push de los cambios:
   ```
   git push origin main
   ```

## Opción 2: Aplicar los cambios manualmente

Si prefieres aplicar los cambios manualmente, aquí están los cambios que debes realizar:

### 1. Archivo: `src/components/ticket/FreeValetDialog.tsx`

1. Modificar la llamada a `useCustomerFreeValet`:
   ```typescript
   // Antes
   const success = await useCustomerFreeValet(foundCustomer.id, foundCustomer);

   // Después
   const { useFreeValet } = useCustomerFreeValet(foundCustomer.id, () => {
     setUseFreeValet(true);
     onOpenChange(false);
     // Al usar valet gratis, forzamos cantidad 1
     setValetQuantity(1);
     toast.success('Valet gratis aplicado al ticket');
   });
   const success = await useFreeValet();
   ```

2. Simplificar la lógica después de llamar a `useFreeValet`:
   ```typescript
   // Antes
   if (success) {
     setUseFreeValet(true);
     onOpenChange(false);
     // Al usar valet gratis, forzamos cantidad 1
     setValetQuantity(1);
     toast.success('Valet gratis aplicado al ticket');
   } else {
     // Si falla, no aplicamos el valet gratis
     setUseFreeValet(false);
     onOpenChange(false);
   }

   // Después
   if (!success) {
     // Si falla, no aplicamos el valet gratis
     setUseFreeValet(false);
     onOpenChange(false);
   }
   ```

### 2. Archivo: `src/hooks/usePickupOrdersLogic.ts`

1. Reemplazar `onSettled` por `onSuccess` y `onError`:
   ```typescript
   // Antes
   onSettled: (data, err) => {
     if (err) {
       console.error('Error en la consulta de tickets:', err);
       toast.error('Error al cargar los tickets');
     } else if (data) {
       console.log('Tickets cargados correctamente:', data.length);
     }
   }

   // Después
   onSuccess: (data) => {
     console.log('Tickets cargados correctamente:', data.length);
   },
   onError: (err) => {
     console.error('Error en la consulta de tickets:', err);
     toast.error('Error al cargar los tickets');
   }
   ```

### 3. Archivo: `src/hooks/useDashboardData.tsx`

1. Usar type assertion para `dry_cleaning_items`:
   ```typescript
   // Antes
   const dryCleaningItemsData = Array.isArray(ticket.dry_cleaning_items) ? ticket.dry_cleaning_items : [];

   // Después
   const dryCleaningItemsData = Array.isArray((ticket as any).dry_cleaning_items) ? (ticket as any).dry_cleaning_items : [];
   ```

## Contacto

Si tienes alguna pregunta o necesitas ayuda para aplicar estos cambios, por favor contacta al equipo de desarrollo.
