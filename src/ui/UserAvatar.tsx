import { useEffect, useMemo, useState } from "react";
import { Image, Text, View } from "react-native";

import { getGravatarUrl } from "@/src/utils/get-gravatar-url";

type UserAvatarProps = {
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
  size?: number;
};

type AvatarSource = "profile" | "gravatar" | "initial";

function toInitial(name: string | null) {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    return "?";
  }

  return trimmedName.charAt(0).toUpperCase();
}

export function UserAvatar({
  name,
  avatarUrl,
  email,
  size = 22,
}: UserAvatarProps) {
  const gravatarUrl = useMemo(
    () => (email ? getGravatarUrl(email, Math.max(64, size * 2)) : null),
    [email, size],
  );

  const [source, setSource] = useState<AvatarSource>(() => {
    if (avatarUrl) {
      return "profile";
    }

    if (gravatarUrl) {
      return "gravatar";
    }

    return "initial";
  });

  useEffect(() => {
    if (avatarUrl) {
      setSource("profile");
      return;
    }

    if (gravatarUrl) {
      setSource("gravatar");
      return;
    }

    setSource("initial");
  }, [avatarUrl, gravatarUrl]);

  const currentImageUrl =
    source === "profile"
      ? avatarUrl
      : source === "gravatar"
        ? gravatarUrl
        : null;

  if (!currentImageUrl) {
    return (
      <View
        style={{ width: size, height: size }}
        className="items-center justify-center rounded-full bg-ink/10"
      >
        <Text className="text-xs font-semibold text-ink/70">{toInitial(name)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: currentImageUrl }}
      onError={() => {
        if (source === "profile" && gravatarUrl) {
          setSource("gravatar");
          return;
        }

        setSource("initial");
      }}
      style={{ width: size, height: size }}
      className="rounded-full bg-ink/10"
    />
  );
}
