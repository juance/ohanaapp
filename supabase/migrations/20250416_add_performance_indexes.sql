-- Añadir índices adicionales para mejorar el rendimiento

-- Índice para búsquedas por status y is_canceled (muy usadas en la aplicación)
CREATE INDEX IF NOT EXISTS idx_tickets_status_is_canceled ON public.tickets(status, is_canceled);

-- Índice para búsquedas por fecha de creación (usado en ordenamientos)
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at);

-- Índice para búsquedas por fecha de entrega (usado en filtros)
CREATE INDEX IF NOT EXISTS idx_tickets_delivered_date ON public.tickets(delivered_date);

-- Índice para búsquedas por fecha (usado en filtros de rango)
CREATE INDEX IF NOT EXISTS idx_tickets_date ON public.tickets(date);

-- Índice para búsquedas por método de pago
CREATE INDEX IF NOT EXISTS idx_tickets_payment_method ON public.tickets(payment_method);

-- Índice para búsquedas por is_paid
CREATE INDEX IF NOT EXISTS idx_tickets_is_paid ON public.tickets(is_paid);

-- Verificar que los índices se han creado correctamente
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename = 'tickets'
ORDER BY
    indexname;
