import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/src/providers/query-provider";
import { SessionProvider } from "@/src/providers/session-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryProvider>
  );
}
