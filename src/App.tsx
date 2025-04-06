
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loading } from '@/components/ui/loading';
import NotFound from '@/pages/NotFound';

// Implement code splitting with lazy loading for each page
const Index = lazy(() => import('@/pages/Index'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tickets = lazy(() => import('@/pages/Tickets'));
const PickupOrders = lazy(() => import('@/pages/PickupOrders'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Expenses = lazy(() => import('@/pages/Expenses'));
const Feedback = lazy(() => import('@/pages/Feedback'));
const Administration = lazy(() => import('@/pages/Administration'));
const Clients = lazy(() => import('@/pages/Clients'));
const Loyalty = lazy(() => import('@/pages/Loyalty'));
const DeliveredOrders = lazy(() => import('@/pages/DeliveredOrders'));
const TicketAnalysis = lazy(() => import('@/pages/TicketAnalysis'));

// Loading fallback with optimized rendering
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading className="scale-150" />
    <p className="text-gray-600 ml-4">Cargando...</p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/pickup" element={<PickupOrders />} />
        <Route path="/delivered" element={<DeliveredOrders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/administration" element={<Administration />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/analysis" element={<TicketAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
