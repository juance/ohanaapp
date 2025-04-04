
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import PickupOrders from "./pages/PickupOrders";
import DeliveredOrders from "./pages/DeliveredOrders";
import Inventory from "./pages/Inventory";
import UserManagement from "./pages/UserManagement";
import Expenses from "./pages/Expenses";
import Clients from "./pages/Clients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/orders/pickup" element={<PickupOrders />} />
        <Route path="/orders/delivered" element={<DeliveredOrders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/clients" element={<Clients />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
