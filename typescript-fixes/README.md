# Correcciones de TypeScript

Este directorio contiene un archivo de parche con correcciones para varios errores de TypeScript en la aplicación.

## Archivo de parche

El archivo `0001-Corregir-errores-de-TypeScript-en-valetService-FreeV.patch` contiene las siguientes correcciones:

### 1. Correcciones en `src/lib/data/customer/valetService.ts`

- Importé `CUSTOMERS_STORAGE_KEY` desde `@/lib/constants/storageKeys`
- Eliminé las referencias al campo `last_reset_date` que no existe en la tabla `customers`
- Simplifiqué la lógica de reinicio de contadores para evitar errores de tipo
- Eliminé el campo `last_reset_date` de la operación de actualización

### 2. Correcciones en `src/components/ticket/FreeValetDialog.tsx`

- Corregí la llamada a `useCustomerFreeValet` para pasar el segundo parámetro requerido (el objeto `foundCustomer`)

### 3. Correcciones en `src/hooks/usePickupOrdersLogic.ts`

- Reemplacé `cacheTime` (obsoleto) por `gcTime` en la configuración de `useQuery`
- Reemplacé los callbacks separados `onError` y `onSuccess` por un único callback `onSettled` que maneja ambos casos

### 4. Correcciones en `src/lib/data/expenseService.ts`

- Importé el tipo `SyncableExpense` desde `@/lib/data/sync/expensesSync` para resolver errores de tipo

## Cómo aplicar el parche

Para aplicar el parche, sigue estos pasos:

1. Asegúrate de estar en la raíz del repositorio:
   ```
   cd ohanaapp
   ```

2. Aplica el parche:
   ```
   git apply typescript-fixes/0001-Corregir-errores-de-TypeScript-en-valetService-FreeV.patch
   ```

3. Verifica que los cambios se hayan aplicado correctamente:
   ```
   git status
   ```

4. Haz commit de los cambios:
   ```
   git add src/lib/data/customer/valetService.ts src/components/ticket/FreeValetDialog.tsx src/hooks/usePickupOrdersLogic.ts src/lib/data/expenseService.ts
   git commit -m "Corregir errores de TypeScript en valetService, FreeValetDialog, usePickupOrdersLogic y expenseService"
   ```

5. Haz push de los cambios:
   ```
   git push origin main
   ```

## Notas adicionales

Estos cambios deberían resolver la mayoría de los errores de TypeScript que estaban ocurriendo en la aplicación. Si encuentras algún otro error, por favor crea un nuevo issue en el repositorio.
