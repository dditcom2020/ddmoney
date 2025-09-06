// lib/auth/refresh.ts
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

const COOKIE_NAME = "session_id";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 วัน
const SLIDING_THRESHOLD_MS = 6 * 60 * 60 * 1000; // ถ้าเหลือน้อยกว่า 6 ชม. ค่อยยืด

export async function maybeRefreshSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return;

  const { data: s } = await supabaseAdmin
    .from("sessions")
    .select("session_id, expires_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!s) return;

  const now = Date.now();
  const exp = new Date(s.expires_at).getTime();

  if (exp - now < SLIDING_THRESHOLD_MS) {
    const newExp = new Date(now + SESSION_TTL_MS).toISOString();
    await supabaseAdmin
      .from("sessions")
      .update({ expires_at: newExp })
      .eq("session_id", sessionId);

    // ต่ออายุคุกกี้ด้วย
    cookieStore.set({
      name: COOKIE_NAME,
      value: sessionId,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });
  }
}
