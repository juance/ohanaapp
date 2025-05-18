
import React from 'react';
import { Route, Routes } from 'react-router-dom';

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
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="/delivered" element={<DeliveredOrders />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/metrics" element={<Metrics />} />
      <Route path="/admin" element={<Administration />} />
      <Route path="/admin/tools" element={<AdminTools />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/loyalty" element={<Loyalty />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/pickup" element={<PickupOrders />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/user-tickets" element={<UserTickets />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
