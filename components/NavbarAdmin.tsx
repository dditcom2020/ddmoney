"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Settings, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarAdminProps = {
  userName?: string; // ✅ เพิ่ม prop ชื่อ user
};

export default function NavbarAdmin({ userName }: NavbarAdminProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: { "X-Requested-With": "logout" },
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
    <header className="sticky top-0 z-50 w-full bg-[#1E293B] text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left: Logo + UserName */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="shrink-0 flex items-center gap-2">
              <Image
                src="/images/Logoddmoney.png"
                alt="Admin Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              {/* ✅ แสดงชื่อ user */}
              {userName && (
                <span className="font-semibold text-white">{userName}</span>
              )}
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 hover:text-[#FFEB00]"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 hover:text-[#FFEB00]"
              >
                <Users className="h-4 w-4" /> Users
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 hover:text-[#FFEB00]"
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Logout */}
            <Button
              onClick={handleLogout}
              disabled={pending}
              variant="outline"
              className="hidden md:flex items-center gap-2 bg-[#FFEB00] text-[#000957] hover:bg-yellow-400"
            >
              <LogOut className="h-4 w-4" />
              {pending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-2xl px-2 py-1">
                  <Menu />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Users
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={handleLogout}
                      disabled={pending}
                      className="w-full flex items-center gap-2 text-left text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      {pending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
