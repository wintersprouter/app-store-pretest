"use client";
import { useTopFreeApps } from "@/hook/useTopFreeApps";
import { useTopGrossingApps } from "@/hook/useTopGrossingApps";
import { APP, APP_ID, APP_NAME, getAppDetails, Result } from "@/services/apis";
import { Divider, Rate, Spin } from "antd";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { match } from "ts-pattern";

interface TopFreeData {
  id: APP_ID["attributes"]["im:id"];
  name: APP_NAME["label"];
  image: APP["im:image"][2]["label"];
  imageAlt: APP["im:name"]["label"];
  category: APP["category"]["attributes"]["label"];
  details?: {
    averageUserRating: Result["averageUserRating"];
    userRatingCount: Result["userRatingCount"];
  };
}

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [topFreeData, setTopFreeData] = useState<TopFreeData[]>([]);
  const [topFreeAppIds, setTopFreeAppIds] = useState<TopFreeData["id"][]>([]);
  const { data, status, failureReason } = useTopFreeApps();
  const { topGrossingAppsData, topGrossingAppsStatus } = useTopGrossingApps();
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(true);

  const totalPage = useMemo(
    () => Math.ceil(topFreeData.length / ITEMS_PER_PAGE),
    [topFreeData.length],
  );
  const endIndex = useMemo(() => page * ITEMS_PER_PAGE, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetchingMore ||
      page >= totalPage
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }, [isFetchingMore, page, totalPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (status === "success") {
      setTopFreeData((prevData) => [
        ...prevData,
        ...data.map((entry) => ({
          ...entry,
          id: entry.id.attributes["im:id"],
          name: entry["im:name"].label,
          image: entry["im:image"][2].label,
          category: entry.category.attributes.label,
          imageAlt: entry["im:name"].label,
        })),
      ]);
      setTopFreeAppIds((prevIds) => [
        ...prevIds,
        ...data.map((entry) => entry.id.attributes["im:id"]),
      ]);
      setIsFetchingMore(false);
    }
  }, [data, status]);

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        setIsFetchingMore(true);
        const lookUpAppDetails = [...topFreeAppIds]
          .slice(endIndex - ITEMS_PER_PAGE, endIndex)
          .join(",");
        const response = await getAppDetails(lookUpAppDetails);
        const detailData = response.map((entry) => ({
          trackId: entry.trackId,
          averageUserRating: entry.averageUserRating,
          userRatingCount: entry.userRatingCount,
        }));

        setTopFreeData((prevData) => [
          ...prevData.map((entry) => {
            const detail = detailData.find(
              (d) => d.trackId === Number(entry.id),
            );
            return {
              ...entry,
              details: {
                ...entry.details,
                averageUserRating:
                  detail?.averageUserRating ??
                  entry.details?.averageUserRating ??
                  0,
                userRatingCount:
                  detail?.userRatingCount ??
                  entry.details?.userRatingCount ??
                  0,
              },
            };
          }),
        ]);
        setIsFetchingMore(false);
      } catch (error) {
        setIsFetchingMore(false);
        console.error("Error fetching app details:", error);
      }
    };
    if (topFreeAppIds.length) {
      fetchAppDetails();
    }
  }, [endIndex, topFreeAppIds]);

  console.log("topFreeData[0]", JSON.stringify(topFreeData[0], null, 2));
  return (
    <div className="flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)]">
      {match(topGrossingAppsStatus)
        .with("pending", () => "Loading...")
        .with("error", () => `Error!${failureReason}`)
        .with("success", () => (
          <div className="mx-8">
            <h1 className="text-xl font-semibold">推介</h1>
            <div className="overflow-x-auto max-w-xs md:max-w-3xl lg:max-w-5xl">
              <ol className="flex space-x-4 p-4">
                {topGrossingAppsData?.map((entry) => (
                  <li
                    key={entry.id.attributes["im:id"]}
                    className="w-20 h-full flex-shrink-0"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <Image
                        src={entry["im:image"][2].label}
                        alt={entry["im:name"].label}
                        width={64}
                        height={64}
                        className="w-20 h-20 rounded-2xl"
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-1">
                      <h2 className="text-md font-bold text-wrap break-words">
                        {entry["im:name"].label}
                      </h2>
                      <p className="text-sm text-gray-500 text-wrap">
                        {entry.category.attributes.label}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))
        .exhaustive()}
      <Divider />
      {match(status)
        .with("pending", () => "Loading...")
        .with("error", () => `Error!${failureReason}`)
        .with("success", () => (
          <div>
            {topFreeData.slice(0, endIndex)?.map((entry, index) => (
              <div key={entry.id} className="md:w-[550px]">
                <div className="flex flex-row items-center gap-4">
                  <span>{index + 1}</span>
                  <Image
                    src={entry.image}
                    alt={entry.imageAlt}
                    width={64} // 16 * 4 (for responsive design)
                    height={64} // 16 * 4 (for responsive design)
                    className="rounded-full"
                  />
                  <div className="flex flex-col justify-start gap-1">
                    <h2 className="text-xl font-bold">{entry.name}</h2>
                    <p className="text-sm text-gray-500">{entry.category}</p>
                    <div className="flex gap-1">
                      <Rate
                        allowHalf
                        style={{ color: "#FE9503" }}
                        disabled
                        value={entry.details?.averageUserRating}
                      />
                      <p className="text-sm text-gray-500">
                        {`(${entry.details?.userRatingCount})`}
                      </p>
                    </div>
                  </div>
                </div>
                {index < 99 && <Divider />}
              </div>
            ))}
            {isFetchingMore && (
              <div className="flex justify-center">
                <Spin />
              </div>
            )}
          </div>
        ))
        .exhaustive()}
    </div>
  );
}
