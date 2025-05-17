
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Clients from './pages/Clients';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TicketMetrics from './pages/TicketMetrics';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import PendingOrders from './pages/PendingOrders';
import DeliveredOrders from './pages/DeliveredOrders';
import Loyalty from './pages/Loyalty';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Administration from './pages/Administration';
import Feedback from './pages/Feedback';
import UserTickets from './pages/UserTickets';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager', 'operator']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager', 'operator']}>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager', 'operator']}>
              <Layout>
                <Clients />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/metrics" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Layout>
                <TicketMetrics />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pending-orders" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager', 'operator']}>
              <Layout>
                <PendingOrders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/delivered-orders" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager', 'operator']}>
              <Layout>
                <DeliveredOrders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/loyalty" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'manager']}>
              <Layout>
                <Loyalty />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/administration" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Administration />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Layout>
                <Feedback />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/user-tickets" element={<UserTickets />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
