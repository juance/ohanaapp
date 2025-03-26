
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Tickets from '@/pages/Tickets';
import Metrics from '@/pages/Metrics';
import PickupOrders from '@/pages/PickupOrders';
import Inventory from '@/pages/Inventory';
import Expenses from '@/pages/Expenses';
import Feedback from '@/pages/Feedback';
import Administration from '@/pages/Administration';
import Clients from '@/pages/Clients';
import Loyalty from '@/pages/Loyalty';
import DeliveredOrders from '@/pages/DeliveredOrders';
import TicketAnalysis from '@/pages/TicketAnalysis';
import NotFound from '@/pages/NotFound';
import './App.css';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("App mounted, available routes:");
    console.log("/ → Index");
    console.log("/dashboard → Dashboard");
    console.log("/tickets → Tickets");
    console.log("/metrics → Metrics");
    console.log("/pickup → PickupOrders");
    console.log("/delivered → DeliveredOrders");
    console.log("/inventory → Inventory");
    console.log("/expenses → Expenses");
    console.log("/feedback → Feedback");
    console.log("/administration → Administration");
    console.log("/clients → Clients");
    console.log("/loyalty → Loyalty");
    console.log("/analysis → TicketAnalysis");
    console.log("Current location:", location.pathname);
  }, [location]);
  
  console.log("App component rendering - checking routes");
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/metrics" element={<Metrics />} />
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
      <Toaster />
    </>
  );
}

export default App;
