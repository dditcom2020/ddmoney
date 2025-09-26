// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import NavbarAdmin from "@/components/NavbarAdmin";
import UserList from "@/components/DashboardAdmin/UserList"; // ✅ เพิ่ม

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const auth = await requireRole("admin");

  if (!auth.ok) {
    if (auth.status === 401) redirect("/login?next=/dashboard");
    redirect("/403");
  }

  const user = auth.user;

  return (
    <>
      <NavbarAdmin userName={user.firstname ?? "Admin"} />
      <main className="p-6 space-y-6">
        <h1 className="text-xl font-bold">
          แดชบอร์ดผู้ดูแลระบบ (Admin) {user.firstname ?? ""}
        </h1>

        {/* ✅ ตารางรายชื่อสมาชิก */}
        <UserList />
      </main>
    </>
  );
}
