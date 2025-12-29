
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
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleLogin = async (e: React.FormEvent) => {
  console.log("handleLogin function called");
    alert("login button clicked");

  e.preventDefault();
  setError(null); // clear any previous error

  console.log("Email:", email);
  console.log("Password:", password);

  // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

  try {
    const result = await login(email, password);
    console.log("Login result:", result);

    if (result && result.error) {
      setError(result.error);
      console.error("Login error:", result.error);
    } else {
      console.log("Login successful:", result);
      navigate("/dashboard"); // ← This is missing in your version!
    }
  } catch (err) {
    console.error("Unexpected error during login:", err);
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
          {error && (
            <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div>

            <label htmlFor="email" className="input-label">
              Email
            </label>
            <Input
              id="email"
              type="email"
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