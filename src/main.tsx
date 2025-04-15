
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ConnectionStatusProvider } from './providers/ConnectionStatusProvider';
import App from './App';
import './index.css';
import { setupGlobalErrorHandling, initErrorService } from './lib/errorService';

// Initialize error handling
setupGlobalErrorHandling();
initErrorService();

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConnectionStatusProvider>
          <App />
          <Toaster />
        </ConnectionStatusProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
