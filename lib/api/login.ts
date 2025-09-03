// /lib/api/login.ts

/** แบบฟอร์มล็อกอิน (ตรงกับ login/page.tsx) */
export type LoginForm = {
  personal_id: string; // citizenId (13 หลัก, ตัวเลขล้วน)
  password: string;    // ต้องมีความยาว ≥ 8 ตัวอักษร
};

/** เก็บเฉพาะตัวเลข และตัดให้ยาวสุด 13 หลัก */
export function sanitizeCitizenId(input: string): string {
  return input.replace(/\D/g, "").slice(0, 13);
}

/** ตรวจสอบเงื่อนไขรหัสผ่าน: ต้องมีความยาว ≥ 8 ตัวอักษร */
export function validateLoginForm(form: LoginForm): { ok: boolean; message?: string } {
  if (!form.personal_id || !/^\d{13}$/.test(form.personal_id)) {
    return { ok: false, message: "เลขบัตรประชาชนไม่ถูกต้อง (ต้องเป็นตัวเลข 13 หลัก)" };
  }
  if (!form.password || form.password.length < 8) {
    return { ok: false, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" };
  }
  return { ok: true };
}

/** แพ็กข้อมูลเป็น FormData ตรงกับ /api/login */
export function buildLoginFormData(form: LoginForm): FormData {
  const fd = new FormData();
  const pid = sanitizeCitizenId(form.personal_id);
  fd.append("personal_id", pid);
  fd.append("password", form.password);
  return fd;
}
