
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Keeping your original field name
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Since your form uses "username", we'll treat it as email for Supabase auth
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username, // Treating username as email
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Get user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, company_name, created_at, updated_at, is_active, email_verified')
          .eq('email', authData.user.email)
          .maybeSingle(); // Use maybeSingle() instead of single() to handle cases where user might not exist


        if (userError) {
          console.warn('User fetch error:', userError);
          // Still proceed with login even if user fetch fails
        }

        console.log("Login successful!");
        console.log("User data:", {
          auth: authData.user,
          userInfo: userData
        });

        // Store user data in localStorage for easy access (optional)
        localStorage.setItem('user', JSON.stringify({
          id: userData?.id || authData.user.id,
          email: authData.user.email,
          userInfo: userData
        }));

        // Navigate to dashboard or main app
        navigate("/dashboard"); // Change this to your desired route
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific error messages
      let errorMessage = "Login failed. Please try again.";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid username or password. Please check your credentials.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before logging in.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please wait a moment and try again.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
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
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="input-label">
              Email/Username
            </label>
            <Input
              id="username"
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              disabled={loading}
              autoComplete="email"
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
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
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
            disabled={loading || !username || !password}
            style={{
              opacity: (loading || !username || !password) ? 0.6 : 1,
              cursor: (loading || !username || !password) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Signing In..." : "Login"}
          </Button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button
                onClick={handleRegister}
                disabled={loading}
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
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