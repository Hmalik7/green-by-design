import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModernLayout } from "@/components/ModernLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { useState } from "react";

const queryClient = new QueryClient();


const App = () => {
  const [registered, setRegistered] = useState(false);

  // Handler to be passed to Register page
  const handleRegistered = () => setRegistered(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Only show Register page until registered, then show Index with ModernLayout */}
          {!registered ? (
            <Register onRegistered={handleRegistered} />
          ) : (
            <ModernLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ModernLayout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
