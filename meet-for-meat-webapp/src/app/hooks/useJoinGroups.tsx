import { useState, useEffect } from "react";
import { fetchJoinGroups } from "../utils/fetchJoinGroups";
import { Group } from "./useCreateGroups";

interface Animal {
  image: string;
  breed: string;
  weight_kg: string;
  id: string;
  name: string;
}

export function useJoinGroups() {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [displayedGroups, setDisplayedGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const groupsPerPage = 3;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const apiResponse = await fetchJoinGroups();  
        const groupsArray = Array.isArray(apiResponse.groups) ? apiResponse.groups : [];
        const animalsArray = Array.isArray(apiResponse.animals) ? apiResponse.animals : [];

        const publicGroups = groupsArray.filter(group => group.privacy === "public");

        setAllGroups(publicGroups);
        setAnimals(animalsArray);
      } catch (err: unknown) { // Use 'unknown' for caught errors
        // Safely get the error message
        const errorMessage = err instanceof Error ? err.message : "Failed to load groups.";
        setError(errorMessage);
        setAllGroups([]);
        setAnimals([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const availableGroups = allGroups.filter((g) => g.current_members < g.max_members);
    const startIndex = (currentPage - 1) * groupsPerPage;
    const pagedGroups = availableGroups.slice(startIndex, startIndex + groupsPerPage);
    setDisplayedGroups(pagedGroups);
  }, [allGroups, currentPage]);

  const totalPages = Math.ceil(allGroups.filter((g) => g.current_members < g.max_members).length / groupsPerPage);

  return { 
    groups: displayedGroups, 
    animals, 
    isLoading, 
    error, 
    currentPage, 
    setCurrentPage, 
    totalPages,
  };
}