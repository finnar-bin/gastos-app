import { Eye, EyeOff, Globe } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { Redirect, Stack, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { signInWithGoogle, signInWithPassword } from "@/src/lib/auth-requests";
import { getAuthRedirectUrl } from "@/src/lib/auth-utils";
import { useSession } from "@/src/providers/SessionProvider";
import { Button } from "@/src/ui/Button";
import { TextField } from "@/src/ui/TextField";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      const redirectTo = getAuthRedirectUrl();

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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
        >
          <View className="flex-1 items-center justify-center px-6 py-10">
            <View className="w-full max-w-[440px] rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <View className="gap-1">
                <Text className="text-4xl font-bold tracking-[8px] uppercase  text-primary text-center">
                  Gastos
                </Text>
                <Text className="text-base leading-6 text-ink/70 text-center">
                  Finance tracking made easy
                </Text>
              </View>

              <View className="mt-8 gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-ink">Email</Text>
                  <TextField
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#6b7280"
                    value={email}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-ink">
                    Password
                  </Text>
                  <View className="relative">
                    <TextField
                      autoCapitalize="none"
                      autoComplete="password"
                      onChangeText={setPassword}
                      placeholder="Your password"
                      placeholderTextColor="#6b7280"
                      secureTextEntry={!isPasswordVisible}
                      value={password}
                      className="pr-12"
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      hitSlop={8}
                      onPress={() => setIsPasswordVisible((value) => !value)}
                      className="absolute bottom-0 right-4 top-0 justify-center"
                    >
                      {isPasswordVisible ? (
                        <EyeOff size={18} color="#6b7280" />
                      ) : (
                        <Eye size={18} color="#6b7280" />
                      )}
                    </Pressable>
                  </View>
                </View>

                {errorMessage ? (
                  <Text
                    selectable
                    className="rounded-2xl bg-danger/10 p-4 text-sm text-danger"
                  >
                    {errorMessage}
                  </Text>
                ) : null}

                <Button
                  disabled={isDisabled}
                  isLoading={isPasswordLoading}
                  onPress={handlePasswordLogin}
                  size="lg"
                  variant="primary"
                  label={isPasswordLoading ? "Signing in..." : "Log in"}
                />

                <View className="flex-row items-center gap-3">
                  <View className="h-px flex-1 bg-black/10" />
                  <Text className="text-xs font-semibold uppercase tracking-[3px] text-ink/50">
                    Or
                  </Text>
                  <View className="h-px flex-1 bg-black/10" />
                </View>

                <Button
                  disabled={isPasswordLoading || isGoogleLoading}
                  isLoading={isGoogleLoading}
                  onPress={handleGoogleLogin}
                  size="lg"
                  variant="outline"
                >
                  <Text className="text-base font-bold text-ink">
                    {isGoogleLoading
                      ? "Opening Google..."
                      : "Continue with Google"}
                  </Text>
                </Button>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.replace("/(auth)/signup")}
                  className="items-center py-1"
                >
                  <Text className="text-sm text-ink/70">
                    No account yet?{" "}
                    <Text className="font-semibold text-primary">Sign up</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
