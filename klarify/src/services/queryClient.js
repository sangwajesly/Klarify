import { QueryClient } from "@tanstack/react-query";

// Configure a shared QueryClient with sensible defaults.
// staleTime keeps data fresh for 60 seconds, reducing repeated network calls.
// cacheTime retains unused cache for 5 minutes to avoid refetching shortly after navigation.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 60s
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
