// app/api/admin/online/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ service role เพื่อ query
    );

    // ดึง session ที่ยัง active
    const { data, error } = await supabase
      .from("sessions")
      .select("personal_id")
      .gt("expires_at", new Date().toISOString());

    if (error) throw error;

    // ลบซ้ำ personal_id เพื่อให้นับเฉพาะ unique
    const onlineCount = new Set(data.map((s) => s.personal_id)).size;

    return NextResponse.json({ online: onlineCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ online: 0 }, { status: 500 });
  }
}
