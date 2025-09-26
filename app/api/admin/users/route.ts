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
    const search = searchRaw.trim();

    let query = supabase
      .from("dd_user")
      .select("personal_id, firstname, lastname, email, phone, role")
      .eq("role", "user")
      .order("firstname", { ascending: true });

    if (search) {
      query = query.or(
        `personal_id.ilike.%${search}%,firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data ?? [] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// PUT /api/admin/users/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    const { firstname, lastname, email, phone } = body;

    if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    // ตรวจสอบ email ซ้ำ
    const { data: emailData, error: emailError } = await supabase
      .from("dd_user")
      .select("personal_id")
      .eq("email", email)
      .neq("personal_id", id);

    if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 });
    if (emailData && emailData.length > 0) {
      return NextResponse.json({ error: "มีผู้ใช้งานอีเมล์นี้แล้ว" }, { status: 400 });
    }

    // ตรวจสอบ phone ซ้ำ
    const { data: phoneData, error: phoneError } = await supabase
      .from("dd_user")
      .select("personal_id")
      .eq("phone", phone)
      .neq("personal_id", id);

    if (phoneError) return NextResponse.json({ error: phoneError.message }, { status: 500 });
    if (phoneData && phoneData.length > 0) {
      return NextResponse.json({ error: "มีผู้ใช้งานเบอร์โทรนี้แล้ว" }, { status: 400 });
    }

    // อัปเดตข้อมูล
    const { data, error } = await supabase
      .from("dd_user")
      .update({ firstname, lastname, email, phone })
      .eq("personal_id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "อัปเดตสำเร็จ", user: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { error } = await supabase.from("dd_user").delete().eq("personal_id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
