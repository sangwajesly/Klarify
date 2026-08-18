import { useQuery } from "@tanstack/react-query";
import { fetchAllPrograms } from "./api";

export function usePrograms() {
  return useQuery(["programs"], () => fetchAllPrograms(), {
    staleTime: 1000 * 60, // 60s
    cacheTime: 1000 * 60 * 5, // 5m
  });
}
