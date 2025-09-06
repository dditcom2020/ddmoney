// app/api/admin/stats/route.ts
import { requireAuth } from "@/lib/auth/server";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" }, // ไม่ได้ล็อกอิน → ไปหน้า login
    });
  }

  if (auth.user.role === "admin") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin/dashboard" }, // แอดมิน → ไปหน้า /admin
    });
  }

  if (auth.user.role === "user") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/dashboard" }, // user → ไปหน้า /user
    });
  }

  return new Response("Role ไม่ถูกต้อง", { status: 400 });
}
