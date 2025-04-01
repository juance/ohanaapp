
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingState from "./components/dashboard/LoadingState";
import { Toaster } from "./components/ui/sonner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tickets = lazy(() => import("./pages/Tickets"));
const PickupOrders = lazy(() => import("./pages/PickupOrders"));
const DeliveredOrders = lazy(() => import("./pages/DeliveredOrders"));
const Inventory = lazy(() => import("./pages/Inventory"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Clients = lazy(() => import("./pages/Clients"));
const Reset = lazy(() => import("./pages/Reset"));

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when changing tabs
      retry: 1, // Limit retries on failure
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/orders/pickup" element={<PickupOrders />} />
          <Route path="/orders/delivered" element={<DeliveredOrders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
