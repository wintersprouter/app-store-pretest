import { getTopFreeApplications } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { topFreeAppsKeys } from "./queries";

export const useTopFreeApps = () => {
  return useQuery({
    queryKey: [topFreeAppsKeys.list()],
    queryFn: () => getTopFreeApplications(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorMessage: "Failed to fetch top free applications",
    },
  });
};
