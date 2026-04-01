import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/src/providers/QueryProvider";
import { SessionProvider } from "@/src/providers/SessionProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryProvider>
  );
}
