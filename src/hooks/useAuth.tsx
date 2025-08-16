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
        .maybeSingle();

        if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("An error occurred while checking the user.");
        setLoading(false);
        return;
        }

      if (!user) {
        // No user found
        setError("No account found with this email. Would you like to register?");
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
   return { login, loading, error };
}