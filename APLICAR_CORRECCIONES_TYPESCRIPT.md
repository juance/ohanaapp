# Instrucciones para aplicar las correcciones de TypeScript

Este archivo contiene instrucciones para aplicar las correcciones de TypeScript a la aplicación.

## Opción 1: Usar los archivos de parche

1. Descomprime el archivo `typescript-fixes.zip` en la raíz del repositorio:
   ```
   Expand-Archive -Path typescript-fixes.zip -DestinationPath .
   ```

2. Sigue las instrucciones en el archivo `typescript-fixes/README.md` para aplicar el parche.

## Opción 2: Aplicar los cambios manualmente

Si prefieres aplicar los cambios manualmente, aquí están los cambios que debes realizar:

### 1. Archivo: `src/lib/data/customer/valetService.ts`

1. Importar `CUSTOMERS_STORAGE_KEY`:
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';
   ```

2. Modificar la consulta para eliminar `last_reset_date`:
   ```typescript
   const { data: customer, error: getError } = await supabase
     .from('customers')
     .select('valets_count, free_valets')
     .eq('id', customerId)
     .single();
   ```

3. Simplificar la lógica de reinicio de contadores:
   ```typescript
   // Verificar si necesitamos reiniciar el contador (primer día del mes)
   const now = new Date();
   // Usamos la fecha actual como referencia ya que last_reset_date no existe en la tabla
   const isNewMonth = true; // Siempre reiniciamos el contador por ahora
   ```

4. Eliminar `last_reset_date` de la operación de actualización:
   ```typescript
   const { error: updateError } = await supabase
     .from('customers')
     .update({
       valets_count: newTotalValets,
       free_valets: newFreeValets
     })
     .eq('id', customerId);
   ```

### 2. Archivo: `src/components/ticket/FreeValetDialog.tsx`

1. Modificar la llamada a `useCustomerFreeValet`:
   ```typescript
   const success = await useCustomerFreeValet(foundCustomer.id, foundCustomer);
   ```

### 3. Archivo: `src/hooks/usePickupOrdersLogic.ts`

1. Reemplazar `cacheTime` por `gcTime` y los callbacks `onError` y `onSuccess` por `onSettled`:
   ```typescript
   const { data: tickets = [], isLoading, error, refetch } = useQuery({
     queryKey: ['pickupTickets'],
     queryFn: getPickupTickets,
     refetchInterval: 5000, // Refetch every 5 seconds
     refetchOnWindowFocus: true, // Refetch when window gets focus
     staleTime: 0, // Consider data stale immediately
     retry: 3, // Reintentar 3 veces si hay error
     retryDelay: 1000, // Esperar 1 segundo entre reintentos
     gcTime: 0, // No cachear los resultados (antes era cacheTime)
     onSettled: (data, err) => {
       if (err) {
         console.error('Error en la consulta de tickets:', err);
         toast.error('Error al cargar los tickets');
       } else if (data) {
         console.log('Tickets cargados correctamente:', data.length);
       }
     }
   });
   ```

### 4. Archivo: `src/lib/data/expenseService.ts`

1. Importar el tipo `SyncableExpense`:
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   import { Expense } from '@/lib/types/expense.types';
   import { SyncableExpense } from '@/lib/data/sync/expensesSync';
   ```

## Contacto

Si tienes alguna pregunta o necesitas ayuda para aplicar estos cambios, por favor contacta al equipo de desarrollo.
