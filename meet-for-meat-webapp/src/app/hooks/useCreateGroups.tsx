import { useState, useEffect, useMemo } from "react";
import { fetchLivestock, fetchGroups } from "../utils/fetchCreateGroups";

export interface Group {
  livestock: number;
  group_type: string;
  group_name: string;
  slaughter_time: string;
  payment_progress: number;
  member_progress: number;
  price_full: number;
  price_half: number;
  max_members: number;
  current_members: number;
  id: number;
  breed: string;
  weight_kg: string;
  health_status: string;
  price_total: string;
  price_per_kg: string;
  availability_status: string;
  image?: string | null;
  created_at: string;
  updated_at: string;
}

export function useCreateGroups(itemsPerPage = 3) {
  const [livestocks, setLivestocks] = useState<Group[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [livestockData, groupsData] = await Promise.all([fetchLivestock(), fetchGroups()]);
        const occupiedLivestockIds = new Set(groupsData.map((group: Group) => group.livestock));
        const updatedLivestocks = livestockData.map((livestock: Group) => ({
          ...livestock,
          availability_status: occupiedLivestockIds.has(livestock.id) ? "unavailable" : livestock.availability_status,
        }));
        setLivestocks(updatedLivestocks);
        setError(null);
      } catch (err: unknown) { 
        const errorMessage = err instanceof Error ? err.message : "Failed to load data.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const totalPages = useMemo(() => Math.ceil(livestocks.length / itemsPerPage), [livestocks, itemsPerPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return livestocks.slice(start, start + itemsPerPage);
  }, [livestocks, currentPage, itemsPerPage]);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return { currentItems, currentPage, totalPages, goToPage, isLoading, error };
}
