import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { Loading } from "@/components/ui/loading";
import { ConnectionStatusProvider } from '@/providers/ConnectionStatusProvider';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets'));
const PickupOrders = lazy(() => import('./pages/PickupOrders'));
const DeliveredOrders = lazy(() => import('./pages/DeliveredOrders'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Clients = lazy(() => import('./pages/Clients'));
const AdminTools = lazy(() => import('./pages/AdminTools'));
const Auth = lazy(() => import('./pages/Auth'));
const Metrics = lazy(() => import('./pages/Metrics'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Loyalty = lazy(() => import('./pages/Loyalty'));
const Feedback = lazy(() => import('./pages/Feedback'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Router configuration
const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Navigate to="/auth" replace />, // Redirige la ruta principal a /auth
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Tickets />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pickup",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <PickupOrders />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/delivered",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <DeliveredOrders />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/expenses",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Expenses />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Clients />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/loyalty",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Loyalty />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <Layout>
          <Inventory />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/metrics",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Layout>
          <Metrics />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Layout>
          <Analysis />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Layout>
          <AdminTools />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Layout>
          <Feedback />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
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
