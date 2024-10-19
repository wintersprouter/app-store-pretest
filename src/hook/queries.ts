export const topFreeAppsKeys = {
  all: ["topFreeApps"] as const,
  details: (appIds: string[]) =>
    [...topFreeAppsKeys.all, [...appIds], "details"] as const,
  list: () => [...topFreeAppsKeys.all, "list"] as const,
};
