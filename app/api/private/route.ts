// app/api/private/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: "ต้องล็อกอินก่อน" }, { status: 401 });
  }

  // ถึงตรงนี้การันตีมีผู้ใช้แล้ว
  return NextResponse.json({
    ok: true,
    message: "ข้อมูลลับของผู้ใช้",
    user: auth.user,
  });
}
