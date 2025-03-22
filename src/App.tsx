
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Clients from './pages/Clients';
import Inventory from './pages/Inventory';
import PickupOrders from './pages/PickupOrders';
import DeliveredOrders from './pages/DeliveredOrders';
import TicketAnalysis from './pages/TicketAnalysis';
import Metrics from './pages/Metrics';
import Expenses from './pages/Expenses';
import Feedback from './pages/Feedback';
import Administration from './pages/Administration';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/pickup-orders" element={<PickupOrders />} />
          <Route path="/delivered-orders" element={<DeliveredOrders />} />
          <Route path="/ticket-analysis" element={<TicketAnalysis />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
