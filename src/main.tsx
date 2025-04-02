
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';
import { setupGlobalErrorHandling } from './lib/errorService.ts';
import { Toaster } from './components/ui/toaster.tsx';

// Create a client with optimized settings for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    },
  },
});

// Find the root element with better error handling
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Fatal: Root element not found in the DOM");
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error al iniciar la aplicación</h1><p>No se encontró el elemento raíz.</p></div>';
  throw new Error('Root element not found');
}

// Performance timing
const startTime = performance.now();

// Inicializar sistema de captura de errores global
setupGlobalErrorHandling();

// Create and render the root
try {
  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <App />
              <Toaster />
            </ErrorBoundary>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  
  const loadTime = Math.round(performance.now() - startTime);
  console.log(`Application rendered in ${loadTime}ms`);
} catch (error) {
  console.error("Fatal error during application rendering:", error);
  // Show error in the UI
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Error al iniciar la aplicación</h1>
      <p>Por favor, recarga la página o intenta más tarde.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
        Recargar
      </button>
    </div>
  `;
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
