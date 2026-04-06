import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast, type ToastType } from "@/src/ui/Toast";

type ToastInput = {
  message: string;
  type: ToastType;
  durationMs?: number;
};

type ToastRecord = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
};

const DEFAULT_TOAST_DURATION_MS = 2000;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextToastIdRef = useRef(1);
  const timeoutIdsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type, durationMs = DEFAULT_TOAST_DURATION_MS }: ToastInput) => {
      const id = nextToastIdRef.current;
      nextToastIdRef.current += 1;

      setToasts((previous) => [...previous, { id, message, type }]);

      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, durationMs);

      timeoutIdsRef.current.push(timeoutId);
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View
        pointerEvents="none"
        className="absolute left-4 right-4 z-[100]"
        style={{ top: insets.top + 10 }}
      >
        <View className="gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
