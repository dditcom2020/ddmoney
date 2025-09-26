// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface User {
  personal_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
}

interface Params {
  id: string;
}

// helper: get id from params
async function getId(params: Record<string, string | string[]> | Promise<Record<string, string | string[]>>): Promise<string> {
  const resolved = params instanceof Promise ? await params : params;
  const id = resolved.id;
  if (Array.isArray(id)) return id[0]; // handle array if route contains multiple segments
  return id;
}

// GET /api/admin/users/:id
export async function GET(req: NextRequest, context: { params: Record<string, string | string[]> }) {
  try {
    const id = await getId(context.params);

    const { data, error } = await supabase
      .from<User>("dd_user")
      .select("personal_id, firstname, lastname, email, phone, role")
      .eq("personal_id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// PUT /api/admin/users/:id
export async function PUT(req: NextRequest, context: { params: Record<string, string | string[]> }) {
  try {
    const id = await getId(context.params);
    const body = await req.json() as Partial<User>;

    const { firstname, lastname, email, phone } = body;

    if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    // ตรวจสอบ email ซ้ำ
    const { data: emailData } = await supabase
      .from<User>("dd_user")
      .select("personal_id")
      .eq("email", email)
      .neq("personal_id", id);
    if (emailData && emailData.length > 0) {
      return NextResponse.json({ error: "มีผู้ใช้งานอีเมล์นี้แล้ว" }, { status: 400 });
    }

    // ตรวจสอบ phone ซ้ำ
    const { data: phoneData } = await supabase
      .from<User>("dd_user")
      .select("personal_id")
      .eq("phone", phone)
      .neq("personal_id", id);
    if (phoneData && phoneData.length > 0) {
      return NextResponse.json({ error: "มีผู้ใช้งานเบอร์โทรนี้แล้ว" }, { status: 400 });
    }

    // อัปเดตข้อมูล
    const { data, error } = await supabase
      .from<User>("dd_user")
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
export async function DELETE(req: NextRequest, context: { params: Record<string, string | string[]> }) {
  try {
    const id = await getId(context.params);
    const { error } = await supabase.from<User>("dd_user").delete().eq("personal_id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
