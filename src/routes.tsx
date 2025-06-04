
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ModernLayout } from '@/components/ModernLayout';
import Index from '@/pages/Index';
import Tickets from '@/pages/Tickets';
import Orders from '@/pages/Orders';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Admin from '@/pages/Admin';
import Auth from '@/pages/Auth';
import Loyalty from '@/pages/Loyalty';
import Expenses from '@/pages/Expenses';
import Inventory from '@/pages/Inventory';
import Feedback from '@/pages/Feedback';
import Analytics from '@/pages/Analytics';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ModernLayout><Index /></ModernLayout>,
    children: [
      {
        path: "tickets",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Tickets />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Orders />
          </ProtectedRoute>
        )
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "clients",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Clients />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        )
      },
      {
        path: "loyalty",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Loyalty />
          </ProtectedRoute>
        )
      },
      {
        path: "expenses",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Expenses />
          </ProtectedRoute>
        )
      },
      {
        path: "inventory",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Inventory />
          </ProtectedRoute>
        )
      },
      {
        path: "feedback",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Feedback />
          </ProtectedRoute>
        )
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Analytics />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
