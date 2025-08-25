import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginDemo } from "./components/LoginDemo";
import { SignupDemo } from "./components/SignupDemo";
import { SaathiPage } from "./components/SaathiPage";
import HeroDemo from "./pages/HeroDemo";
import CallGenie from './pages/CallGenie';
import MyNumber from './pages/MyNumber';
import { DashboardWrapper } from './components/DashboardWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Payment } from './pages/Payment';
import { Contact } from './pages/Contact';

import AdminContactMessages from './pages/AdminContactMessages';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginDemo />} />
            <Route path="/signup" element={<SignupDemo />} />
            <Route path="/saathi" element={<SaathiPage />} />
            <Route path="/hero-demo" element={<HeroDemo />} />
            <Route path="/call-genie" element={<CallGenie />} />
            <Route path="/my-number" element={<MyNumber />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/messages" element={<AdminContactMessages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
