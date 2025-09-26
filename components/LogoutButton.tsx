// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        cache: "no-store",
        credentials: "include", // ⬅️ ให้แน่ใจว่าคุกกี้ถูกส่ง
        headers: { "X-Requested-With": "logout" }, // กัน CSRF เบื้องต้น
      });

      if (!res.ok) {
        console.warn("Logout API not OK:", res.status);
      }
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={pending}
      variant="outline"
      className="flex items-center gap-2 bg-[#FFEB00] text-[#000957] hover:bg-yellow-400"
    >
      <LogOut className="h-4 w-4" />
      {pending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
    </Button>
  );
}
