
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './providers/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupGlobalErrorHandling, initErrorService } from './lib/errorService'
import { ErrorBoundary } from './components/ErrorBoundary'

// Configuración del cliente de consulta
const queryClient = new QueryClient()

// Inicializar servicio de errores
initErrorService();

// Crear el elemento raíz antes de renderizar
const rootElement = document.getElementById('root');

// Verificar que el elemento raíz existe
if (!rootElement) {
  console.error('No se pudo encontrar el elemento raíz "root"');
} else {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
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
}
