import { getTopGrossingApplications } from "@/services/apis";
import mapError from "@/services/mapError";
import { useQuery } from "@tanstack/react-query";

export const useTopGrossingApps = () => {
  const {
    data: topGrossingAppsData,
    status: topGrossingAppsStatus,
    error,
  } = useQuery({
    queryKey: ["getTopGrossingApplications"],
    queryFn: () => getTopGrossingApplications(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  return {
    topGrossingAppsData,
    topGrossingAppsStatus,
    error: mapError(error),
  };
};
