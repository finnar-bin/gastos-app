import { useQuery } from "@tanstack/react-query";

import { getUserSheets } from "@/src/lib/sheets-requests";

export function useUserSheetsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-sheets", userId],
    queryFn: () => getUserSheets(userId!),
    enabled: Boolean(userId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}
