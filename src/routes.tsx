
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import SupabaseTest from './pages/SupabaseTest';
import DeliveredOrders from './pages/DeliveredOrders';
import Clients from './pages/Clients';
import Feedback from './pages/Feedback';
import Analysis from './pages/Analysis';
import NotFound from './pages/NotFound';
import Expenses from './pages/Expenses';
import Metrics from './pages/Metrics';
import Administration from './pages/Administration';
import Inventory from './pages/Inventory';
import Loyalty from './pages/Loyalty';
import Tickets from './pages/Tickets';
import PickupOrders from './pages/PickupOrders';
import Auth from './pages/Auth';
import UserTickets from './pages/UserTickets';
import AdminTools from './pages/AdminTools';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="/delivered" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <DeliveredOrders />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Feedback />
        </ProtectedRoute>
      } />
      <Route path="/analysis" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Analysis />
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Expenses />
        </ProtectedRoute>
      } />
      <Route path="/metrics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Metrics />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Administration />
        </ProtectedRoute>
      } />
      <Route path="/admin/tools" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminTools />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Inventory />
        </ProtectedRoute>
      } />
      <Route path="/loyalty" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Loyalty />
        </ProtectedRoute>
      } />
      <Route path="/tickets" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <Tickets />
        </ProtectedRoute>
      } />
      <Route path="/pickup" element={
        <ProtectedRoute allowedRoles={['admin', 'operator']}>
          <PickupOrders />
        </ProtectedRoute>
      } />
      <Route path="/auth" element={<Auth />} />
      <Route path="/user-tickets" element={
        <ProtectedRoute allowedRoles={['admin', 'operator', 'client']}>
          <UserTickets />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
