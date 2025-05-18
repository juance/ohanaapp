
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionStatusProvider } from './providers/ConnectionStatusProvider';
import { AuthProvider } from './contexts/AuthContext';

// Create a new QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConnectionStatusProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </ConnectionStatusProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
