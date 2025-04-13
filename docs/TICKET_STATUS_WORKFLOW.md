# Flujo de Estados de Tickets

Este documento describe el flujo de estados de tickets en la aplicación Lavandería Ohana.

## Estados de Tickets

Los tickets en la aplicación pueden tener uno de los siguientes estados:

| Estado | Código | Descripción |
|--------|--------|-------------|
| Pendiente | `pending` | El ticket ha sido creado pero aún no se ha comenzado a procesar |
| En Proceso | `processing` | El ticket está siendo procesado (lavado, secado, etc.) |
| Listo | `ready` | El ticket está listo para ser recogido por el cliente |
| Entregado | `delivered` | El ticket ha sido entregado al cliente |

## Estados Simplificados

Para simplificar la interfaz de usuario y la lógica de negocio, agrupamos los estados en dos categorías principales:

| Estado Simplificado | Estados Incluidos | Descripción |
|---------------------|-------------------|-------------|
| PENDIENTE | `pending`, `processing`, `ready` | Tickets que aún no han sido entregados al cliente |
| ENTREGADO | `delivered` | Tickets que ya han sido entregados al cliente |

## Flujo de Trabajo Típico

El flujo de trabajo típico para un ticket es el siguiente:

1. **Creación del Ticket**: Cuando se crea un nuevo ticket, se le asigna automáticamente el estado `ready` (listo para recoger).

2. **Entrega al Cliente**: Cuando el cliente recoge su pedido, el ticket se marca como `delivered` (entregado).

## Visualización en la Aplicación

Los tickets se muestran en diferentes secciones de la aplicación según su estado:

- **Sección "Por Retirar"**: Muestra todos los tickets con estado `pending`, `processing` o `ready`.
- **Sección "Entregados"**: Muestra todos los tickets con estado `delivered`.

## Cancelación de Tickets

Un ticket puede ser cancelado en cualquier momento antes de ser entregado. Los tickets cancelados:

- No se eliminan de la base de datos
- Se marcan con `is_canceled = true`
- No aparecen en ninguna de las secciones por defecto

## Implementación Técnica

### Constantes de Estado

Los estados de tickets están definidos como constantes en `src/lib/constants/appConstants.ts`:

```typescript
export const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready', 
  DELIVERED: 'delivered'
} as const;
```

### Servicio de Estado de Tickets

El servicio de estado de tickets (`src/lib/ticket/ticketStatusService.ts`) proporciona funciones para:

- Mapear entre estados de base de datos y estados simplificados
- Verificar si un ticket está en un estado específico
- Obtener todos los estados de base de datos que corresponden a un estado simplificado
- Obtener nombres de visualización y clases CSS para los estados

### Consultas de Base de Datos

Al consultar tickets, siempre se debe:

1. Usar las constantes `TICKET_STATUS` para referirse a los estados
2. Incluir el filtro `is_canceled = false` para excluir tickets cancelados
3. Considerar usar el servicio de estado de tickets para obtener todos los estados correspondientes a un estado simplificado

## Mejores Prácticas

1. **Usar Constantes**: Siempre usar las constantes definidas en `TICKET_STATUS` en lugar de cadenas literales.

2. **Usar el Servicio de Estado**: Utilizar las funciones del servicio de estado de tickets para manejar estados.

3. **Filtrar Tickets Cancelados**: Siempre incluir el filtro `is_canceled = false` en las consultas.

4. **Agrupar Estados**: Para la interfaz de usuario, considerar agrupar los estados en las categorías simplificadas.

## Ejemplos de Código

### Obtener Tickets Pendientes

```typescript
import { getDatabaseStatuses } from '@/lib/ticket/ticketStatusService';

// Obtener todos los estados que corresponden a 'PENDING'
const pendingStatuses = getDatabaseStatuses('PENDING');

// Consultar tickets con esos estados
const { data: ticketsData } = await supabase
  .from('tickets')
  .select(selectQuery)
  .in('status', pendingStatuses)
  .eq('is_canceled', false);
```

### Verificar si un Ticket está Pendiente

```typescript
import { isPending } from '@/lib/ticket/ticketStatusService';

if (isPending(ticket.status)) {
  // El ticket está pendiente (no entregado)
}
```

### Marcar un Ticket como Entregado

```typescript
import { TICKET_STATUS } from '@/lib/constants/appConstants';

await supabase
  .from('tickets')
  .update({
    status: TICKET_STATUS.DELIVERED,
    delivered_date: new Date().toISOString()
  })
  .eq('id', ticketId);
```
