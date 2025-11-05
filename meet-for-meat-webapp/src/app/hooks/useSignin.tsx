"use client";

import { useState } from "react";
import { fetchSignin } from "../utils/fetchSignin";

export function useSignin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signin = async (phone_number: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSignin(phone_number, password);
      return data;
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : "Network or server error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading, error };
}