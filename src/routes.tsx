
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ModernLayout from '@/components/ModernLayout';
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
    element: <ModernLayout />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "tickets",
        element: <ProtectedRoute><Tickets /></ProtectedRoute>
      },
      {
        path: "orders",
        element: <ProtectedRoute><Orders /></ProtectedRoute>
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: "clients",
        element: <ProtectedRoute><Clients /></ProtectedRoute>
      },
      {
        path: "admin",
        element: <ProtectedRoute><Admin /></ProtectedRoute>
      },
      {
        path: "loyalty",
        element: <ProtectedRoute><Loyalty /></ProtectedRoute>
      },
      {
        path: "expenses",
        element: <ProtectedRoute><Expenses /></ProtectedRoute>
      },
      {
        path: "inventory",
        element: <ProtectedRoute><Inventory /></ProtectedRoute>
      },
      {
        path: "feedback",
        element: <ProtectedRoute><Feedback /></ProtectedRoute>
      },
      {
        path: "analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>
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
