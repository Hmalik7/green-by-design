
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login attempted with:", { username, password });
  };

  const handleRegister = () => {
    navigate("/register");
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

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <Button onClick={handleLogin} className="login-button" size="lg">
            Login
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
