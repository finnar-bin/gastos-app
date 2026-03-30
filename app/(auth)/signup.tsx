import { AntDesign } from "@expo/vector-icons";
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

import { signUpWithPassword } from "@/src/lib/auth-requests";
import { getAuthRedirectUrl, sanitizeDisplayName } from "@/src/lib/auth-utils";
import { useSession } from "@/src/providers/session-provider";
import { Button } from "@/src/ui/button";
import { TextField } from "@/src/ui/text-field";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type FieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
};

function validateForm({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}) {
  const errors: FieldErrors = {};

  const cleanedDisplayName = sanitizeDisplayName(displayName);
  if (!cleanedDisplayName) {
    errors.displayName = "Display name is required.";
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return {
    errors,
    cleanedDisplayName,
    normalizedEmail,
  };
}

export default function SignUpScreen() {
  const { session } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (session) {
    return <Redirect href="/(app)" />;
  }

  const isDisabled =
    isLoading ||
    !displayName.trim() ||
    !email.trim() ||
    !password.trim();

  const handleSignUp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const { errors, cleanedDisplayName, normalizedEmail } = validateForm({
      displayName,
      email,
      password,
    });

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const emailRedirectTo = getAuthRedirectUrl();

      await signUpWithPassword({
        displayName: cleanedDisplayName,
        email: normalizedEmail,
        password,
        emailRedirectTo,
      });

      setDisplayName(cleanedDisplayName);
      setEmail(normalizedEmail);
      setPassword("");

      setSuccessMessage(
        "Account created. Please check your email and verify your account before logging in.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign Up" }} />
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
                  Create your account
                </Text>
              </View>

              <View className="mt-8 gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-ink">
                    Display name
                  </Text>
                  <TextField
                    autoCapitalize="words"
                    autoComplete="name"
                    onChangeText={(value) => {
                      setDisplayName(value);
                      if (fieldErrors.displayName) {
                        setFieldErrors((previous) => ({
                          ...previous,
                          displayName: undefined,
                        }));
                      }
                    }}
                    onBlur={() => setDisplayName((value) => sanitizeDisplayName(value))}
                    placeholder="Your name"
                    placeholderTextColor="#6b7280"
                    value={displayName}
                  />
                  {fieldErrors.displayName ? (
                    <Text className="text-sm text-danger">{fieldErrors.displayName}</Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-ink">Email</Text>
                  <TextField
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={(value) => {
                      setEmail(value);
                      if (fieldErrors.email) {
                        setFieldErrors((previous) => ({
                          ...previous,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor="#6b7280"
                    value={email}
                  />
                  {fieldErrors.email ? (
                    <Text className="text-sm text-danger">{fieldErrors.email}</Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-ink">
                    Password
                  </Text>
                  <View className="relative">
                    <TextField
                      autoCapitalize="none"
                      autoComplete="new-password"
                      onChangeText={(value) => {
                        setPassword(value);
                        if (fieldErrors.password) {
                          setFieldErrors((previous) => ({
                            ...previous,
                            password: undefined,
                          }));
                        }
                      }}
                      placeholder="At least 6 characters"
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
                      <AntDesign
                        name={isPasswordVisible ? "eye" : "eye-invisible"}
                        size={18}
                        color="#6b7280"
                      />
                    </Pressable>
                  </View>
                  {fieldErrors.password ? (
                    <Text className="text-sm text-danger">{fieldErrors.password}</Text>
                  ) : null}
                </View>

                {errorMessage ? (
                  <Text
                    selectable
                    className="rounded-2xl bg-danger/10 p-4 text-sm text-danger"
                  >
                    {errorMessage}
                  </Text>
                ) : null}

                {successMessage ? (
                  <Text className="rounded-2xl bg-primary/10 p-4 text-sm text-primary">
                    {successMessage}
                  </Text>
                ) : null}

                <Button
                  disabled={isDisabled}
                  isLoading={isLoading}
                  onPress={handleSignUp}
                  size="lg"
                  variant="primary"
                  label={isLoading ? "Creating account..." : "Sign up"}
                />

                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.replace("/(auth)/login")}
                  className="items-center py-1"
                >
                  <Text className="text-sm text-ink/70">
                    Already have an account? <Text className="font-semibold text-primary">Log in</Text>
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
