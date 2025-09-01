"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Lock,
  Check,
  Mail,
  IdCard,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";
import { apiClient } from "@/lib/api/client";
import { buildRegisterFormData } from "@/lib/api/register";
import { useRouter } from "next/navigation";

type FormState = {
  username: string;
  password: string;
  confirm: string;
  email: string;
  fullName: string;
  phone: string;
};

type ApiResp = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function Register() {
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // รูปโปรไฟล์
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ฟอร์ม
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    confirm: "",
    email: "",
    fullName: "",
    phone: "",
  });

  // preview รูป
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // handler รวม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // validate เบื้องต้น
    if (!form.username || !form.password || !form.email) {
      await MySwal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน!",
        text: "ตรวจสอบข้อมูลของท่านให้เรียบร้อย!",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    if (form.password !== form.confirm) {
      await MySwal.fire({
        icon: "warning",
        title: "รหัสผ่านของท่านไม่ตรงกัน!",
        text: "กรุณาลองใหม่อีกครั้ง!",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setSubmitting(true);
    try {
      const fd = buildRegisterFormData({ ...form, file });

      // (ตัวเลือก) debug formdata ก่อนส่ง
      // for (const [k, v] of fd.entries()) console.log(k, v);

      const data = await apiClient<ApiResp>("/api/register", {
        method: "POST",
        body: fd,
      });

      await MySwal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ 🎉",
        text: data.message ?? "ยินดีต้อนรับ!",
        confirmButtonText: "ตกลง",
      });

      // ไปหน้า login หรือหน้าอื่นตามต้องการ
      // router.push("/login");
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "สมัครไม่สำเร็จ",
        text: err?.message ?? "ไม่สามารถสมัครได้ในขณะนี้",
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
            className="m-5 cursor-pointer p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white"
          >
            หน้าแรก
          </Button>
        </Link>

        {/* อัปโหลดรูปโปรไฟล์ */}
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

        {/* ฟอร์มกรอกข้อมูล */}
        <div className="form-group my-10 w-full max-w-md mx-auto px-4 flex flex-col items-stretch justify-center">
          {/* Username */}
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="ชื่อผู้ใช้งาน"
              autoComplete="username"
              required
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
              placeholder="รหัสผ่าน"
              autoComplete="new-password"
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

          {/* Full name */}
          <div className="relative w-full">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="ชื่อ - นามสกุล"
              autoComplete="name"
            />
          </div>

          {/* Phone */}
          <div className="relative w-full">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full my-2 h-11 pl-9 pr-4 focus-visible:ring-2 focus-visible:ring-[#344CB7] focus:border-[#344CB7]"
              placeholder="เบอร์โทรศัพท์"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer mt-5 w-full p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white disabled:opacity-60"
          >
            {submitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </Button>

          <Link className="mt-2 text-center block" href="/login">
            หากท่านมีบัญชีอยู่แล้ว <u>คลิก!</u>
          </Link>
        </div>
      </form>
    </div>
  );
}
