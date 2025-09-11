// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import LogoutButton from "@/components/LogoutButton";
import NavBar from "@/components/Navbar";

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
      {/* นำ Navigation มาวางบนสุดของ Dashboard */}
      <NavBar />

      <main className="p-6">
        <h1 className="text-xl font-bold">
          แดชบอร์ดผู้ดูแลระบบ (Admin) {user.firstname ?? ""}
        </h1>
        <div className="mt-4">
          <LogoutButton />
        </div>
        {/* เนื้อหา Dashboard อื่น ๆ ต่อจากนี้ */}
      </main>
    </>
  );
}
