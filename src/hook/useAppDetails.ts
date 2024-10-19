import { getAppDetails } from "@/services/apis";
import mapError from "@/services/mapError";
import { useQuery } from "@tanstack/react-query";
import { topFreeAppsKeys } from "./queries";

function useAppDetails(appIds: string[]) {
  const {
    data: appDetailsData,
    status: appDetailsStatus,
    error,
  } = useQuery({
    queryKey: [topFreeAppsKeys.details(appIds)],
    queryFn: () => getAppDetails(appIds.join(",")),
    staleTime: 5 * 60 * 1000,
    meta: {
      errorMessage: "Failed to fetch app details",
    },
    enabled: appIds.length > 0,
  });
  return {
    appDetailsData,
    appDetailsStatus,
    error: mapError(error),
  };
}
export default useAppDetails;
