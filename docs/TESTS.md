
# Plan de Pruebas - OhanaApp

## 1. Estrategia de Pruebas

### 1.1 Tipos de Pruebas

- **Pruebas Unitarias**: Para funciones y servicios aislados
- **Pruebas de Componentes**: Para componentes de React
- **Pruebas de Integración**: Para interacciones entre módulos
- **Pruebas E2E**: Para flujos de usuario completos

### 1.2 Herramientas

- **Jest**: Framework principal de pruebas
- **React Testing Library**: Para pruebas de componentes React
- **MSW (Mock Service Worker)**: Para simular respuestas de API
- **Cypress**: Para pruebas E2E

## 2. Pruebas Unitarias

### 2.1 Servicios de Datos

```javascript
// Ejemplo de prueba para clientService.ts
import { getClientVisitFrequency } from '@/lib/data/clientService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

describe('clientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getClientVisitFrequency debería formatear correctamente los datos de clientes', async () => {
    // Mock de la respuesta de Supabase
    const mockData = [
      {
        id: '123',
        name: 'Cliente Test',
        phone: '1234567890',
        valets_count: 5,
        last_visit: '2023-01-01T12:00:00Z',
        free_valets: 1,
        loyalty_points: 50
      }
    ];
    
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      })
    });

    const result = await getClientVisitFrequency();
    
    expect(result).toHaveLength(1);
    expect(result[0].clientName).toBe('Cliente Test');
    expect(result[0].visitFrequency).toBe('Ocasional');
  });
});
```

### 2.2 Utilidades

```javascript
// Ejemplo de prueba para ticketFormatters.ts
import { formatTicketDate, formatTicketServices } from '@/hooks/pickup/utils/ticketFormatters';

describe('ticketFormatters', () => {
  test('formatTicketDate debería formatear correctamente las fechas', () => {
    const date = new Date(2023, 0, 15, 14, 30).toISOString();
    expect(formatTicketDate(date)).toBe('15/01/2023 14:30');
    expect(formatTicketDate(undefined)).toBe('N/A');
  });

  test('formatTicketServices debería formatear correctamente los servicios', () => {
    const services = [
      { id: '1', name: 'Lavado', price: 100, quantity: 2 },
      { id: '2', name: 'Planchado', price: 50, quantity: 1 }
    ];
    
    expect(formatTicketServices(services)).toBe(
      'Lavado (2) - $100, Planchado (1) - $50'
    );
    
    expect(formatTicketServices([])).toBe('No hay servicios registrados');
    expect(formatTicketServices(undefined)).toBe('No hay servicios registrados');
  });
});
```

## 3. Pruebas de Componentes

### 3.1 Componentes UI Básicos

```javascript
// Ejemplo de prueba para PriceDisplay.tsx
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '@/components/ticket/PriceDisplay';

describe('PriceDisplay', () => {
  test('muestra el precio formateado correctamente', () => {
    render(<PriceDisplay totalPrice={1500} />);
    expect(screen.getByText('$1,500')).toBeInTheDocument();
  });
});
```

### 3.2 Componentes con Lógica

```javascript
// Ejemplo de prueba para CustomerForm.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '@/components/ticket/CustomerForm';

describe('CustomerForm', () => {
  const setCustomerNameMock = jest.fn();
  const setPhoneNumberMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('actualiza correctamente el nombre del cliente', () => {
    render(
      <CustomerForm
        customerName=""
        setCustomerName={setCustomerNameMock}
        phoneNumber=""
        setPhoneNumber={setPhoneNumberMock}
      />
    );
    
    const input = screen.getByLabelText('Nombre del Cliente');
    fireEvent.change(input, { target: { value: 'Juan Pérez' } });
    
    expect(setCustomerNameMock).toHaveBeenCalledWith('Juan Pérez');
  });
});
```

## 4. Pruebas de Integración

### 4.1 Flujos de Datos

