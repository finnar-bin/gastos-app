import { type PropsWithChildren, useEffect, useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/src/lib/supabase";

type SessionStore = {
  isLoading: boolean;
  session: Session | null;
};

let sessionStore: SessionStore = {
  isLoading: true,
  session: null,
};

const listeners = new Set<() => void>();
let authSubscription: { unsubscribe: () => void } | null = null;
let hasInitialized = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateSessionStore(nextState: Partial<SessionStore>) {
  sessionStore = {
    isLoading: nextState.isLoading ?? sessionStore.isLoading,
    session:
      nextState.session === undefined ? sessionStore.session : nextState.session,
  };
  emitChange();
}

function initializeSessionStore() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;

  supabase.auth.getSession().then(({ data, error }) => {
    updateSessionStore({
      isLoading: false,
      session: error ? null : data.session,
    });
  }).catch(() => {
    updateSessionStore({
      isLoading: false,
      session: null,
    });
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, nextSession) => {
    updateSessionStore({
      isLoading: false,
      session: nextSession,
    });
  });

  authSubscription = subscription;
}

function subscribe(listener: () => void) {
  initializeSessionStore();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  initializeSessionStore();
  return sessionStore;
}

export function SessionProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    initializeSessionStore();

    return () => {
      if (listeners.size === 0) {
        authSubscription?.unsubscribe();
        authSubscription = null;
        hasInitialized = false;
        sessionStore = {
          isLoading: true,
          session: null,
        };
      }
    };
  }, []);

  return children;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
