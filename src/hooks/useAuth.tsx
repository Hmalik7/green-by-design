import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Check if the user exists in the 'profiles' table
      const { data: user, error: fetchError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          // No user found
          setError("No account found with this email. Would you like to register?");
        } else {
          setError("An error occurred while checking the user.");
        }
        setLoading(false);
        return;
      }

      // Step 2: Attempt to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (
          signInError.message.includes("Invalid login credentials") ||
          signInError.status === 400
        ) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Unexpected error occurred during login.");
    }

    setLoading(false);
  };

  const register = async (
    email: string,
    password: string,
    metadata: { first_name: string; last_name: string; username: string }
  ) => {
    setLoading(true);
    setError("");

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected registration error:", err);
      setError("Unexpected error occurred during registration.");
    }

    setLoading(false);
  };

  return { login, register, loading, error };
}
