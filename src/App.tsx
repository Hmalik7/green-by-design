import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate,} from "react-router-dom";
import Login from "./pages/login";
import Index from "./pages/Index";

import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from '@/pages/ProtectedLayout';
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ModernLayout } from "./components/ModernLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Index route */}
          {/* Protected routes inside layout */}
          <Route element={<ModernLayout> <Outlet /></ModernLayout>}>
            <Route path="/dashboard" element={<Index />} />
            {/* Add more secured routes here */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
