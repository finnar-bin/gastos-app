import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

import { env } from "@/src/lib/env";

const NATIVE_AUTH_REDIRECT = "gastosapp://auth/callback";

export function getAuthRedirectUrl() {
  if (Platform.OS !== "web") {
    return NATIVE_AUTH_REDIRECT;
  }

  if (env.authRedirectUrl) {
    return env.authRedirectUrl;
  }

  return AuthSession.makeRedirectUri({
    path: "auth/callback",
  });
}

export function sanitizeDisplayName(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
