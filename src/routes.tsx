
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

// Admin placeholder pages
const AdminPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Administración</h1>
    <p>Esta página está en construcción.</p>
  </div>
);

const InventoryPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Inventario</h1>
    <p>Esta página está en construcción.</p>
  </div>
);

const MetricsPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Métricas</h1>
    <p>Esta página está en construcción.</p>
  </div>
);

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
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
