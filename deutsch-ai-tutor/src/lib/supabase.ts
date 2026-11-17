import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Null when the site runs without a database (guest mode only). The publishable key is safe in the browser. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
