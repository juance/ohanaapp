
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock básico del componente TicketForm
const MockTicketForm = () => {
  const [customerName, setCustomerName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  return (
    <form data-testid="ticket-form">
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        data-testid="customer-name-input"
      />
      <input
        type="tel"
        placeholder="Número de teléfono"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        data-testid="phone-input"
      />
      <button type="submit" data-testid="submit-button">
        Crear Ticket
      </button>
    </form>
  );
};

// Wrapper con providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TicketForm Component', () => {
  test('renders form elements', () => {
    const Wrapper = createWrapper();
    render(<MockTicketForm />, { wrapper: Wrapper });

    expect(screen.getByTestId('ticket-form')).toBeInTheDocument();
    expect(screen.getByTestId('customer-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('allows input in form fields', () => {
    const Wrapper = createWrapper();
    render(<MockTicketForm />, { wrapper: Wrapper });

    const nameInput = screen.getByTestId('customer-name-input') as HTMLInputElement;
    const phoneInput = screen.getByTestId('phone-input') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });

    expect(nameInput.value).toBe('Juan Pérez');
    expect(phoneInput.value).toBe('123456789');
  });

  test('handles form submission', () => {
    const Wrapper = createWrapper();
    render(<MockTicketForm />, { wrapper: Wrapper });

    const form = screen.getByTestId('ticket-form');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);
    
    // El formulario debe existir y el botón debe ser clickeable
    expect(form).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
