"use client";
import { getTopFreeApplications } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, status, failureReason } = useQuery({
    queryFn: () => getTopFreeApplications(),
    queryKey: ["getTopFreeApplications"],
    meta: {
      errorMessage: "Failed to fetch top free applications",
    },
  });

  console.log("data", JSON.stringify(data, null, 2));
  console.log("status", status);
  console.log("failureReason", failureReason);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {"APP STORE "}
    </div>
  );
}