```javascript
// Ejemplo de prueba de integración para sincronización
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { syncTickets } from '@/lib/data/sync/ticketsSync';
import { syncClients } from '@/lib/data/sync/clientsSync';
import { syncExpenses } from '@/lib/data/expenseService';

jest.mock('@/lib/data/sync/ticketsSync');
jest.mock('@/lib/data/sync/clientsSync');
jest.mock('@/lib/data/expenseService');

describe('comprehensiveSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de las funciones de sincronización
    syncTickets.mockResolvedValue({ added: 5, updated: 2, failed: 0 });
    syncClients.mockResolvedValue({ added: 3, updated: 1, failed: 0 });
    syncExpenses.mockResolvedValue({ added: 2, updated: 0, failed: 1 });
  });

  test('syncAllData debería coordinar todas las sincronizaciones', async () => {
    const onProgressMock = jest.fn();
    
    const result = await syncAllData({ onProgress: onProgressMock });
    
    expect(syncTickets).toHaveBeenCalled();
    expect(syncClients).toHaveBeenCalled();
    expect(syncExpenses).toHaveBeenCalled();
    
    expect(result.success).toBe(true);
    expect(result.tickets.added).toBe(5);
    expect(result.clients.added).toBe(3);
    expect(result.expenses.added).toBe(2);
    
    expect(onProgressMock).toHaveBeenCalledWith(0);
    expect(onProgressMock).toHaveBeenCalledWith(25);
    expect(onProgressMock).toHaveBeenCalledWith(50);
    expect(onProgressMock).toHaveBeenCalledWith(75);
    expect(onProgressMock).toHaveBeenCalledWith(100);
  });
});
```

### 4.2 Autenticación

```javascript
// Ejemplo de prueba de integración para autenticación
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '@/components/AuthForm';
import { login } from '@/lib/auth';

jest.mock('@/lib/auth');

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('proceso de login completo', async () => {
    login.mockResolvedValue({
      id: '123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    });
    
    render(<AuthForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), {
      target: { value: 'admin@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByText(/iniciar sesión/i));
    
    expect(login).toHaveBeenCalledWith('admin@example.com', 'password');
    
    await waitFor(() => {
      expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument();
    });
  });
});
```

## 5. Pruebas E2E (Cypress)

```javascript
// Ejemplo de prueba e2e para creación de ticket
describe('Creación de ticket', () => {
  beforeEach(() => {
    cy.login('operator@example.com', 'password');
    cy.visit('/tickets/new');
  });

  it('debería crear un nuevo ticket de valet', () => {
    cy.get('input[name="customerName"]').type('Cliente de Prueba');
    cy.get('input[name="phoneNumber"]').type('1234567890');
    
    cy.get('[data-tab="valet"]').click();
    cy.get('input[name="valetQuantity"]').clear().type('2');
    
    cy.get('select[name="paymentMethod"]').select('cash');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('Ticket generado con éxito').should('be.visible');
    cy.contains('$12,000').should('be.visible');
  });
});

// Ejemplo de prueba e2e para recoger un pedido
describe('Proceso de recogida', () => {
  beforeEach(() => {
    cy.login('operator@example.com', 'password');
    cy.visit('/pickup');
  });

  it('debería marcar un ticket como entregado', () => {
    cy.get('input[placeholder="Buscar por número o nombre"]').type('T-001');
    cy.get('[data-testid="ticket-T-001"]').click();
    
    cy.contains('Marcar como entregado').click();
    cy.get('[data-testid="confirm-pickup"]').click();
    
    cy.contains('Ticket entregado con éxito').should('be.visible');
    cy.get('[data-testid="ticket-status"]').should('contain', 'Entregado');
  });
});
```

## 6. Infraestructura de Pruebas

### 6.1 Configuración de Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': 'identity-obj-proxy'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
};
```

### 6.2 Setup de Pruebas

```javascript
// setupTests.js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Establecer manejadores de MSW antes de las pruebas
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
```

## 7. Implementación y Automatización

- Integrar pruebas unitarias y de componentes en el proceso de CI/CD
- Configurar GitHub Actions para ejecutar pruebas automáticamente en cada PR
- Establecer umbrales mínimos de cobertura (ej: 70%)
- Ejecutar pruebas E2E en entorno de staging antes de despliegue a producción

## 8. Casos de Prueba Prioritarios

1. Creación y gestión de tickets
2. Proceso de autenticación y autorización
3. Sincronización de datos online/offline
4. Flujos de atención al cliente (creación, entrega)
5. Cálculo de métricas y reportes

La implementación de estas pruebas garantizará la calidad del código y reducirá la introducción de regresiones durante el desarrollo continuo.
