import { supabase } from "./supabase";
import type { Session } from "../types";

export async function loadCloudProgress(userId: string): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("progress")
    .select("step,in_lesson,finished,last_turn,history")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    step: data.step,
    inLesson: data.in_lesson,
    done: data.finished,
    last: data.last_turn ?? null,
    history: Array.isArray(data.history) ? data.history : [],
  };
}

export async function saveCloudProgress(userId: string, s: Session): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("progress").upsert({
    user_id: userId,
    step: s.step,
    in_lesson: s.inLesson,
    finished: s.done,
    last_turn: s.last,
    history: s.history.slice(-24),
    last_study_day: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString(),
  });
  if (error) return false;
  void supabase.rpc("touch_study_day"); // keeps the day streak
  return true;
}

export async function loadStreak(userId: string): Promise<number> {
  if (!supabase) return 0;
  const { data } = await supabase.from("progress").select("streak,last_study_day").eq("user_id", userId).maybeSingle();
  if (!data) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return data.last_study_day === today || data.last_study_day === yesterday ? data.streak : 0;
}

export interface Word { german: string; arabic: string }

export async function loadCloudWords(userId: string): Promise<Word[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("saved_words").select("german,arabic").eq("user_id", userId).order("created_at", { ascending: false });
  return data ?? [];
}

export async function addCloudWord(userId: string, w: Word): Promise<void> {
  await supabase?.from("saved_words").upsert({ user_id: userId, german: w.german, arabic: w.arabic }, { onConflict: "user_id,german" });
}

export async function deleteCloudWord(userId: string, german: string): Promise<void> {
  await supabase?.from("saved_words").delete().eq("user_id", userId).eq("german", german);
}
