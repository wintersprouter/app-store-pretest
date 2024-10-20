import { getTopFreeApplications } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { topFreeAppsKeys } from "./queries";

/**
 * Get the top 100 free applications in Taiwan
 * @returns {object}
 * @example
 * const { data, status, error, isFetching, isStale } = useTopFreeApps();
 */
export const useTopFreeApps = () => {
  return useQuery({
    queryKey: [topFreeAppsKeys.list()],
    queryFn: () => getTopFreeApplications(),
    staleTime: 15 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
