"use client";

import { useState } from "react";
import { fetchSignup, fetchLogin, SignupData } from "../utils/fetchsignup";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      const signupResponse = await fetchSignup(data);
      const loginResponse = await fetchLogin(data.phone_number, data.password);

      const token = loginResponse.token || loginResponse.access_token || loginResponse.auth_token || loginResponse.key;
      const userId = loginResponse.user_id || loginResponse.id || loginResponse.user?.id || loginResponse.user || loginResponse.pk;

      if (!token || !userId) {
        throw new Error("No token or user_id received from login server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userId.toString());

      return { ...signupResponse, token, user_id: userId };
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : "Signup or login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}