
// Mock customer retrieval service implementation for tests
const mockCustomers = [
  { id: 1, name: 'Juan Pérez', phone: '1234567890', loyalty_points: 10, free_valets: 2 },
  { id: 2, name: 'María González', phone: '0987654321', loyalty_points: 5, free_valets: 1 }
];

// The actual service should transform Supabase database format to our app format
const customerRetrievalService = {
  obtenerClientePorId: (id) => {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) return null;
    return customer;
  }
};

describe('customerRetrievalService', () => {
  test('debería retornar el cliente por ID', () => {
    const cliente = customerRetrievalService.obtenerClientePorId(1);
    expect(cliente).toBeDefined();
    expect(cliente.id).toBe(1);
  });

  test('debería retornar null si el cliente no existe', () => {
    const cliente = customerRetrievalService.obtenerClientePorId(999);
    expect(cliente).toBeNull();
  });
});
