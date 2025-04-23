
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './providers/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupGlobalErrorHandling, initErrorService } from './lib/errorService'
import { ErrorBoundary } from './components/ErrorBoundary'

// Configuración del cliente de consulta
const queryClient = new QueryClient()

// Inicializar servicio de errores
initErrorService();

// Componente raíz para envolver la aplicación con proveedores
const Root = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
