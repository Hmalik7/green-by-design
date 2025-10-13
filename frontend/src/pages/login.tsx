
// Import necessary React hooks and components
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "@/context/AuthContext";

import toast from 'react-hot-toast';

/**
 * Toast Component
 * Displays temporary notification messages with icons and auto-dismiss
 */
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // Auto-dismiss after 2 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  // Map toast types to their corresponding icon components
  const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    info: AlertCircle
  };

  const Icon = iconMap[type];

  return (
    <div className={`toast toast-${type}`}>
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button
        onClick={onClose}
        className="toast-close"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Login Component
 *
 * This component provides a user authentication interface with the following features:
 * - Email/username and password input fields
 * - Password visibility toggle
 * - Form validation
 * - Error handling and display
 * - Loading states
 * - Navigation to registration page
 * - Enter key support for form submission
 */
const Login = () => {
  const { login, isLoading, user, error: authError, clearError} = useAuth();

    // Local state management
  const [email, setEmail] = useState("");// Stores email/username input
  const [password, setPassword] = useState("");// Stores password input
  const [showPassword, setShowPassword] = useState(false);// Controls password visibility
  const [error, setError] = useState<string | null>(null); // Local error state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null); // Toast notification state

  // Hook for programmatic navigation between routes
  const navigate = useNavigate();


  /**
   * Display a toast notification
   * Replaces console.log calls with user-visible notifications
   *
   * @param message - The message to display
   * @param type - Type of toast: 'success', 'error', or 'info'
   */
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    console.log(message);
    console.log(type);
    setToast({ message, type });
  };

  /**
   * Close the current toast notification
   */
  const closeToast = () => {
    setToast(null);
  };

  /**
   * Effect: Sync AuthContext errors with toast notifications
   * Shows toast when AuthContext sets an error
   */
  useEffect(() => {
    if (authError) {
      showToast(getFormattedError(authError), 'error');
    }
  }, [authError]);

  /**
   * Effect: Clear errors when user starts typing
   *
   * This ensures that error messages disappear as soon as the user
   * begins correcting their input, providing better UX
   */
  useEffect(() => {
    if (error) {
      clearError();
    }
    // Close error toast when user starts typing
    if (toast && toast.type === 'error') {
      closeToast();
    }
  }, [email, password, clearError]);// Triggers when email or password changes


  /**
   * Handle login form submission
   *
   * Process:
   * 1. Validates that both fields are filled
   * 2. Clears previous errors
   * 3. Calls the login function from AuthContext
   * 4. Navigates to dashboard on success
   * 5. Errors are handled by AuthContext
   */
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      showToast('Please enter both email/username and password', 'error');
      return; // AuthContext will handle validation errors
    }

    //setError(null); // Clear any previous errors

    try {
      // Attempt login with provided credentials
      const result = await login(email, password);

      if (result) {
        // Login successful - navigate to dashboard
        showToast("Login successful, navigating to dashboard");
        console.log("Login successful, navigating to dashboard");
        console.log("User data:", user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        // Login failed - show error toast instead of silent failure
        showToast('Login failed. Please check your credentials.', 'error');
      }
      // Errors are automatically handled by AuthContext and displayed via error state
    } catch (err) {
      console.error("Unexpected login error:", err);
      //const errorMessage = err?.message || 'An unexpected error occurred. Please try again.';
      //showToast(getFormattedError(errorMessage), 'error');
      showToast('An unexpected error occurred. Please try again.', 'error');

      // AuthContext should handle this, but just in case
    }
  };

  /**
   * Navigate to registration page
   */
  const handleRegister = () => {
    navigate("/register");
  };

  /**
   * Handle Enter key press for form submission
   *
   * Allows users to submit the form by pressing Enter
   * Only works if form is valid and not currently loading
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleLogin();
    }
  };

  /**
   * Format error messages for better user experience
   *
   * Transforms technical error messages from the backend
   * into user-friendly messages that are easier to understand
   *
   * @param error - Raw error message from authentication service
   * @returns User-friendly error message
   */
  const getFormattedError = (error: string): string => {
    if (error.includes("Invalid login credentials") || error.includes("Invalid password")) {
      return "Invalid email/username or password. Please check your credentials.";
    } else if (error.includes("Email not confirmed")) {
      return "Please verify your email address before logging in.";
    } else if (error.includes("Too many requests")) {
      return "Too many login attempts. Please wait a moment and try again.";
    } else if (error.includes("Username not found")) {
      return "Username not found. Please check your credentials.";
    } else if (error.includes("No account found")) {
      return "No account found with this email/username.";
    } else if (error.includes("account has been deactivated")) {
      return "This account has been deactivated. Please contact support.";
    }
    return error; // Return original error if no match found
  };

  // Render the login form UI
  return (
    <>
    {/* Toast notification - rendered at top level for proper positioning */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

    <div className="login-container">
      <div className="login-box">
        {/* Tab navigation between Login and Register */}
        <div className="login-tabs">
          <button className="login-tab-active">Login</button>
          <button onClick={handleRegister} className="login-tab">
            Register
          </button>
        </div>

        {/* Page heading */}
        <h1 className="login-heading">Welcome Back!</h1>

        {/* Error message display */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fecaca',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {getFormattedError(error)}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="emailOrUsername" className="input-label">
              Email or Username
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

            {/* Password input field with visibility toggle */}
          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
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

          {/* Login button */}
          <Button
            onClick={handleLogin}
            className="login-button"
            size="lg"
            disabled={isLoading || !email || !password}
            style={{
              opacity: (isLoading || !email || !password) ? 0.6 : 1,
              cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? "Signing In..." : "Login"}
          </Button>

          {/* Link to registration page */}
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button
                onClick={handleRegister}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;