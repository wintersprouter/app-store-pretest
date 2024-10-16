"use client";
import { useTopApps } from "@/hook/useTopApps";
import { Divider, Rate } from "antd";
import { match } from "ts-pattern";
export default function Home() {
  const { data, status, failureReason } = useTopApps();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {"APP STORE "}
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
                    className="w-20 h-20 rounded-full"
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
                <Divider />
              </div>
            ))}
          </div>
        ))
        .exhaustive()}
    </div>
  );
}
