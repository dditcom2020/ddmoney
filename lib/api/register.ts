export function buildRegisterFormData(form: {
  username: string;
  password: string;
  confirm: string;
  email: string;
  fullName: string;
  phone: string;
  file?: File | null;
}) {
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => {
    if (v) fd.append(k, v as string | Blob);
  });
  return fd;
}
