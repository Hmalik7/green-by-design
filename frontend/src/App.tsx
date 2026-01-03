import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/login";

import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard";
import { ModernLayout } from "./components/ModernLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <Routes>
          {/* Root route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard route - standalone with its own layout */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Protected routes inside layout */}
          <Route element={<ModernLayout> <Outlet /></ModernLayout>}>
            {/* Add more secured routes here */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
