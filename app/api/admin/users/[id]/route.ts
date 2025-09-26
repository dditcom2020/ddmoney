import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ GET /api/admin/users/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- ใช้ Promise ตามที่ Next.js ต้องการ
) {
  const { id } = await context.params; // ต้อง await เพื่อเอา id
  const { data, error } = await supabase
    .from("dd_user")
    .select("personal_id, firstname, lastname, email, phone, role")
    .eq("personal_id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// ✅ PUT /api/admin/users/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("dd_user")
    .update(body)
    .eq("personal_id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// ✅ DELETE /api/admin/users/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await supabase
    .from("dd_user")
    .delete()
    .eq("personal_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
