// app/api/admin/stats/members/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ฝั่ง server เท่านั้น
);

export async function GET() {
  try {
    const { count, error } = await supabase
      .from("dd_user")
      .select("*", { head: true, count: "exact" })
      .eq("role", "user"); // นับเฉพาะสมาชิกทั่วไป

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ total: count ?? 0 }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
