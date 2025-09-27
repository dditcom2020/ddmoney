"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Check, Mail, IdCard, Phone, Eye, EyeOff, LogIn, UserPlus, Home } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";
import { apiClient } from "@/lib/api/client";

type FormState = {
  citizenId: string;
  firstName: string;
  lastName: string;
  password: string;
  confirm: string;
  email: string;
  phone: string;
};

type ApiResp = {
  ok?: boolean;
  error?: string;
  message?: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export default function Register() {
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    citizenId: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm: "",
    email: "",
    phone: "",
  });

  // SweetAlert แจ้งเตือนเรื่องบัตรประชาชนตอนเข้าหน้า
  useEffect(() => {
    MySwal.fire({
      icon: "warning",
      title: "ข้อควรระวัง",
      html: `
        ห้ามนำบัตรประชาชนของผู้อื่น<br/>
        และการปลอมแปลงบัตรประชาชน<br/>
        จะถูกดำเนินการตามกฎหมาย
      `,
      confirmButtonText: "ตกลง, เข้าใจแล้ว",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }, []);

  const setDigits =
    (name: keyof FormState, maxLen?: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = onlyDigits(e.target.value).slice(0, maxLen ?? 99);
        setForm((prev) => ({ ...prev, [name]: digits }));
      };

  const allowDigitKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allow = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
    if (allow.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (f: File | null): string | null => {
    if (!f) return null;
    const maxMB = 5;
    if (f.size > maxMB * 1024 * 1024) return `ไฟล์ต้องไม่เกิน ${maxMB}MB`;
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(f.type)) return "รองรับเฉพาะรูปภาพเท่านั้น";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.password || form.password.length < 8) {
      await MySwal.fire({
        icon: "warning",
        title: "รหัสผ่านสั้นเกินไป",
        text: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (form.password !== form.confirm) {
      await MySwal.fire({
        icon: "warning",
        title: "รหัสผ่านไม่ตรงกัน!",
        text: "กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (form.phone.length !== 10) {
      await MySwal.fire({
        icon: "warning",
        title: "เบอร์โทรไม่ถูกต้อง",
        text: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const fileErr = validateFile(file);
    if (fileErr) {
      await MySwal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: fileErr,
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setSubmitting(true);
    try {
      const f = new FormData();
      f.append("citizenId", form.citizenId ?? "");
      f.append("firstName", form.firstName ?? "");
      f.append("lastName", form.lastName ?? "");
      f.append("password", form.password ?? "");
      f.append("email", form.email ?? "");
      f.append("phone", form.phone ?? "");
      if (file) f.append("file", file);

      const data = await apiClient<ApiResp>("/api/register", {
        method: "POST",
        body: f,
      });

      await MySwal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ 🎉",
        text: data.message ?? "ยินดีต้อนรับ!",
        confirmButtonText: "ตกลง",
      });

      router.push("/login");
    } catch (err: unknown) {
      await MySwal.fire({
        icon: "error",
        title: "สมัครไม่สำเร็จ",
        text: getErrorMessage(err) ?? "ไม่สามารถสมัครได้ในขณะนี้",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register section">
      <form onSubmit={handleSubmit}>
        <Link href="/" className="inline-block">
          <Button
            type="button"
            className="m-5 cursor-pointer p-6 bg-[#344CB7] text-white flex items-center gap-2 transition-all duration-150 hover:bg-[#000957] hover:text-white"
          >
            <Home className="h-5 w-5" /> หน้าแรก
          </Button>
        </Link>

        <div className="register form flex justify-center my-10">
          <label className="rounded-[100%] cursor-pointer" htmlFor="uploadImage">
            <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
              <Image
                src={preview ?? "/images/arrow.png"}
                alt="เลือกโปรไฟล์"
                fill
                sizes="250px"
                className="object-cover h-auto w-48"
                priority
              />
            </div>
          </label>
          <Input
            className="hidden"
            id="uploadImage"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-group my-10 w-full max-w-md mx-auto px-4 flex flex-col items-stretch justify-center">
          {/* Citizen ID */}
          <div className="relative w-full">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="citizenId"
              value={form.citizenId}
              onChange={setDigits("citizenId", 13)}
              onKeyDown={allowDigitKeys}
              inputMode="numeric"
              pattern="\d*"
              maxLength={13}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="เลขบัตรประชาชน (13 หลัก)"
              autoComplete="off"
              required
              type="text"
            />
          </div>

          {/* First Name */}
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="ชื่อ"
              autoComplete="given-name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="นามสกุล"
              autoComplete="family-name"
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              type={showPwd ? "text" : "password"}
              placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
              autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="relative w-full">
            <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              type={showPwd2 ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd2((v) => !v)}
              aria-label={showPwd2 ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPwd2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Email */}
          <div className="relative w-full">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="อีเมล"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative w-full">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="phone"
              value={form.phone}
              onChange={setDigits("phone", 10)}
              onKeyDown={allowDigitKeys}
              inputMode="tel"
              pattern="\d{10}$" //{10}$
              maxLength={10}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="เบอร์โทรศัพท์"
              autoComplete="tel"
              required
              type="text"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer mt-5 w-full p-6 bg-[#344CB7] text-white flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#000957] hover:text-white disabled:opacity-60"
          >
            <UserPlus className="h-5 w-5" />
            {submitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </Button>

          <Link className="mt-2 text-center block flex items-center justify-center gap-1" href="/login">
            หากท่านมีบัญชีอยู่แล้ว <LogIn className="h-4 w-4" /> <u>คลิก!</u>
          </Link>
        </div>
      </form>
    </div>
  );
}
