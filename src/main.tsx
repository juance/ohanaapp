
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';
import { setupGlobalErrorHandling } from './lib/errorService.ts';

// Create a client with optimized settings for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
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

// Initialize global error handling system
setupGlobalErrorHandling();

// Create the root first, and then render to it - this ensures React context is properly established
const root = createRoot(rootElement);

// Render the app using strict mode to catch potential issues
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const loadTime = Math.round(performance.now() - startTime);
console.log(`Application rendered in ${loadTime}ms`);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
