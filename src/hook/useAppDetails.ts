import { TopFreeData } from "@/app/page";
import { getAppDetails } from "@/services/apis";
import mapError from "@/services/mapError";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { topFreeAppsKeys } from "./queries";

/**
 * Get the details of the top free applications in Taiwan
 * @returns appDetailsData, appDetailsStatus, error, setTopFreeAppIds
 * @example const { appDetailsData, appDetailsStatus, error, setTopFreeAppIds } = useAppDetails();
 */
function useAppDetails() {
  const [topFreeAppIds, setTopFreeAppIds] = useState<TopFreeData["id"][]>([]);

  const filteredTopFreeAppIds = topFreeAppIds.filter(
    (id) => id !== undefined && id !== null && id !== "",
  );
  const {
    data: appDetailsData,
    status: appDetailsStatus,
    error,
  } = useQuery({
    queryKey: [topFreeAppsKeys.details(filteredTopFreeAppIds)],
    queryFn: () => getAppDetails(filteredTopFreeAppIds.join(",")),
    staleTime: 15 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!filteredTopFreeAppIds.length,
  });
  return {
    appDetailsData,
    appDetailsStatus,
    error: mapError(error),
    setTopFreeAppIds,
  };
}
export default useAppDetails;
