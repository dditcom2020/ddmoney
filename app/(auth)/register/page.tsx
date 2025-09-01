"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Check, Mail, IdCard, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import 'sweetalert2/dist/sweetalert2.min.css';

type FormState = {
  username: string;
  password: string;
  confirm: string;
  email: string;
  fullName: string;
  phone: string;
};

export default function Register() {
  const MySwal = withReactContent(Swal);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

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
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // handler รวม
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ตัวอย่าง validate เบื้องต้น
    if (!form.username || !form.password || !form.email) {
      MySwal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน!",
        text: "ตรวจสอบข้อมูลของท่านให้เรียบร้อย!",
        confirmButtonText: "ตกลง"
      })
      return;
    }
    if (form.password !== form.confirm) {
      MySwal.fire({
        icon: "warning",
        title: "รหัผผ่านของท่านไม่ตรงกัน!",
        text: "กรุณาลองใหม่ อีกครั้ง!",
        confirmButtonText: "ตกลง"
      })
      return;
    }

    const fd = new FormData();
    // แนบฟิลด์ทั้งหมด
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("file", file);

    const res = await fetch("/api/register", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      alert(`สมัครไม่สำเร็จ: ${data?.error ?? res.statusText}`);
      return;
    }
    alert("สมัครสมาชิกสำเร็จ 🎉");
    // ทำอย่างอื่นต่อ เช่น redirect
  };

  return (
    <div className="register section">
      <form onSubmit={handleSubmit}>
        <Link href="/">
          <Button className="m-5 cursor-pointer p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white">
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
                className="object-cover"
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
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
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
            />
            <button
              type="button"
              onClick={() => setShowPwd2(v => !v)}
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
            />
          </div>

          <Button type="submit" className="mt-5 w-full p-6 bg-[#344CB7] text-white transition-all duration-150 hover:bg-[#000957] hover:text-white">
            สมัครสมาชิก
          </Button>
          <Link className="mt-2 text-center" href="/login">
            หากท่านมีบัญชีอยู่แล้ว <u>คลิก!</u>
          </Link>
        </div>
      </form>
    </div>
  );
}
