// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const COOKIE_NAME = "session_id";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_BASE = {
  httpOnly: true as const,
  path: "/" as const,
  sameSite: "lax" as const, // ต้องตรงกับตอนตั้งค่า
  secure: isProd,
  // ถ้าตอนตั้งคุกกี้มี domain ให้เติม domain เดิมด้วย
  // domain: "your-domain.com" as const,
};

export async function POST() {
  // CSRF hardening เบื้องต้น: ต้องเป็น same-origin และมี header เฉพาะ
  const h = await headers();
  const origin = h.get("origin") ?? "";
  const host = h.get("host") ?? "";
  const xrw = h.get("x-requested-with") ?? "";
  if ((origin && !origin.includes(host)) || xrw.toLowerCase() !== "logout") {
    return NextResponse.json({ ok: false, message: "Invalid origin" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;

  try {
    if (sid) {
      // ถ้าใน DB เก็บเป็นแฮช ให้แฮช sid ก่อนลบ
      await supabaseAdmin.from("sessions").delete().eq("session_id", sid);
    }

    const res = NextResponse.json({ ok: true, message: "logged out" });
    res.headers.set("Cache-Control", "no-store");

    // เคลียร์คุกกี้ให้แน่ใจ (บางเบราว์เซอร์ชอบงอแง)
    res.cookies.set({
      name: COOKIE_NAME,
      value: "",
      ...COOKIE_BASE,
      maxAge: 0,
    });
    res.cookies.set({
      name: COOKIE_NAME,
      value: "",
      ...COOKIE_BASE,
      expires: new Date(0),
    });

    // DEV: ถ้าอยากล้างให้เกลี้ยง (cookies + storage อื่น ๆ)
    // if (!isProd) res.headers.set("Clear-Site-Data", '"cookies", "storage"');

    return res;
  } catch (e) {
    // ไม่ควรเผย error รายละเอียดกับ client ในที่นี้
    const res = NextResponse.json({ ok: false, message: "logout failed" }, { status: 500 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}

// เผื่อบาง client ยิง preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Allow": "POST, OPTIONS",
      "Cache-Control": "no-store",
    },
  });
}
