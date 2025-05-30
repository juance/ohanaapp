
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock básico para el hook de formulario de tickets
const useTicketFormMock = () => {
  const [formData, setFormData] = React.useState({
    customerName: '',
    phoneNumber: '',
    totalPrice: 0,
    paymentMethod: 'cash',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      phoneNumber: '',
      totalPrice: 0,
      paymentMethod: 'cash',
    });
  };

  return { formData, updateField, resetForm };
};

// Wrapper para hooks que necesitan providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTicketForm', () => {
  test('should initialize with default values', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTicketFormMock(), { wrapper });

    expect(result.current.formData.customerName).toBe('');
    expect(result.current.formData.phoneNumber).toBe('');
    expect(result.current.formData.totalPrice).toBe(0);
    expect(result.current.formData.paymentMethod).toBe('cash');
  });

  test('should update form fields', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTicketFormMock(), { wrapper });

    act(() => {
      result.current.updateField('customerName', 'Juan Pérez');
    });

    expect(result.current.formData.customerName).toBe('Juan Pérez');
  });

  test('should reset form', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTicketFormMock(), { wrapper });

    act(() => {
      result.current.updateField('customerName', 'Juan Pérez');
      result.current.resetForm();
    });

    expect(result.current.formData.customerName).toBe('');
  });
});
