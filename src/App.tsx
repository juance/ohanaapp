
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConnectionStatusProvider } from '@/providers/ConnectionStatusProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRoutes from './routes';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConnectionStatusProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
              <Toaster />
            </div>
          </ConnectionStatusProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
