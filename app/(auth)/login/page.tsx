"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { buildLoginFormData, type LoginForm } from "@/lib/api/login";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

type LoginResp = {
  ok?: boolean;
  token?: string;
  error?: string;
  message?: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const MySwal = withReactContent(Swal);
  const isEmail = identifier.includes("@");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    if (!identifier || !password) {
      await MySwal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกทั้งชื่อผู้ใช้งาน/อีเมล และรหัสผ่าน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setSubmitting(true);
    try {
      const form: LoginForm = { identifier, password };
      const fd = buildLoginFormData(form);

      const data = await apiClient<LoginResp>("/api/login", {
        method: "POST",
        body: fd,
      });

      if (data.ok) {
        await MySwal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ 🎉",
          text: "ยินดีต้อนรับกลับมา!",
          confirmButtonText: "ตกลง",
        });
        // TODO: เก็บ token / redirect
        // router.push("/dashboard");
      } else {
        await MySwal.fire({
          icon: "error",
          title: "เข้าสู่ระบบล้มเหลว",
          text: data.error ?? data.message ?? "โปรดลองอีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (err: unknown) {
      await MySwal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: getErrorMessage(err) ?? "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="register section">
      <Link href="/">
        <Button
          type="button"
          className="m-5 cursor-pointer p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white"
        >
          หน้าแรก
        </Button>
      </Link>

      <div className="register form flex justify-center my-10">
        <Image
          className="h-auto w-48 object-cover"
          src="/images/Logoddmoney.png"
          alt="ddmoney"
          width={250}
          height={250}
          priority
        />
      </div>

      <form
        onSubmit={handleLogin}
        className="form-group my-10 w-full max-w-md mx-auto px-4 flex flex-col items-stretch justify-center"
      >
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
            required
          />
        </div>

        <div className="relative w-full">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full my-2 h-11 pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
            type={showPwd ? "text" : "password"}
            placeholder="รหัสผ่าน"
            autoComplete="current-password"
            required
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

        <Button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white disabled:opacity-60"
        >
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>

        <Link className="mt-2 text-center" href="/register">
          ยังไม่มีบัญชี? <u>สมัครสมาชิก</u>
        </Link>
      </form>
    </div>
  );
}
