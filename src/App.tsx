import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate,} from "react-router-dom";
import Login from "./pages/login";
import Index from "./pages/Index";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from '@/pages/ProtectedLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with shared layout */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route path="dashboard" element={<Index />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
