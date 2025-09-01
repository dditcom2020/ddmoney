import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = form.get("username");
  const email    = form.get("email");
  const password = String(form.get("password") ?? "");

  // แปลง identifier: ถ้าส่ง email มาก็ใช้ email, ถ้าส่ง username มาก็ใช้ username
  const identifier =
    (typeof email === "string" && email) ||
    (typeof username === "string" && username) ||
    "";

  console.log("[LOGIN]", { identifier });

  if (!identifier || !password) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  // TODO: ตรวจสอบรหัสผ่าน / สร้าง session / ออก token
  return NextResponse.json({ ok: true, token: "fake-jwt" });
}
