import { md5 } from "@/src/utils/md5";

export function getGravatarUrl(email: string, size = 64) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const hash = md5(normalizedEmail);
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=${size}`;
}
