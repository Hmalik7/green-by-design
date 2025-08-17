
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "@/context/AuthContext";


const Login = () => {
  const { login, isLoading } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // Local error state
  const navigate = useNavigate();

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) {
      setError(null)
    }
  }, [email, password]);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      return; // AuthContext will handle validation errors
    }

    setError(null); // Clear any previous errors

    try {
      const result = await login(email, password);

      if (success) {
        // Login successful - navigate to dashboard
        console.log("Login successful, navigating to dashboard");
        navigate("/dashboard");
      }
      // Errors are automatically handled by AuthContext and displayed via error state
    } catch (err) {
      console.error("Unexpected login error:", err);
      // AuthContext should handle this, but just in case
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleLogin();
    }
  };

  // Format error messages for better UX
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
    return error;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-tabs">
          <button className="login-tab-active">Login</button>
          <button onClick={handleRegister} className="login-tab">
            Register
          </button>
        </div>

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
              id="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

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
  );
};

export default Login;