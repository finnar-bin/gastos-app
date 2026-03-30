import type { PropsWithChildren } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Phase 1 offline support: prefer cached data when offline.
      networkMode: "offlineFirst",
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
};

const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "gastos-query-cache-v1",
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
