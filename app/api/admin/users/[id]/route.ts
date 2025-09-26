// app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

// ✅ GET /api/admin/users/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("dd_user")
    .select("personal_id, firstname, lastname, email, phone, role")
    .eq("personal_id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// ✅ PUT /api/admin/users/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("dd_user")
    .update(body)
    .eq("personal_id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// ✅ DELETE /api/admin/users/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase
    .from("dd_user")
    .delete()
    .eq("personal_id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
