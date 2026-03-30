import { Platform } from "react-native";

import { supabase } from "@/src/lib/supabase";
import { sanitizeDisplayName } from "@/src/lib/auth-utils";

type AuthResult =
  | { type: "success"; url: string | null }
  | { type: "opened"; url: null }
  | { type: "cancel"; url: null }
  | { type: "dismiss"; url: null }
  | { type: "locked"; url: null };

type GoogleSignInOptions = {
  redirectTo: string;
  openAuthSession: (url: string) => Promise<AuthResult>;
};

type SignUpPayload = {
  displayName: string;
  email: string;
  password: string;
  emailRedirectTo: string;
};

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }
}

export async function signUpWithPassword({
  displayName,
  email,
  password,
  emailRedirectTo,
}: SignUpPayload) {
  const cleanedDisplayName = sanitizeDisplayName(displayName);

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo,
      data: {
        display_name: cleanedDisplayName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

function readTokensFromUrl(url: string) {
  const hash = url.split("#")[1] ?? "";
  const query = url.includes("?") ? url.split("?")[1].split("#")[0] : "";

  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(query);

  return {
    accessToken: hashParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token"),
    code: queryParams.get("code"),
  };
}

export async function signInWithGoogle({
  redirectTo,
  openAuthSession,
}: GoogleSignInOptions) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== "web",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  if (Platform.OS === "web") {
    return;
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google auth URL.");
  }

  const result = await openAuthSession(data.url);

  if (result.type !== "success" || !result.url) {
    if (result.type === "cancel" || result.type === "dismiss") {
      return;
    }

    throw new Error("Google sign in did not complete.");
  }

  const { accessToken, refreshToken, code } = readTokensFromUrl(result.url);

  if (accessToken && refreshToken) {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      throw sessionError;
    }

    return;
  }

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw exchangeError;
    }

    return;
  }

  throw new Error("No session credentials were returned from Google sign in.");
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
