
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
import PickupOrders from '@/pages/PickupOrders';
import DeliveredOrders from '@/pages/DeliveredOrders';
import Metrics from '@/pages/Metrics';
import TicketAnalysis from '@/pages/TicketAnalysis';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import QualityControl from '@/pages/QualityControl';
import PWAInstaller from '@/pages/PWAInstaller';
import CustomerPortal from '@/pages/CustomerPortal';
import ProtectedRoute from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ModernLayout><Index /></ModernLayout>
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Dashboard /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/executive-dashboard",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ModernLayout><ExecutiveDashboard /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Tickets /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Orders /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/pickup",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><PickupOrders /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/delivered",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><DeliveredOrders /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Clients /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ModernLayout><Admin /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/loyalty",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Loyalty /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/expenses",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Expenses /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Inventory /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Feedback /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Analytics /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/metrics",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><Metrics /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/ticket-analysis",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><TicketAnalysis /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/quality-control",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><QualityControl /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/pwa-installer",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'operator']}>
        <ModernLayout><PWAInstaller /></ModernLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/customer-portal",
    element: <ModernLayout><CustomerPortal /></ModernLayout>
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

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
