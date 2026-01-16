// Import necessary React hooks and components
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Login Component
 *
 * This component provides a user authentication interface with the following features:
 * - Username and password input fields
 * - Password visibility toggle
 * - Form validation
 * - Error handling and display
 * - Loading states
 * - Navigation to registration page
 * - Enter key support for form submission
 */
const Login = () => {
  const { login, isLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Basic validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const success = await login(username, password);

      if (success) {
        navigate("/dashboard");
      } else {
        // Error is set in the auth context, use it if available
        if (authError) {
          setError(authError);
        } else {
          setError("Invalid username or password");
        }
      }
    } catch (err) {
      setError(`Login failed: ${err instanceof Error ? err.message : "An unexpected error occurred"}`);
    }
  };


  /**
   * Navigate to registration page
   */
  const handleRegister = () => {
    navigate("/register");
  };


  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && username && password) {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Tab navigation between Login and Register */}
        <div className="flex mb-8">
          <button 
            className="text-green-500 border-b-2 border-green-500 pb-2 px-4 font-medium"
          >
            Login
          </button>
          <button 
            onClick={handleRegister}
            className="text-gray-400 pb-2 px-4 ml-4 font-medium hover:text-white transition-colors"
          >
            Register
          </button>
        </div>

        {/* Page heading */}
        <h1 className="text-2xl font-bold text-white mb-8">Welcome Back!</h1>

        {/* Error message display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username input field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password input field with visibility toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-10"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Login"}
          </Button>

          {/* Link to registration page */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleRegister}
                disabled={isLoading}
                className="text-green-500 hover:text-green-400 underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;