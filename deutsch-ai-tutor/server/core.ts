// Framework-independent tutor logic, shared by the Express server (Replit / local)
// and the Vercel serverless functions in /api.
import Anthropic from "@anthropic-ai/sdk";
import { LESSONS } from "./curriculum.js";
import { buildSystemPrompt } from "./prompt.js";
import { demoReply, type TutorReply } from "./demo.js";

type Role = "user" | "assistant";
interface Turn { role: Role; content: string }

export interface CoreResult { status: number; body: unknown }

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 40;
const API_KEY = (process.env.ANTHROPIC_API_KEY || "").trim();

// The key lives only on the server. It is never sent to the browser.
const client = API_KEY ? new Anthropic({ apiKey: API_KEY }) : null;

/* Simple per-IP rate limit (in memory: per server instance, best effort). */
const hits = new Map<string, number[]>();
export function limited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export const fail = (status: number, code: string, message: string): CoreResult => ({
  status,
  body: { error: { code, message } },
});

function clampInt(v: unknown, min: number, max: number): number {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

function sanitizeHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  const out: Turn[] = [];
  for (const t of raw.slice(-12)) {
    if (!t || (t.role !== "user" && t.role !== "assistant") || typeof t.content !== "string") continue;
    const content = t.content.trim().slice(0, 500);
    if (content) out.push({ role: t.role, content });
  }
  return out;
}

function parseJoke(v: unknown): { german: string; arabic: string } | null {
  if (!v || typeof v !== "object") return null;
  const j = v as Record<string, unknown>;
  const g = typeof j.german === "string" ? j.german.trim().slice(0, 160) : "";
  const a = typeof j.arabic === "string" ? j.arabic.trim().slice(0, 160) : "";
  return g && a ? { german: g, arabic: a } : null;
}

function parseReply(text: string): TutorReply {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no_json");
  const o = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const german = str(o.german);
  if (!german) throw new Error("no_german");
  return {
    german,
    arabic: str(o.arabic) ?? "",
    correction: str(o.correction),
    pronunciationTip: str(o.pronunciationTip),
    advance: o.advance === true,
    joke: parseJoke(o.joke),
  };
}

export function statusBody() {
  return { live: Boolean(client), lessons: LESSONS.map((l) => ({ title: l.titleAr, level: l.level })) };
}

const SB_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
const SB_KEY = (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "").trim();
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT) || 30;

/**
 * Counts one AI message for a signed-in user, using the user's own token (no service key needed).
 * Returns "blocked" when today's limit is reached, otherwise "ok" (also for guests / if the database is unreachable).
 */
async function checkDailyLimit(token: string | null): Promise<"ok" | "blocked"> {
  if (!token || !SB_URL || !SB_KEY) return "ok";
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/bump_daily_usage`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ max_messages: DAILY_LIMIT }),
    });
    if (!r.ok) return "ok";
    const rows = (await r.json()) as Array<{ allowed?: boolean }>;
    return rows?.[0]?.allowed === false ? "blocked" : "ok";
  } catch {
    return "ok";
  }
}

export async function chat(rawBody: unknown, ip: string, token: string | null = null): Promise<CoreResult> {
  if (limited(ip)) {
    return fail(429, "rate_limited", "وصلت إلى حد الطلبات مؤقتًا. انتظر بضع دقائق ثم تابع.");
  }

  const body = (rawBody ?? {}) as Record<string, unknown>;
  const step = clampInt(body.step, 0, LESSONS.length - 1);
  const history = sanitizeHistory(body.history);
  const userText = typeof body.userText === "string" ? body.userText.trim().slice(0, 300) : "";

  if (!client) {
    const userTurns = history.filter((t) => t.role === "user").length + (userText ? 1 : 0);
    return { status: 200, body: { ...demoReply(userTurns), demo: true } };
  }

  if ((await checkDailyLimit(token)) === "blocked") {
    return fail(429, "daily_limit", "وصلت إلى الحد اليومي من الرسائل. عد غدًا لتكمل الدرس، وتقدمك محفوظ.");
  }

  const messages: Turn[] = [...history];
  if (userText) messages.push({ role: "user", content: userText });
  if (!messages.length || messages[0].role === "assistant") {
    messages.unshift({ role: "user", content: "[The learner just opened the lesson. Greet them and begin.]" });
  }
  if (messages[messages.length - 1].role === "assistant") {
    messages.push({ role: "user", content: "[Please say your last message again in a slightly different way.]" });
  }

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: buildSystemPrompt(step),
      messages,
    });
    const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return { status: 200, body: { ...parseReply(text), demo: false } };
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      const s = err.status ?? 500;
      if (s === 401 || s === 403) return fail(502, "bad_key", "مفتاح الذكاء الاصطناعي غير صالح. راجع قيمة ANTHROPIC_API_KEY في إعدادات الخادم.");
      if (s === 429) return fail(429, "provider_rate_limit", "خدمة الذكاء الاصطناعي مزدحمة أو بلغت حدها. حاول بعد قليل.");
      if (s === 402) return fail(502, "billing", "رصيد حساب الذكاء الاصطناعي غير كافٍ. راجع الفوترة في لوحة Anthropic.");
      return fail(502, "provider_error", "تعذر الاتصال بخدمة الذكاء الاصطناعي الآن. حاول مرة أخرى.");
    }
    if (err instanceof SyntaxError || (err instanceof Error && err.message.startsWith("no_"))) {
      return fail(502, "bad_reply", "وصل رد غير مفهوم من المعلمة. اضغط وحاول مرة أخرى.");
    }
    console.error("chat error:", err instanceof Error ? err.message : err);
    return fail(500, "server_error", "حدث خطأ في الخادم. حاول مرة أخرى.");
  }
}

export const MODEL_NAME = MODEL;
export const LIVE = Boolean(client);
