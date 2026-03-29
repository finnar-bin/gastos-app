import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Redirect, Stack, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { signInWithGoogle, signInWithPassword } from "@/src/lib/auth";
import { useSession } from "@/src/providers/session-provider";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (session) {
    return <Redirect href="/(app)" />;
  }

  const handlePasswordLogin = async () => {
    setErrorMessage(null);
    setIsPasswordLoading(true);

    try {
      await signInWithPassword(email, password);
      router.replace("/(app)");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "gastosapp",
        path: "auth/callback",
      });

      await signInWithGoogle({
        openAuthSession: async (url) => {
          if (Platform.OS === "web") {
            return { type: "opened" as const, url: null };
          }

          const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);

          return result.type === "success"
            ? { type: "success" as const, url: result.url }
            : { type: result.type, url: null };
        },
        redirectTo,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Google sign in failed.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isDisabled =
    isPasswordLoading || isGoogleLoading || !email.trim() || !password.trim();

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-canvas"
      >
        <View className="flex-1 items-center justify-center px-6 py-10">
          <View className="w-full max-w-[440px] rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase tracking-[3px] text-primary">
                Budget Tracking
              </Text>
              <Text className="text-4xl font-black leading-tight text-ink">
                Log in to Gastos
              </Text>
              <Text className="text-base leading-6 text-ink/70">
                Use your existing Supabase auth account to access your budgets,
                categories, and transactions.
              </Text>
            </View>

            <View className="mt-8 gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-ink">Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#6b7280"
                  value={email}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-base text-ink"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-ink">
                  Password
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="password"
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={password}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-base text-ink"
                />
              </View>

              {errorMessage ? (
                <Text selectable className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
                  {errorMessage}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isDisabled}
                onPress={handlePasswordLogin}
                className={`rounded-2xl px-4 py-4 ${
                  isDisabled ? "bg-primary/50" : "bg-primary"
                }`}
              >
                <Text className="text-center text-base font-bold text-white">
                  {isPasswordLoading ? "Signing in..." : "Log in"}
                </Text>
              </Pressable>

              <View className="flex-row items-center gap-3">
                <View className="h-px flex-1 bg-black/10" />
                <Text className="text-xs font-semibold uppercase tracking-[3px] text-ink/50">
                  Or
                </Text>
                <View className="h-px flex-1 bg-black/10" />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isPasswordLoading || isGoogleLoading}
                onPress={handleGoogleLogin}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-4"
              >
                <Text className="text-center text-base font-bold text-ink">
                  {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
