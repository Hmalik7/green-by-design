
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { useAuth } from "@/context/AuthContext";


const Login = () => {
  const { login, loading } = useAuth();
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

  const handleRegister = () => {
    navigate("/register");
  };

  if (error) {
    console.error("Login error:", error);
  }

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
              className="input-field"
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
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button onClick={handleLogin} className="login-button" size="lg"
            disabled={loading}
>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button onClick={handleRegister}>Register</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
