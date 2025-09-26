// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/users/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  try {
    const { data, error } = await supabase
      .from("dd_user")
      .select("personal_id, firstname, lastname, email, phone, role")
      .eq("personal_id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// PUT /api/admin/users/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  try {
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
    if (emailData?.length) return NextResponse.json({ error: "มีผู้ใช้งานอีเมล์นี้แล้ว" }, { status: 400 });

    // ตรวจสอบ phone ซ้ำ
    const { data: phoneData, error: phoneError } = await supabase
      .from("dd_user")
      .select("personal_id")
      .eq("phone", phone)
      .neq("personal_id", id);

    if (phoneError) return NextResponse.json({ error: phoneError.message }, { status: 500 });
    if (phoneData?.length) return NextResponse.json({ error: "มีผู้ใช้งานเบอร์โทรนี้แล้ว" }, { status: 400 });

    // อัปเดตข้อมูล
    const { data: updatedUser, error: updateError } = await supabase
      .from("dd_user")
      .update({ firstname, lastname, email, phone })
      .eq("personal_id", id)
      .select()
      .single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ message: "อัปเดตสำเร็จ", user: updatedUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  try {
    const { error } = await supabase.from("dd_user").delete().eq("personal_id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
