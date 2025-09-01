// /lib/api/login.ts
export type LoginForm = {
  /** ผู้ใช้พิมพ์อะไรมาช่องเดียว: จะเป็นอีเมลหรือยูสเซอร์เนมก็ได้ */
  identifier: string;
  password: string;
};

/** แพ็กค่าเป็น FormData โดยตรวจว่า identifier เป็นอีเมลหรือยูสเซอร์เนม */
export function buildLoginFormData(form: LoginForm) {
  const fd = new FormData();
  const isEmail = form.identifier.includes("@");

  if (isEmail) {
    fd.append("email", form.identifier);
  } else {
    fd.append("username", form.identifier);
  }
  fd.append("password", form.password);

  return fd;
}
