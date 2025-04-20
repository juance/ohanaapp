-- Función para actualizar automáticamente las visitas de los clientes
CREATE OR REPLACE FUNCTION update_customer_visits()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si el ticket no está cancelado
  IF NEW.status != 'canceled' AND NEW.status != 'cancelled' THEN
    -- Actualizar el contador de visitas del cliente
    UPDATE customers
    SET 
      valets_count = COALESCE(valets_count, 0) + COALESCE(NEW.valet_quantity, 1),
      last_visit = NOW()
    WHERE id = NEW.customer_id;
    
    -- Verificar si el cliente ha alcanzado 9 visitas para otorgar un valet gratis
    UPDATE customers
    SET free_valets = free_valets + 1
    WHERE id = NEW.customer_id
    AND (valets_count % 9) = 0
    AND valets_count > 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar las visitas de los clientes cuando se crea un ticket
DROP TRIGGER IF EXISTS update_customer_visits_trigger ON tickets;

CREATE TRIGGER update_customer_visits_trigger
AFTER INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_customer_visits();
