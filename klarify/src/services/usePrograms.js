import { useQuery } from "@tanstack/react-query";
import { fetchAllPrograms } from "./api";

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchAllPrograms(),
    staleTime: 1000 * 60, // 60s
    gcTime: 1000 * 60 * 5, // 5m
  });
}
