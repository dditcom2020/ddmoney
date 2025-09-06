// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/server";

export default async function DashboardPage() {
  const auth = await requireAuth();
  if (!auth.ok) {
    redirect("/login?next=/dashboard");
  }

  if (auth.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (auth.user.role === "user") {
    redirect("/user/dashboard");
  }

  // กัน fallback
  redirect("/403");
}
