import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

// Debugging lines
console.log('🔍 Environment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

// CORS configuration - MUST be before routes
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite's default port
    "http://localhost:3000",
    "http://localhost:8091",
    "http://localhost:8081",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware - MUST be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// IMPORTANT: Register auth routes BEFORE other routes
console.log('✅ Registering auth routes...');
app.use("/api/auth", authRoutes);
console.log('✅ Auth routes registered at /api/auth');

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    routes: {
      "/": "Root endpoint",
      "/health": "Health check",
      "/api/auth/register": "Registration endpoint",
      "/api/auth/login": "Login endpoint"
    }
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Authentication API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      health: "/health"
    },
    availableRoutes: [
      "GET /",
      "GET /health",
      "POST /api/auth/register",
      "POST /api/auth/login"
    ]
  });
});

// Simple debug endpoint to show available routes
app.get("/debug/routes", (req: Request, res: Response) => {
  res.json({
    message: "Available routes",
    routes: [
      { method: "GET", path: "/" },
      { method: "GET", path: "/health" },
      { method: "GET", path: "/debug/routes" },
      { method: "POST", path: "/api/auth/register" },
      { method: "POST", path: "/api/auth/login" },
      { method: "GET", path: "/api/auth/me" },
      { method: "POST", path: "/api/auth/refresh" },
      { method: "POST", path: "/api/auth/logout" }
    ]
  });
});

// IMPORTANT: 404 handler MUST be LAST
app.use("*", (req: Request, res: Response) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /debug/routes",
      "POST /api/auth/register",
      "POST /api/auth/login"
    ]
  });
});

// Global error handler - MUST be LAST
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Global error handler:', error);
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start server on port 8080 to match frontend expectations
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🐛 Debug routes: http://localhost:${PORT}/debug/routes`);

  // Log environment check
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️  Warning: Supabase environment variables not set");
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "supersecret") {
    console.warn("⚠️  Warning: Using default JWT secret (change in production)");
  }

  console.log('\n🔍 Testing routes...');
  console.log('Try these URLs:');
  console.log(`- http://localhost:${PORT}/`);
  console.log(`- http://localhost:${PORT}/health`);
  console.log(`- http://localhost:${PORT}/debug/routes`);
  console.log(`- http://localhost:${PORT}/api/auth/register (POST)`);
});