import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

// Type definitions
interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

interface RegisterRequestBody {
  user_persona: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface User {
  id: string;
  user_persona: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  username: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

const router: Router = express.Router();

// Add logging to see if this file is being loaded
console.log('🔄 Auth routes file loading...');

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL is not set');
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecret";

console.log('✅ Auth routes initialized with Supabase client');

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Test endpoint to verify routes are working
router.get("/test", (req: Request, res: Response): void => {
  console.log('🧪 Auth test endpoint hit');
  res.json({
    message: "Auth routes are working!",
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase
  });
});

// REGISTER ENDPOINT
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  console.log("📝 Register endpoint hit");
  console.log("Received body:", req.body);

  const body = req.body as RegisterRequestBody;
  const { user_persona, first_name, last_name, company_name, email, username, password } = body;

  console.log("Email received:", email);
console.log("Email type:", typeof email);
console.log("Email validation result:", isValidEmail(email));

  try {
    // Validation
    if (!user_persona || !first_name || !last_name || !company_name || !email || !username || !password) {
      console.log("❌ Validation failed: Missing required fields");
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!isValidEmail(email)) {
      console.log("Email received:", email);
      console.log("Email type:", typeof email);
      console.log("Email validation result:", isValidEmail(email));
      console.log("❌ Validation failed: Invalid email format");
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short");
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }

    console.log("🔍 Checking for existing user...");

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is what we want
      console.error("❌ Database check error:", checkError);
      throw checkError;
    }

    if (existingUser) {
      console.log("❌ User already exists");
      if (existingUser.email === email) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }
      if (existingUser.username === username) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
    }

    console.log("🔐 Hashing password...");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("💾 Inserting new user...");
    // Insert new user
    const { data, error } = await supabase.from("users").insert([
      {
        user_persona,
        first_name,
        last_name,
        company_name,
        email,
        username,
        password: hashedPassword,
      },
    ]).select().single();

    if (error) {
      console.error("❌ Database insert error:", error);
      throw error;
    }

    console.log("✅ User created successfully");
    const userData = data as User;
    const { password: _, ...userWithoutPassword } = userData;

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('💥 Registration error:', error);
    const message = getErrorMessage(error);
    res.status(500).json({
      message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// LOGIN ENDPOINT
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  console.log("🔑 Login endpoint hit");
  const body = req.body as LoginRequestBody;
  const { email, password } = body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Email/username and password are required" });
      return;
    }

    // Find user by email OR username
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},username.eq.${email}`)
      .maybeSingle();

    if (error || !user) {
      console.log("❌ User not found");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const userData = user as User;

    // Compare passwords
    const isValid = await bcrypt.compare(password, userData.password);

    if (!isValid) {
      console.log("❌ Invalid password");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(userData.id);
    const { password: _, ...userWithoutPassword } = userData;

    console.log("✅ Login successful");
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('💥 Login error:', err);
    const message = getErrorMessage(err);
    res.status(500).json({ message });
  }
});

// GET CURRENT USER ENDPOINT
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .maybeSingle();

    if (error || !user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = user as User;
    const { password: _, ...userWithoutPassword } = userData;

    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error('Get user error:', err);
    const message = getErrorMessage(err);
    res.status(401).json({ message });
  }
});

// REFRESH TOKEN ENDPOINT
router.post("/refresh", (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JWTPayload;

    const newToken = generateToken(decoded.id);

    res.json({ token: newToken });
  } catch (err) {
    console.error('Token refresh error:', err);
    const message = getErrorMessage(err);
    res.status(401).json({ message });
  }
});

// LOGOUT ENDPOINT (optional)
router.post("/logout", (req: Request, res: Response): void => {
  res.json({ message: "Logout successful" });
});

console.log('✅ Auth routes configured');

export default router;