
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Loading from "@/components/Loading";
import { ConnectionStatusProvider } from '@/providers/ConnectionStatusProvider';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets'));
const PickupOrders = lazy(() => import('./pages/PickupOrders'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Clients = lazy(() => import('./pages/Clients'));
const AdminTools = lazy(() => import('./pages/AdminTools'));

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/tickets",
    element: <Tickets />,
  },
  {
    path: "/pickup",
    element: <PickupOrders />,
  },
  {
    path: "/expenses",
    element: <Expenses />,
  },
  {
    path: "/clients",
    element: <Clients />,
  },
  {
    path: "/admin",
    element: <AdminTools />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <ConnectionStatusProvider>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster />
        </ErrorBoundary>
      </ConnectionStatusProvider>
    </ThemeProvider>
  );
}

export default App;
