
import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import NotFound from '@/pages/NotFound';

// Import synchronously to avoid lazy loading issues
import Index from '@/pages/Index';

// Implement code splitting with lazy loading for each page
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tickets = lazy(() => import('@/pages/Tickets'));
const Metrics = lazy(() => import('@/pages/Metrics'));
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
  const location = useLocation();
  
  useEffect(() => {
    // Log current route for debugging
    console.log("Current location:", location.pathname);
    
    // Report to browser timing API for performance monitoring
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark('app-rendered');
    }
    
    // Hide loading indicator when app is loaded
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
    
    // Comprobar configuración de tema oscuro al iniciar la aplicación
    const savedSettings = localStorage.getItem('laundry_general_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.enableDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [location]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/tickets" element={
          <Suspense fallback={<LoadingFallback />}>
            <Tickets />
          </Suspense>
        } />
        <Route path="/metrics" element={
          <Suspense fallback={<LoadingFallback />}>
            <Metrics />
          </Suspense>
        } />
        <Route path="/pickup" element={
          <Suspense fallback={<LoadingFallback />}>
            <PickupOrders />
          </Suspense>
        } />
        <Route path="/delivered" element={
          <Suspense fallback={<LoadingFallback />}>
            <DeliveredOrders />
          </Suspense>
        } />
        <Route path="/inventory" element={
          <Suspense fallback={<LoadingFallback />}>
            <Inventory />
          </Suspense>
        } />
        <Route path="/expenses" element={
          <Suspense fallback={<LoadingFallback />}>
            <Expenses />
          </Suspense>
        } />
        <Route path="/feedback" element={
          <Suspense fallback={<LoadingFallback />}>
            <Feedback />
          </Suspense>
        } />
        <Route path="/administration" element={
          <Suspense fallback={<LoadingFallback />}>
            <Administration />
          </Suspense>
        } />
        <Route path="/clients" element={
          <Suspense fallback={<LoadingFallback />}>
            <Clients />
          </Suspense>
        } />
        <Route path="/loyalty" element={
          <Suspense fallback={<LoadingFallback />}>
            <Loyalty />
          </Suspense>
        } />
        <Route path="/analysis" element={
          <Suspense fallback={<LoadingFallback />}>
            <TicketAnalysis />
          </Suspense>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
