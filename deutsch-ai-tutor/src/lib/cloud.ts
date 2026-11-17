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
  return !error;
}
