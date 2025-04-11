
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loading } from '@/components/ui/loading';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

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
const UserTickets = lazy(() => import('@/pages/UserTickets'));
const Auth = lazy(() => import('@/pages/Auth'));

// Loading fallback with optimized rendering
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading className="scale-150" />
    <p className="text-gray-600 ml-4">Cargando...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin only routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/administration" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Administration />
            </ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TicketAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Feedback />
            </ProtectedRoute>
          } />
          
          {/* Admin and operator routes */}
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
          <Route path="/delivered" element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <DeliveredOrders />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/loyalty" element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <Loyalty />
            </ProtectedRoute>
          } />
          
          {/* All authenticated users */}
          <Route path="/user-tickets" element={
            <ProtectedRoute allowedRoles={['admin', 'operator', 'client']}>
              <UserTickets />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
