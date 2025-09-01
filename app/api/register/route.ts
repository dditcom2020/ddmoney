import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = form.get("username");
  const password = form.get("password");
  const email = form.get("email");
  const file = form.get("file"); // File | null

  // ⭐ Debug log ดูค่าที่ส่งมาจริง
  console.log("username:", username);
  console.log("password:", password);
  console.log("email:", email);
  console.log("file:", file);

  // TODO: insert DB
  return NextResponse.json({ ok: true, message: "สมัครสมาชิกสำเร็จ" });
}
