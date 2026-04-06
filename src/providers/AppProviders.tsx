import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/src/providers/QueryProvider";
import { SessionProvider } from "@/src/providers/SessionProvider";
import { ToastProvider } from "@/src/providers/ToastProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <SessionProvider>
        <ToastProvider>{children}</ToastProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
