// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const auth = await requireRole("user");

  if (!auth.ok) {
    if (auth.status === 401) redirect("/login?next=/dashboard");
    redirect("/403");
  }

  // ถึงตรงนี้ TS รู้แน่ๆ ว่า auth.ok === true
  const user = auth.user;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">แดชบอร์ดผู้ใช้งาน {user.firstname ?? ""}</h1>
      <LogoutButton></LogoutButton>
    </main>
   
  );
}
