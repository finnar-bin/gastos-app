const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function invariant(value: string | undefined, label: string) {
  if (!value) {
    throw new Error(
      `Missing ${label}. Add it to your Expo env configuration before starting the app.`,
    );
  }

  return value;
}

export const env = {
  supabaseUrl: invariant(supabaseUrl, "EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: invariant(supabaseAnonKey, "EXPO_PUBLIC_SUPABASE_ANON_KEY"),
};
