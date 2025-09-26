// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/users?search=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchRaw = searchParams.get("search") || "";
    const search = searchRaw.trim(); // ลบช่องว่างก่อน/หลัง

    let query = supabase
      .from("dd_user")
      .select("personal_id, firstname, lastname, email, phone, role")
      .eq("role", "user")
      .order("firstname", { ascending: true });

    // ถ้ามีคำค้นหา → filter (partial match)
    if (search) {
      query = query.or(
        `personal_id.ilike.%${search}%,firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
