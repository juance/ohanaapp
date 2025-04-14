# Estructura de la Base de Datos

Este documento describe la estructura de la base de datos utilizada por la aplicación Ohana Laundry.

## Tablas Principales

### tickets

Almacena información sobre los tickets de lavandería.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único del ticket (clave primaria) |
| ticket_number | text | Número de ticket formateado (ej. 00000001) |
| customer_id | uuid | ID del cliente asociado (clave foránea a customers.id) |
| total | numeric | Precio total del ticket |
| payment_method | text | Método de pago (cash, card, transfer) |
| status | text | Estado del ticket (pending, processing, ready, delivered) |
| date | timestamp with time zone | Fecha del ticket |
| is_paid | boolean | Indica si el ticket está pagado |
| is_canceled | boolean | Indica si el ticket está cancelado |
| valet_quantity | integer | Cantidad de valets en el ticket |
| created_at | timestamp with time zone | Fecha de creación del registro |
| updated_at | timestamp with time zone | Fecha de última actualización |
| basket_ticket_number | text | Número de ticket de canasta |
| delivered_date | timestamp with time zone | Fecha de entrega del ticket |

### customers

Almacena información sobre los clientes.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único del cliente (clave primaria) |
| name | text | Nombre del cliente |
| phone | text | Número de teléfono del cliente |
| loyalty_points | integer | Puntos de fidelidad acumulados |
| valets_count | integer | Cantidad de valets acumulados |
| free_valets | integer | Cantidad de valets gratuitos disponibles |
| created_at | timestamp with time zone | Fecha de creación del registro |
| updated_at | timestamp with time zone | Fecha de última actualización |

### dry_cleaning_items

Almacena los servicios de lavado en seco asociados a un ticket.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único del ítem (clave primaria) |
| ticket_id | uuid | ID del ticket asociado (clave foránea a tickets.id) |
| name | text | Nombre del servicio |
| price | numeric | Precio unitario del servicio |
| quantity | integer | Cantidad de ítems |
| created_at | timestamp with time zone | Fecha de creación del registro |

### ticket_laundry_options

Almacena las opciones de lavandería seleccionadas para un ticket.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único de la opción (clave primaria) |
| ticket_id | uuid | ID del ticket asociado (clave foránea a tickets.id) |
| option_type | text | Tipo de opción seleccionada |
| created_at | timestamp with time zone | Fecha de creación del registro |

### ticket_sequence

Almacena la secuencia para generar números de ticket.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | integer | Identificador único de la secuencia (clave primaria) |
| last_number | integer | Último número de ticket generado |

## Tablas Secundarias

### users

Almacena información sobre los usuarios del sistema.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único del usuario (clave primaria) |
| name | text | Nombre del usuario |
| email | text | Correo electrónico del usuario |
| phone_number | text | Número de teléfono del usuario |
| password | text | Contraseña del usuario (hash) |
| role | text | Rol del usuario (admin, operator, client) |
| created_at | timestamp with time zone | Fecha de creación del registro |

### expenses

Almacena información sobre los gastos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | Identificador único del gasto (clave primaria) |
| description | text | Descripción del gasto |
| amount | numeric | Monto del gasto |
| date | timestamp with time zone | Fecha del gasto |
| category | text | Categoría del gasto |
| created_at | timestamp with time zone | Fecha de creación del registro |

## Relaciones

- **tickets.customer_id** → **customers.id**: Relación entre tickets y clientes.
- **dry_cleaning_items.ticket_id** → **tickets.id**: Relación entre ítems de lavado en seco y tickets.
- **ticket_laundry_options.ticket_id** → **tickets.id**: Relación entre opciones de lavandería y tickets.

## Funciones de Base de Datos

### get_next_ticket_number()

Genera el siguiente número de ticket incrementando el valor en la tabla `ticket_sequence`.

**Retorno**: TEXT - Número de ticket formateado con ceros a la izquierda (8 dígitos).

### reset_ticket_sequence()

Reinicia la secuencia de números de ticket a 0.

**Retorno**: VOID

## Estados de Tickets

Los tickets pueden tener los siguientes estados:

1. **pending**: El ticket ha sido creado pero aún no se ha comenzado a procesar.
2. **processing**: El ticket está siendo procesado (lavado, planchado, etc.).
3. **ready**: El ticket está listo para ser recogido por el cliente.
4. **delivered**: El ticket ha sido entregado al cliente.

## Notas Importantes

- Los tickets recién creados tienen el estado `ready` por defecto para que aparezcan inmediatamente en la sección "Pedidos Listos para Retirar".
- La tabla `ticket_sequence` debe tener siempre un registro con `id = 1` para que la función `get_next_ticket_number()` funcione correctamente.
- Los servicios de lavado en seco se almacenan en la tabla `dry_cleaning_items`, no en `ticket_services`.
- Las opciones de lavandería se almacenan en la tabla `ticket_laundry_options`, no en `ticket_options`.
