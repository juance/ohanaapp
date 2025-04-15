const customerRetrievalService = require('./customerRetrievalService');

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