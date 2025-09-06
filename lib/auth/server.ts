// lib/auth/server.ts
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

const COOKIE_NAME = "session_id";

export interface SessionUser {
  personal_id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string;
  images: string | null;
  role: "user" | "admin";            // ✅ เพิ่ม role ให้ชัดเจน
}

export interface SessionRow {
  session_id: string;
  personal_id: string;
  expires_at: string;                 // ISO string
}

/** ผลลัพธ์แบบ discriminated union (ไม่ใช้ null) */
export type GetValidSessionResult =
  | { ok: true; session: SessionRow; user: SessionUser }
  | { ok: false };

/** ดึง/ยืนยัน session + โหลดข้อมูลผู้ใช้ */
export async function getValidSession(): Promise<GetValidSessionResult> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return { ok: false };

  // ตรวจว่ามีแถว session และยังไม่หมดอายุ
  const { data: sessionRow, error: sErr } = await supabaseAdmin
    .from("sessions")
    .select("session_id, personal_id, expires_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (sErr || !sessionRow) return { ok: false };

  const now = Date.now();
  const exp = new Date(sessionRow.expires_at).getTime();
  if (!Number.isFinite(exp) || exp <= now) {
    // หมดอายุแล้ว → ลบคุกกี้ฝั่งเซิร์ฟเวอร์
    cookieStore.delete(COOKIE_NAME);
    return { ok: false };
  }

  // โหลดข้อมูลผู้ใช้ (+ role)
  const { data: user, error: uErr } = await supabaseAdmin
    .from("dd_user")
    .select("personal_id, firstname, lastname, email, phone, images, role")
    .eq("personal_id", sessionRow.personal_id)
    .single();

  if (uErr || !user) return { ok: false };

  // แปลง role ให้เป็น literal ที่เรายอมรับเท่านั้น
  const safeRole = user.role === "admin" ? "admin" : "user";

  return {
    ok: true,
    session: sessionRow,
    user: {
      personal_id: user.personal_id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      images: user.images,
      role: safeRole,
    },
  };
}

/** ใช้ใน API/Page ที่ต้อง “ล็อกอินแล้วเท่านั้น” */
export async function requireAuth():
  Promise<{ ok: true; status: 200; user: SessionUser } | { ok: false; status: 401 }> {
  const result = await getValidSession();
  if (!result.ok) return { ok: false, status: 401 };
  return { ok: true, status: 200, user: result.user };
}

/** ใช้ใน API/Page ที่ต้องมี role เฉพาะ เช่น admin */
export async function requireRole(role: "user" | "admin"):
  Promise<
    | { ok: true; status: 200; user: SessionUser }
    | { ok: false; status: 401 | 403 }
  > {
  const result = await getValidSession();
  if (!result.ok) return { ok: false, status: 401 };     // ยังไม่ล็อกอิน
  if (result.user.role !== role) return { ok: false, status: 403 }; // สิทธิ์ไม่พอ
  return { ok: true, status: 200, user: result.user };
}
