"use client";
import useAppDetails from "@/hook/useAppDetails";
import { useTopFreeApps } from "@/hook/useTopFreeApps";
import { useTopGrossingApps } from "@/hook/useTopGrossingApps";
import { APP, APP_ID, APP_NAME, Result } from "@/services/apis/types";
import { Divider, Input, List, Rate, Skeleton, Spin } from "antd";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { match, P } from "ts-pattern";
export interface TopFreeData {
  id: APP_ID["attributes"]["im:id"];
  name: APP_NAME["label"];
  image: APP["im:image"][2]["label"];
  imageAlt: APP["im:name"]["label"];
  category: APP["category"]["attributes"]["label"];
  summary: APP["summary"]["label"];
  title: APP["title"]["label"];
  details?: {
    averageUserRating: Result["averageUserRating"];
    userRatingCount: Result["userRatingCount"];
  };
}

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [topFreeData, setTopFreeData] = useState<TopFreeData[]>([]);
  const { data, status, failureReason } = useTopFreeApps();
  const { topGrossingAppsData, topGrossingAppsStatus } = useTopGrossingApps();
  const { appDetailsData, appDetailsStatus, setTopFreeAppIds } =
    useAppDetails();
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const totalPage = useMemo(
    () => Math.ceil(topFreeData.length / ITEMS_PER_PAGE),
    [topFreeData.length],
  );
  const endIndex = useMemo(() => page * ITEMS_PER_PAGE, [page]);

  const searchResultAmount = useMemo(
    () =>
      topFreeData.filter(
        (entry) =>
          entry.name.includes(searchKeyword) ||
          entry.summary.includes(searchKeyword) ||
          entry.title.includes(searchKeyword),
      ).length,
    [searchKeyword, topFreeData],
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      (searchKeyword.length == 0 && page >= totalPage) ||
      (searchKeyword.length > 0 && page >= searchResultAmount / ITEMS_PER_PAGE)
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }, [page, searchKeyword.length, searchResultAmount, totalPage]);

  useEffect(() => {
    if (status === "success" && data) {
      setTopFreeData((prevData) => [
        ...prevData,
        ...data.map((entry) => ({
          ...entry,
          id: entry.id.attributes["im:id"],
          name: entry["im:name"].label,
          image: entry["im:image"][2].label,
          category: entry.category.attributes.label,
          imageAlt: entry["im:name"].label,
          summary: entry.summary.label,
          title: entry.title.label,
        })),
      ]);
    }
  }, [data, status]);

  useEffect(() => {
    if (appDetailsStatus === "success" && appDetailsData) {
      const detailData = appDetailsData.results.map((entry) => ({
        trackId: entry.trackId,
        averageUserRating: entry.averageUserRating,
        userRatingCount: entry.userRatingCount,
      }));
      setTopFreeData((prevData) => [
        ...prevData.map((entry) => {
          const detail = detailData.find((d) => d.trackId === Number(entry.id));
          return {
            ...entry,
            details: {
              ...entry.details,
              averageUserRating:
                detail?.averageUserRating ??
                entry.details?.averageUserRating ??
                0,
              userRatingCount:
                detail?.userRatingCount ?? entry.details?.userRatingCount ?? 0,
            },
          };
        }),
      ]);
    }
  }, [appDetailsData, appDetailsStatus]);

  useEffect(() => {
    if (searchKeyword.length > 0) {
      const filteredSearchedIds =
        data
          ?.filter(
            (entry) =>
              entry["im:name"].label.includes(searchKeyword) ||
              entry.summary.label.includes(searchKeyword) ||
              entry.title.label.includes(searchKeyword),
          )
          .map((entry) => entry.id.attributes["im:id"]) ?? [];

      const startIndex = endIndex - ITEMS_PER_PAGE;
      const adjustedEndIndex = Math.min(endIndex, filteredSearchedIds.length);
      const paginatedIds =
        filteredSearchedIds.slice(startIndex, adjustedEndIndex) ?? [];

      setTopFreeAppIds((prevIds) => {
        if (prevIds.length === 0) {
          return [...paginatedIds];
        } else if (endIndex % ITEMS_PER_PAGE === 0)
          return [...prevIds.map((_id, index) => paginatedIds[index])];
        else {
          return [...paginatedIds];
        }
      });
    } else {
      const filteredIds =
        data
          ?.map((entry) => entry.id.attributes["im:id"])
          .slice(endIndex - ITEMS_PER_PAGE, endIndex) ?? [];
      setTopFreeAppIds((prevIds) => {
        if (prevIds.length === 0) {
          return [...filteredIds];
        }
        return [...prevIds.map((_id, index) => filteredIds[index])];
      });
    }
  }, [searchKeyword, data, setTopFreeAppIds, endIndex]);

  return (
    <div className="flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="fixed top-0 z-10 p-2 bg-[#F9F9F9] w-full flex justify-center border-b-2 border-#E7E7E7">
        <Input
          placeholder="搜尋"
          variant="filled"
          allowClear
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full md:w-72 font-[#959699] "
        />
      </div>
      {match(topGrossingAppsStatus)
        .with("pending", () => (
          <Spin tip="Loading" size="large">
            <div className="p-6 mt-12" />;
          </Spin>
        ))
        .with("error", () => `Error!${failureReason}`)
        .with("success", () => (
          <div className="relative top-10 mx-8 mt-2 py-2">
            <h1 className="text-xl font-semibold">推介</h1>
            <div className="overflow-x-auto max-w-xs md:max-w-3xl lg:max-w-5xl">
              <ul className="flex space-x-4 p-4">
                {match([
                  searchKeyword.length,
                  topGrossingAppsData?.filter(
                    (entry) =>
                      entry["im:name"].label.includes(searchKeyword) ||
                      entry.summary.label.includes(searchKeyword) ||
                      entry.title.label.includes(searchKeyword),
                  ).length,
                ])
                  //有搜尋關鍵字，且有相符的應用程式
                  .with([P.number.gt(0), P.number.gt(0)], () =>
                    topGrossingAppsData
                      ?.filter(
                        (entry) =>
                          entry["im:name"].label.includes(searchKeyword) ||
                          entry.summary.label.includes(searchKeyword) ||
                          entry.title.label.includes(searchKeyword),
                      )
                      .map((entry) => (
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
                      )),
                  )
                  //有搜尋關鍵字，但沒有相符的應用程式
                  .with([P.number.gt(0), P.number.lt(1)], () => (
                    <li>
                      <p>查無相關應用程式</p>
                    </li>
                  ))
                  .otherwise(() =>
                    topGrossingAppsData?.map((entry) => (
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
                    )),
                  )}
              </ul>
            </div>
          </div>
        ))
        .exhaustive()}
      <Divider />

      {match([searchKeyword.length, searchResultAmount])
        //有搜尋關鍵字，且有相符的應用程式
        .with([P.number.gt(0), P.number.gt(0)], () => (
          <InfiniteScroll
            dataLength={searchResultAmount}
            next={() => {
              console.log("get next page with search");
            }}
            hasMore={page < searchResultAmount / ITEMS_PER_PAGE}
            loader={<Skeleton avatar paragraph={{ rows: 3 }} active />}
            endMessage={<Divider plain>已經到底了</Divider>}
            scrollableTarget="scrollableDiv"
            onScroll={handleScroll}
          >
            <List
              itemLayout="horizontal"
              dataSource={topFreeData
                .filter(
                  (entry) =>
                    entry.name.includes(searchKeyword) ||
                    entry.summary.includes(searchKeyword) ||
                    entry.title.includes(searchKeyword),
                )
                .slice(0, endIndex)}
              renderItem={(entry, index) => (
                <List.Item key={entry.id}>
                  <div className="flex flex-row items-center gap-4 w-full md:w-[600px]">
                    <span>{index + 1}</span>
                    <Image
                      src={entry.image}
                      alt={entry.imageAlt}
                      width={64}
                      height={64}
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
                </List.Item>
              )}
            />
          </InfiniteScroll>
        ))
        //有搜尋關鍵字，但沒有相符的應用程式
        .with([P.number.gt(0), P.number.lt(1)], () => (
          <div>
            <p>查無相關應用程式</p>
          </div>
        ))
        .otherwise(() => (
          <InfiniteScroll
            dataLength={topFreeData.length}
            next={() => {
              console.log("get next page");
            }}
            hasMore={page < totalPage}
            loader={<Skeleton avatar paragraph={{ rows: 3 }} active />}
            endMessage={
              topFreeData.length && <Divider plain>已經到底了</Divider>
            }
            scrollableTarget="scrollableDiv"
            onScroll={handleScroll}
          >
            <List
              itemLayout="horizontal"
              dataSource={topFreeData.slice(0, endIndex)}
              renderItem={(entry, index) => (
                <List.Item key={entry.id}>
                  <div className="flex flex-row items-center gap-4 w-full md:w-[600px]">
                    <span>{index + 1}</span>
                    <Image
                      src={entry.image}
                      alt={entry.imageAlt}
                      width={64}
                      height={64}
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
                          {`(${entry.details?.userRatingCount.toLocaleString()})`}
                        </p>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        ))}
    </div>
  );
}
