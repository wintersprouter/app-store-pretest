"use client";
import { useTopFreeApps } from "@/hook/useTopFreeApps";
import { useTopGrossingApps } from "@/hook/useTopGrossingApps";
import { Divider, Rate } from "antd";
import { match } from "ts-pattern";
export default function Home() {
  const { data, status, failureReason } = useTopFreeApps();
  const { topGrossingAppsData, topGrossingAppsStatus } = useTopGrossingApps();

  return (
    <div className="container flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)]">
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
                      <img
                        src={entry["im:image"][2].label}
                        alt={entry["im:name"].label}
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
            {data?.map((entry, index) => (
              <div key={entry.id.attributes["im:id"]}>
                <div className="flex flex-row items-center gap-4">
                  <span>{index + 1}</span>
                  <img
                    src={entry["im:image"][2].label}
                    alt={entry["im:name"].label}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex flex-col justify-start gap-1">
                    <h2 className="text-xl font-bold">
                      {entry["im:name"].label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {entry.category.attributes.label}
                    </p>
                    <div className="flex gap-1">
                      <Rate
                        allowHalf
                        style={{ color: "#FE9503" }}
                        disabled
                        defaultValue={entry.details.averageUserRating}
                      />
                      <p className="text-sm text-gray-500">{`(${entry.details.userRatingCount})`}</p>
                    </div>
                  </div>
                </div>
                {index < 99 && <Divider />}
              </div>
            ))}
          </div>
        ))
        .exhaustive()}
    </div>
  );
}
