import { getTopGrossingApplications } from "@/services/apis";
import mapError from "@/services/mapError";
import { useQuery } from "@tanstack/react-query";

/**
 * Get the top 10 grossing applications in Taiwan
 * @returns topGrossingAppsData, topGrossingAppsStatus, error
 * @example const { topGrossingAppsData, topGrossingAppsStatus, error } = useTopGrossingApps();
 */

export const useTopGrossingApps = () => {
  const {
    data: topGrossingAppsData,
    status: topGrossingAppsStatus,
    error,
  } = useQuery({
    queryKey: ["getTopGrossingApplications"],
    queryFn: () => getTopGrossingApplications(),
    staleTime: 15 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return {
    topGrossingAppsData,
    topGrossingAppsStatus,
    error: mapError(error),
  };
};
