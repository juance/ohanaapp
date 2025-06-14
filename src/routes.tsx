
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Tickets from '@/pages/Tickets';
import PickupOrders from '@/pages/PickupOrders';
import Admin from '@/pages/Admin';
import Loyalty from '@/pages/Loyalty';
import PaymentTest from '@/pages/PaymentTest';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tickets" 
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/new-ticket" 
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/pickup-orders" 
        element={
          <ProtectedRoute>
            <PickupOrders />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/loyalty" 
        element={
          <ProtectedRoute>
            <Loyalty />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/payment-test" 
        element={
          <ProtectedRoute>
            <PaymentTest />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
