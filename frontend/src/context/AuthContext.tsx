// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL not set. Falling back to http://localhost:8081");
  API_BASE_URL = "http://localhost:8081";
}

console.log("🔍 Using API_BASE_URL:", API_BASE_URL);

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
console.log("🔍 Debug Info:");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Environment variables:", import.meta.env);
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

interface User {
  user_persona: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
   error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  user_persona: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = React.createContext<AuthContextType | null>(null);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const clearError = () => setError(null);


  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setToken(savedToken);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    console.log(JSON.stringify({ email, password }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },


        body:JSON.stringify({ email, password })
      });
      console.log("📥 Login response status:", response.status);
      console.log("📥 Login response status text:", response.statusText);
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        const { token: authToken, user: userData } = data;

        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData.message);
        const errorMessage = errorData.message || 'Invalid login credentials';
        setError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Login network error:', error);
  if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('Login failed. Please try again later.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
  setIsLoading(true);
  setError(null);

  console.log("📡 Attempting register...");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Full URL:", `${API_BASE_URL}/api/auth/register`);
  console.log("Payload:", userData);

  try {
    console.log("📡 Making fetch request...");
    const { confirmPassword, ...payload } = userData;
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    });

    console.log("📥 Response received:");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("📋 Response data:", data);

    if (response.ok) {
      console.log("✅ Registration successful");
      return true;
    } else {
      console.log("❌ Registration failed with server error");
      setError(data.message || 'Registration failed');
      return false;
    }
  } catch (error) {
    console.error("💥 Fetch error caught:");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    // Check specific error types
    if (error instanceof TypeError) {
      console.error("🌐 Network error - likely can't reach backend");
    if (error instanceof TypeError) {
        setError('Cannot connect to server. Is the backend running on port 8080?');
      } else {
        setError('Network error. Please check your connection.');
      }
      return false;    } else {
      console.error("🔥 Unknown error type");
      setError('Network error. Please check your connection.');
    }
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
  };

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      if (!currentToken) return;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
      } else {
        logout(); // Token refresh failed, logout user
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshToken,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};