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
            <Route path="/dashboard" element={<Index />} />
            <Route path="/login" element={<LoginDemo />} />
            <Route path="/signup" element={<SignupDemo />} />
            <Route path="/saathi" element={<SaathiPage />} />
            <Route path="/hero-demo" element={<HeroDemo />} />
            <Route path="/call-genie" element={<CallGenie />} />
            <Route path="/my-number" element={<MyNumber />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
