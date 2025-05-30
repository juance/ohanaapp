
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import { ModernLayout } from '@/components/ModernLayout';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Tickets = React.lazy(() => import('@/pages/Tickets'));
const Orders = React.lazy(() => import('@/pages/PendingOrders'));
const PickupOrders = React.lazy(() => import('@/pages/PickupOrders'));
const DeliveredOrders = React.lazy(() => import('@/pages/DeliveredOrders'));
const Clients = React.lazy(() => import('@/pages/Clients'));
const Analytics = React.lazy(() => import('@/pages/Analytics'));
const TrendAnalysis = React.lazy(() => import('@/pages/TrendAnalysis'));
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
const Index = React.lazy(() => import('@/pages/Index'));
const Inventory = React.lazy(() => import('@/pages/Inventory'));
const Loyalty = React.lazy(() => import('@/pages/Loyalty'));
const Expenses = React.lazy(() => import('@/pages/Expenses'));
const Feedback = React.lazy(() => import('@/pages/Feedback'));
const MetricsPage = React.lazy(() => import('@/pages/MetricsPage'));
const TicketAnalysis = React.lazy(() => import('@/pages/TicketAnalysis'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <ModernLayout>{children}</ModernLayout>;
};

// Auth Route Component
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={
          <AuthRoute>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <AuthForm />
            </div>
          </AuthRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/tickets" element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        
        <Route path="/pickup" element={
          <ProtectedRoute>
            <PickupOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/delivered" element={
          <ProtectedRoute>
            <DeliveredOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
        
        <Route path="/loyalty" element={
          <ProtectedRoute>
            <Loyalty />
          </ProtectedRoute>
        } />
        
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
        
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } />
        
        <Route path="/metrics" element={
          <ProtectedRoute>
            <MetricsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        
        <Route path="/analysis" element={
          <ProtectedRoute>
            <TrendAnalysis />
          </ProtectedRoute>
        } />
        
        <Route path="/ticket-analysis" element={
          <ProtectedRoute>
            <TicketAnalysis />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};
