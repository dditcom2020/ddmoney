'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Regsiter() {
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2] = useState(false); // คงไว้ตามโครงเดิม (ไม่ใช้แล้ว)
  const [identifier, setIdentifier] = useState("");

  const isEmail = identifier.includes("@");

  return (
    <div className="register section">
      <Link href="/">
        <Button className="m-5 cursor-pointer p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white">
          หน้าแรก
        </Button>
      </Link>

      <div className="register form flex justify-center my-10">
          <Image className="" src="/images/Logoddmoney.png" alt="" width={250} height={250} />
      </div>

      {/* ======== เริ่มส่วนฟอร์ม (เหลือ 2 ช่อง: ผู้ใช้/อีเมล + รหัสผ่าน) ======== */}
      <div className="form-group my-10 w-full max-w-md mx-auto px-4 flex flex-col items-stretch justify-center">
        {/* Username or Email */}
        <div className="relative w-full">
          {isEmail ? (
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          ) : (
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
          <Input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
            placeholder="ชื่อผู้ใช้งาน หรือ อีเมล"
            type="text"
            inputMode="email"
            autoComplete="username email"
          />
        </div>

        {/* Password */}
        <div className="relative w-full">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="w-full my-2 h-11 pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
            type={showPwd ? "text" : "password"}
            placeholder="รหัสผ่าน"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <Button className="mt-5 w-full p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white" variant="ghost">
          เข้าสู่ระบบ
        </Button>
        <Link className="mt-2 text-center" href="/register">
          หากท่านมีบัญชีอยู่แล้ว <u>คลิก!</u>
        </Link>
      </div>
      {/* ======== จบส่วนฟอร์ม ======== */}
    </div>
  );
}
