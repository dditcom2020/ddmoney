// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

export async function POST(req: Request) {
  const errorId = crypto.randomUUID();

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

    // ✅ ตรวจแค่ความยาวรหัสผ่าน ≥ 8
    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }

    const personalIdNum = Number(personalIdDigits);

    // --- ดึงผู้ใช้จากตาราง dd_user ---
    const { data: user, error: selErr } = await supabaseAdmin
      .from("dd_user")
      .select("personal_id, password, firstname, lastname, email, phone, images")
      .eq("personal_id", personalIdNum)
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

    // ✅ สำเร็จ
    return NextResponse.json({
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
  } catch (err) {
    console.error(`[${errorId}] /api/login error:`, err);
    return NextResponse.json(
      { ok: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", errorId },
      { status: 500 }
    );
  }
}
