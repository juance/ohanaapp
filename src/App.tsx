
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loading } from '@/components/ui/loading';
import './App.css';

// Lazy loaded components
const Index = lazy(() => import('./pages/Index'));
const Clients = lazy(() => import('./pages/Clients'));
const Tickets = lazy(() => import('./pages/Tickets'));
const TicketMetrics = lazy(() => import('./pages/TicketMetrics'));
const TicketAnalysis = lazy(() => import('./pages/TicketAnalysis'));
const TrendAnalysis = lazy(() => import('./pages/TrendAnalysis'));
const PendingOrders = lazy(() => import('./pages/PendingOrders'));
const PickupOrders = lazy(() => import('./pages/PickupOrders'));
const DeliveredOrders = lazy(() => import('./pages/DeliveredOrders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Loyalty = lazy(() => import('./pages/Loyalty'));
const Administration = lazy(() => import('./pages/Administration'));
const Feedback = lazy(() => import('./pages/Feedback'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Expenses = lazy(() => import('./pages/Expenses'));

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loading size="lg" /></div>}>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/pickup-orders" element={<PickupOrders />} />
        <Route path="/delivered-orders" element={<DeliveredOrders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/admin" element={<Administration />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/metrics" element={<TicketMetrics />} />
        <Route path="/analysis" element={<TicketAnalysis />} />
        <Route path="/trends" element={<TrendAnalysis />} />
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
