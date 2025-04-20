-- Función para recalcular el conteo de visitas para todos los clientes
CREATE OR REPLACE FUNCTION recalculate_customer_visits()
RETURNS VOID AS $$
BEGIN
  -- Actualizar el contador de visitas para todos los clientes
  UPDATE customers c
  SET valets_count = (
    SELECT COALESCE(SUM(COALESCE(t.valet_quantity, 1)), 0)
    FROM tickets t
    WHERE t.customer_id = c.id
    AND t.status != 'canceled'
    AND t.status != 'cancelled'
  );
  
  -- Actualizar la fecha de la última visita
  UPDATE customers c
  SET last_visit = (
    SELECT MAX(t.created_at)
    FROM tickets t
    WHERE t.customer_id = c.id
    AND t.status != 'canceled'
    AND t.status != 'cancelled'
  );
  
  -- Recalcular los valets gratis basado en el conteo de visitas
  UPDATE customers
  SET free_valets = FLOOR(valets_count / 9);
END;
$$ LANGUAGE plpgsql;

-- Ejecutar la función para recalcular el conteo de visitas para todos los clientes
SELECT recalculate_customer_visits();
