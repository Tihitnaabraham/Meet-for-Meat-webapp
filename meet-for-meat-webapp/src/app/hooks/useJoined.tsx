import { useState, useEffect } from "react";
import { fetchJoinedGroups } from "../utils/fetchJoined";

export interface JoinedGroup {
  id: number | string;
  group_name?: string;
  slaughter_date?: string;
  slaughter_time?: string;
  location?: string;
  privacy?: string;
  livestock?: { price_total?: number | string; [key: string]: unknown };
  payment?: { amount?: number; [key: string]: unknown };
  memberProgress?: number;
  paymentProgress?: number;
  max_members?: number;
  current_members?: number;
  payment_status?: string;
  breed?: string;
  weight_kg?: string;
  health_status?: string;
  price_total?: string;
  price_per_kg?: string;
  availability_status?: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useJoined() {
  // Use the new JoinedGroup type for the state
  const [groups, setGroups] = useState<JoinedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        setLoading(true);
        const userGroups = await fetchJoinedGroups(token, userId);
        setGroups(userGroups);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Failed to load groups";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { groups, loading, error };
}