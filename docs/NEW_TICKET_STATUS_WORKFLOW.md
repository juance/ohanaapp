# Nuevo Flujo de Estados de Tickets

Este documento propone un nuevo flujo de estados de tickets para la aplicación Lavandería Ohana que refleja mejor el proceso de negocio real de una lavandería.

## Estados de Tickets

Los tickets en la aplicación pueden tener uno de los siguientes estados:

| Estado | Código | Descripción |
|--------|--------|-------------|
| Pendiente | `pending` | El ticket ha sido creado pero aún no se ha comenzado a procesar |
| En Proceso | `processing` | El ticket está siendo procesado (lavado, secado, etc.) |
| Listo | `ready` | El ticket está listo para ser recogido por el cliente |
| Entregado | `delivered` | El ticket ha sido entregado al cliente |

## Flujo de Trabajo Propuesto

El nuevo flujo de trabajo propuesto para un ticket es el siguiente:

1. **Creación del Ticket**: Cuando se crea un nuevo ticket, se le asigna el estado `pending` (pendiente).
   - Este estado indica que la ropa ha sido recibida pero aún no se ha comenzado a procesar.

2. **Inicio del Procesamiento**: Cuando el personal de la lavandería comienza a procesar la ropa, el ticket se marca como `processing` (en proceso).
   - Este estado indica que la ropa está siendo lavada, secada, planchada, etc.

3. **Finalización del Procesamiento**: Cuando la ropa está lista para ser recogida, el ticket se marca como `ready` (listo).
   - Este estado indica que el cliente puede venir a recoger su ropa.

4. **Entrega al Cliente**: Cuando el cliente recoge su pedido, el ticket se marca como `delivered` (entregado).
   - Este estado indica que el proceso ha sido completado.

## Comparación con el Flujo Actual

| Aspecto | Flujo Actual | Flujo Propuesto |
|---------|--------------|-----------------|
| Estado inicial | `ready` | `pending` |
| Transiciones | 1 (ready → delivered) | 3 (pending → processing → ready → delivered) |
| Reflejo del proceso real | Parcial | Completo |
| Información para el cliente | Limitada | Detallada |
| Información para la gestión | Limitada | Detallada |

## Beneficios del Nuevo Flujo

1. **Mayor Transparencia**: Los clientes pueden ver exactamente en qué etapa del proceso se encuentra su ropa.

2. **Mejor Gestión Interna**: El personal de la lavandería puede gestionar mejor su trabajo al tener una visión clara de qué tickets están en cada etapa.

3. **Estadísticas Más Detalladas**: Se pueden generar estadísticas más detalladas sobre el tiempo que toma cada etapa del proceso.

4. **Experiencia de Usuario Mejorada**: Los clientes tienen una mejor experiencia al recibir información más precisa sobre el estado de su pedido.

## Implementación Técnica

### Modificaciones Necesarias

1. **Creación de Tickets**: Modificar la función `createTicket` para asignar el estado `pending` en lugar de `ready`.

2. **Nuevas Funciones**: Crear funciones para cambiar el estado de un ticket:
   - `markTicketAsProcessing(ticketId: string): Promise<boolean>`
   - `markTicketAsReady(ticketId: string): Promise<boolean>`

3. **Interfaz de Usuario**: Actualizar la interfaz de usuario para mostrar y permitir cambios entre los diferentes estados.

4. **Consultas**: Actualizar las consultas para filtrar tickets según los nuevos estados.

### Compatibilidad con el Sistema Existente

El nuevo flujo de estados es compatible con el sistema de estados simplificados existente:

- Los estados `pending`, `processing` y `ready` seguirán mapeándose a `PENDING` en el sistema simplificado.
- El estado `delivered` seguirá mapeándose a `DELIVERED` en el sistema simplificado.

## Transición al Nuevo Flujo

Para facilitar la transición al nuevo flujo, se recomienda:

1. **Implementación Gradual**: Implementar el nuevo flujo en etapas, comenzando por la creación de tickets con estado `pending`.

2. **Capacitación del Personal**: Capacitar al personal sobre el nuevo flujo de estados y cómo utilizar la aplicación con los nuevos estados.

3. **Comunicación con los Clientes**: Informar a los clientes sobre los nuevos estados y cómo interpretar la información en la aplicación.

4. **Período de Prueba**: Establecer un período de prueba para evaluar la efectividad del nuevo flujo y realizar ajustes si es necesario.

## Conclusión

El nuevo flujo de estados propuesto refleja mejor el proceso de negocio real de una lavandería y proporciona beneficios significativos tanto para los clientes como para el personal. Se recomienda su implementación para mejorar la experiencia de usuario y la gestión interna de la lavandería.
