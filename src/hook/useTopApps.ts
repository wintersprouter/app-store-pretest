import { getTopFreeApplicationsWithDetails } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";

export const useTopApps = () => {
  return useQuery({
    queryKey: ["getTopFreeApplications"],
    queryFn: () => getTopFreeApplicationsWithDetails(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorMessage: "Failed to fetch top free applications",
    },
  });
};
