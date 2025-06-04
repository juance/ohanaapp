

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
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Tickets />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Orders />
          </ProtectedRoute>
        )
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "clients",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
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
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Loyalty />
          </ProtectedRoute>
        )
      },
      {
        path: "expenses",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Expenses />
          </ProtectedRoute>
        )
      },
      {
        path: "inventory",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Inventory />
          </ProtectedRoute>
        )
      },
      {
        path: "feedback",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
            <Feedback />
          </ProtectedRoute>
        )
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'operator']}>
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

