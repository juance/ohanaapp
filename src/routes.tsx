import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NewTicket from '@/pages/NewTicket';
import PickupOrders from '@/pages/PickupOrders';
import Admin from '@/pages/Admin';
import Loyalty from '@/pages/Loyalty';
import PaymentTest from '@/pages/PaymentTest';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/new-ticket" 
        element={
          <ProtectedRoute>
            <NewTicket />
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
      
      {/* Add new payment test route */}
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
