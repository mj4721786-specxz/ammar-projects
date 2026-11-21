import { useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

function arabicAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "البريد أو كلمة السر غير صحيحة.";
  if (m.includes("already registered")) return "هذا البريد مسجّل. اختر «لدي حساب» وسجّل الدخول.";
  if (m.includes("password") && m.includes("6")) return "كلمة السر قصيرة. استخدم 6 أحرف على الأقل.";
  if (m.includes("email not confirmed")) return "أكّد بريدك من الرسالة التي وصلتك، ثم سجّل الدخول.";
  if (m.includes("rate limit")) return "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.";
  return "تعذر تنفيذ الطلب. تحقق من البيانات وحاول مرة أخرى.";
}

export default function Account({ user, sync }: { user: User | null; sync: "idle" | "saving" | "saved" | "error" }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!supabase) return null;

  if (user) {
    const label = sync === "saving" ? "يحفظ…" : sync === "error" ? "تعذر الحفظ" : "تقدمك محفوظ في حسابك";
    return (
      <div className="account">
        <span className="account-mail" dir="ltr">{user.email}</span>
        <span className="account-sync" data-state={sync}>{label}</span>
        <button type="button" className="link" onClick={() => void supabase!.auth.signOut()}>خروج</button>
      </div>
    );
  }

  const google = async () => {
    setMsg(null);
    const { error } = await supabase!.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (error) setMsg("تسجيل الدخول بحساب Google غير مفعّل بعد. استخدم البريد الآن.");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const { data, error } =
      mode === "in"
        ? await supabase!.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase!.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (error) return setMsg(arabicAuthError(error.message));
    if (mode === "up" && !data.session) setMsg("أرسلنا رسالة تأكيد إلى بريدك. افتحها ثم سجّل الدخول.");
    else setOpen(false);
  };

  return (
    <div className="account">
      {!open ? (
        <button type="button" className="link" onClick={() => setOpen(true)}>
          سجّل الدخول لحفظ تقدمك على كل أجهزتك
        </button>
      ) : (
        <form className="authform" onSubmit={submit}>
          <button type="button" className="send google" onClick={() => void google()}>
            الدخول بحساب Google
          </button>
          <span className="or">أو بالبريد</span>
          <input type="email" dir="ltr" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required aria-label="البريد الإلكتروني" />
          <input type="password" dir="ltr" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} minLength={6} required aria-label="كلمة السر" />
          <div className="authrow">
            <button type="submit" className="send" disabled={busy}>{mode === "in" ? "دخول" : "إنشاء حساب"}</button>
            <button type="button" className="link" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}>
              {mode === "in" ? "ليس لدي حساب" : "لدي حساب"}
            </button>
            <button type="button" className="link" onClick={() => setOpen(false)}>إلغاء</button>
          </div>
          {msg && <p className="note err" role="alert">{msg}</p>}
        </form>
      )}
    </div>
  );
}
