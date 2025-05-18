
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Tickets from './pages/Tickets';
import Loyalty from './pages/Loyalty';
import Expenses from './pages/Expenses';
import PickupOrders from './pages/PickupOrders';
import Diagnostics from './pages/Diagnostics';
import SupabaseTest from './pages/SupabaseTest';
import { initSupabaseAuth } from './lib/auth/supabaseAuth';
import { initErrorService } from './lib/errorService';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './providers/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query/devtools';

// Create a client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize Supabase auth
    initSupabaseAuth();
    
    // Initialize error service
    initErrorService();
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/pickup" element={<PickupOrders />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/supabase-test" element={<SupabaseTest />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
