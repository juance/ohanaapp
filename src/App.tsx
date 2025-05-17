import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Clients from './pages/Clients';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TicketDetails from './pages/TicketDetails';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import TicketMetrics from './pages/TicketMetrics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/users/edit/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/metrics" element={<TicketMetrics />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
