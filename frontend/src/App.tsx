import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Routes, Route, Outlet, Navigate,} from "react-router-dom";
import Login from "./pages/login";

import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ModernLayout } from "./components/ModernLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <Routes>
          {/* Root route - redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Index route */}
          {/* Protected routes inside layout */}
          <Route element={<ModernLayout> <Outlet /></ModernLayout>}>
            <Route path="/dashboard" element={<NotFound />} />
            {/* Add more secured routes here */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
