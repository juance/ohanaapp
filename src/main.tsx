
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupGlobalErrorHandling, initErrorService } from './lib/errorService';
import { ErrorBoundary } from './components/ErrorBoundary';

// Configure the query client
const queryClient = new QueryClient();

// Initialize error service
initErrorService();

// Make sure the document is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element "root" not found');
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
});
