"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IdCard, Lock, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import {
  buildLoginFormData,
  validateLoginForm,
  sanitizeCitizenId,
  type LoginForm,
} from "@/lib/api/login";
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
  try { return JSON.stringify(err); } catch { return String(err); }
}

// ✅ helper: คงไว้เฉพาะตัวเลข
const onlyDigits = (s: string) => s.replace(/\D/g, "");

// ✅ กันคีย์ที่ไม่ใช่ตัวเลขระหว่างพิมพ์ (ยังวาง paste ได้ แต่เราตัดใน onChange แล้ว)
const allowDigitKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allow = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
  if (allow.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

export default function LoginPage() {
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const MySwal = withReactContent(Swal);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    if (!citizenId || !password) {
      await MySwal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกเลขบัตรประชาชนและรหัสผ่าน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // ใช้ helper จาก /lib/api/login.ts ให้ตรงกันทั้งฝั่ง UI/Lib/Backend
    const form: LoginForm = {
      personal_id: sanitizeCitizenId(citizenId),
      password,
    };

    const check = validateLoginForm(form); // ✅ ตอนนี้เช็กแค่รหัสผ่าน ≥ 8 ตัวอักษร
    if (!check.ok) {
      await MySwal.fire({
        icon: "warning",
        title: "รูปแบบข้อมูลไม่ถูกต้อง",
        text: check.message ?? "โปรดตรวจสอบข้อมูลอีกครั้ง",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setSubmitting(true);
    try {
      const fd = buildLoginFormData(form); // -> personal_id + password

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
        {/* เลขบัตรประชาชน — เฉพาะตัวเลข 13 หลัก */}
        <div className="relative w-full">
          <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={citizenId}
            onChange={(e) => setCitizenId(onlyDigits(e.target.value).slice(0, 13))}
            onKeyDown={allowDigitKeys}
            inputMode="numeric"
            pattern="\d*"
            maxLength={13}
            className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
            placeholder="เลขบัตรประชาชน (13 หลัก)"
            autoComplete="off"
            type="text"
            required
          />
        </div>

        {/* รหัสผ่าน — อย่างน้อย 8 ตัวอักษร (ไม่บังคับภาษา) */}
        <div className="relative w-full">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full my-2 h-11 pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
            type={showPwd ? "text" : "password"}
            placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
            autoComplete="current-password"
            minLength={8}
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
