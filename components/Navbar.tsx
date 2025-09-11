"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ListTodo,
  Info,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react"; // ✅ import icons

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#000957]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0" aria-label="Home">
              <Image
                className="rounded-full"
                src="/images/Logoddmoney.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-white/90">
              <Link href="/" className="flex items-center gap-2 hover:text-white">
                <Home className="h-4 w-4" /> หน้าแรก
              </Link>
              <Link href="/makealist" className="flex items-center gap-2 hover:text-white">
                <ListTodo className="h-4 w-4" /> ทำรายการ
              </Link>
              <Link href="/aboutus" className="flex items-center gap-2 hover:text-white">
                <Info className="h-4 w-4" /> เกี่ยวกับเรา
              </Link>
              <Link href="/contactus" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" /> ติดต่อเรา
              </Link>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <Button
                asChild
                variant="outline"
                className="bg-[#FFEB00] text-[#000957] flex items-center gap-2"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-[#FFEB00] text-[#000957] flex items-center gap-2"
              >
                <Link href="/register">
                  <UserPlus className="h-4 w-4" /> สมัครสมาชิก
                </Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white text-2xl leading-none px-2 py-1">
                  ≡
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" /> หน้าแรก
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/makealist" className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4" /> ทำรายการ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/aboutus" className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> เกี่ยวกับเรา
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contactus" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> ติดต่อเรา
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" /> สมัครสมาชิก
                    </Link>
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
