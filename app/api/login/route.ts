// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

// ====== อายุเซสชัน ======
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 วัน
const COOKIE_NAME = "session_id";

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

function getClientIP(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff && xff.length > 0) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    null
  );
}

export async function POST(req: Request) {
  const errorId = randomUUID();

  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();

    // รองรับทั้ง multipart/form-data และ application/json
    let personalIdRaw = "";
    let password = "";

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      personalIdRaw = String(form.get("personal_id") ?? "");
      password = String(form.get("password") ?? "");
    } else if (ct.includes("application/json")) {
      const body = await req.json();
      personalIdRaw = String(body?.personal_id ?? "");
      password = String(body?.password ?? "");
    } else {
      return NextResponse.json(
        { ok: false, message: "ต้องส่งเป็น multipart/form-data หรือ application/json" },
        { status: 400 }
      );
    }

    // --- sanitize + validate ---
    const personalIdDigits = onlyDigits(personalIdRaw).slice(0, 13);
    if (!/^\d{13}$/.test(personalIdDigits)) {
      return NextResponse.json(
        { ok: false, message: "เลขบัตรประชาชนไม่ถูกต้อง (ต้องเป็นตัวเลข 13 หลัก)" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }

    // --- ดึงผู้ใช้จากตาราง dd_user (ตอนนี้ personal_id เป็น TEXT) ---
    const { data: user, error: selErr } = await supabaseAdmin
      .from("dd_user")
      .select("personal_id, password, firstname, lastname, email, phone, images")
      .eq("personal_id", personalIdDigits) // <-- ใช้สตริงตรง ๆ
      .single();

    if (selErr || !user) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบบัญชีผู้ใช้หรือข้อมูลไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // --- ตรวจ bcrypt ---
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { ok: false, message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ====== สร้าง session และบันทึกลง DB ======
    const sessionId = randomUUID(); // ค่า uuid ที่จะเก็บลงตาราง
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const ua = req.headers.get("user-agent") || null;
    const ip = getClientIP(req);

    const { error: insErr } = await supabaseAdmin
      .from("sessions")
      .insert([
        {
          session_id: sessionId,                 // uuid (ตาม schema เดิมของตาราง sessions)
          personal_id: user.personal_id,         // <-- ตอนนี้เป็น TEXT
          expires_at: expiresAt.toISOString(),
          user_agent: ua,
          ip,
        },
      ]);

    if (insErr) {
      console.error(`[${errorId}] insert session error:`, insErr);
      return NextResponse.json(
        { ok: false, message: "สร้างเซสชันไม่สำเร็จ", errorId },
        { status: 500 }
      );
    }

    // ====== ตอบกลับพร้อมตั้งคุกกี้แบบ HttpOnly ======
    const res = NextResponse.json({
      ok: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        personal_id: user.personal_id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        images: user.images,
      },
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });

    return res;
  } catch (err) {
    console.error(`[${errorId}] /api/login error:`, err);
    return NextResponse.json(
      { ok: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", errorId },
      { status: 500 }
    );
  }
}
