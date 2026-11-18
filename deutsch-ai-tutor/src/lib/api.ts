import type { ChatReply, Status, Turn } from "../types";
import { supabase } from "./supabase";

export class ApiError extends Error {}

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    if (data.error?.message) return data.error.message;
  } catch {
    /* not JSON */
  }
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

export async function fetchStatus(): Promise<Status> {
  const res = await fetch("/api/status");
  if (!res.ok) throw new ApiError(await readError(res));
  return (await res.json()) as Status;
}

export async function sendChat(
  payload: { history: Turn[]; step: number; userText: string },
  signal: AbortSignal,
): Promise<ChatReply> {
  let res: Response;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    /* guest */
  }
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ApiError("تعذر الوصول إلى الخادم. تحقق من الاتصال بالإنترنت.");
  }
  if (!res.ok) throw new ApiError(await readError(res));
  return (await res.json()) as ChatReply;
}
