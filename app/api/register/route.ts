// app/api/register/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const BUCKET = "images";

export async function POST(req: Request) {
  const errorId = crypto.randomUUID();

  try {
    // ต้องเป็น multipart/form-data
    const ct = req.headers.get("content-type") || "";
    if (!ct.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, message: "ต้องส่งเป็น multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const citizenId = String(form.get("citizenId") ?? "");
    const firstName = String(form.get("firstName") ?? "");
    const lastName  = form.get("lastName") == null ? "" : String(form.get("lastName"));
    const password  = String(form.get("password") ?? "");
    const email     = String(form.get("email") ?? "").trim().toLowerCase();
    const phone     = String(form.get("phone") ?? "");
    const file      = form.get("file");

    // ดึงเฉพาะตัวเลข; ถ้าไม่มีตัวเลข → ตอบ 400 ชัดเจน (คอลัมน์ใน DB เป็น NOT NULL)
    const pidDigits   = (citizenId.match(/\d+/g) || []).join("");
    const phoneDigits = (phone.match(/\d+/g) || []).join("");
    if (!pidDigits || !phoneDigits || !firstName || !password || !email) {
      return NextResponse.json(
        { ok: false, message: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    const personalIdNum = Number(pidDigits);
    const phoneNum      = Number(phoneDigits);

    // ตรวจซ้ำ (ถ้ามีอะไรมาก็เช็ค)
    const { data: dup, error: dupErr } = await supabaseAdmin
      .from("dd_user")
      .select("personal_id, email, phone")
      .or(`personal_id.eq.${personalIdNum},email.eq.${email},phone.eq.${phoneNum}`)
      .limit(1)
      .maybeSingle();

    if (dupErr) {
      console.error(`[${errorId}] duplicate check error:`, dupErr);
      return NextResponse.json(
        { ok: false, message: "ไม่สามารถตรวจสอบผู้ใช้ซ้ำได้", errorId },
        { status: 500 }
      );
    }

    if (dup) {
      const fields: string[] = [];
      if (String(dup.personal_id) === String(personalIdNum)) fields.push("citizenId");
      if (String(dup.email).toLowerCase() === email) fields.push("email");
      if (Number(dup.phone) === phoneNum) fields.push("phone");
      return NextResponse.json(
        { ok: false, message: "ข้อมูลซ้ำในระบบ", duplicate: fields },
        { status: 409 }
      );
    }

    // อัปโหลดรูป (ถ้ามี) — เก็บ "path" (key) ลงคอลัมน์ images
    let imagePath: string | null = null;
    if (file instanceof File) {
      try {
        const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
        const key = `profiles/${crypto.randomUUID()}.${ext}`;
        const ab  = await file.arrayBuffer();

        const { error: upErr } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(key, new Uint8Array(ab), {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (upErr) {
          console.error(`[${errorId}] upload error:`, upErr);
        } else {
          imagePath = key; // <— เก็บเฉพาะ path ใน DB
        }
      } catch (uploadErr) {
        console.error(`[${errorId}] upload exception:`, uploadErr);
      }
    }

    // แฮชรหัสผ่าน
    const passwordHash = await bcrypt.hash(password, 12);

    // insert ให้ตรง schema
    const row = {
      personal_id: personalIdNum,
      firstname: firstName,
      password:  passwordHash,
      email,
      phone:     phoneNum,
      lastname:  lastName || null,
      images:    imagePath,
    };

    const { error: insertErr } = await supabaseAdmin.from("dd_user").insert(row);
    if (insertErr) {
      console.error(`[${errorId}] db insert error:`, insertErr);
      return NextResponse.json(
        { ok: false, message: "บันทึกข้อมูลไม่สำเร็จ", errorId },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, message: "สมัครสมาชิกสำเร็จ" });
  } catch (e) {
    console.error(`[${errorId}] handler error:`, e);
    return NextResponse.json(
      { ok: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", errorId },
      { status: 500 }
    );
  }
}
