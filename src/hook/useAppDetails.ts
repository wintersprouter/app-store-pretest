import { TopFreeData } from "@/app/page";
import { getAppDetails } from "@/services/apis";
import mapError from "@/services/mapError";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { topFreeAppsKeys } from "./queries";

function useAppDetails() {
  const [topFreeAppIds, setTopFreeAppIds] = useState<TopFreeData["id"][]>([]);

  const {
    data: appDetailsData,
    status: appDetailsStatus,
    error,
  } = useQuery({
    queryKey: [topFreeAppsKeys.details(topFreeAppIds)],
    queryFn: () => getAppDetails(topFreeAppIds.join(",")),
    staleTime: 5 * 60 * 1000,
    meta: {
      errorMessage: "Failed to fetch app details",
    },
    enabled: !!topFreeAppIds.length,
  });
  return {
    appDetailsData,
    appDetailsStatus,
    error: mapError(error),
    setTopFreeAppIds,
  };
}
export default useAppDetails;
