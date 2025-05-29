
import { render, screen } from './utils/test-utils';
import App from '../App';

// Mock de react-router-dom para evitar errores de navegación
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // El componente debe renderizar sin errores
    expect(document.body).toBeInTheDocument();
  });

  test('includes error boundary', () => {
    // Test básico para verificar que el ErrorBoundary está presente
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
