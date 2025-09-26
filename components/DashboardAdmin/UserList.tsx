"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Mail, IdCard } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "@supabase/supabase-js";

type UserRow = {
  personal_id: string;
  firstname: string;
  lastname: string | null;
  email: string;
  phone: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UserList() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR<{ users: UserRow[] }>(
    `/api/admin/users?search=${encodeURIComponent(search)}`,
    fetcher,
    { refreshInterval: 2000 } // รีเฟรชทุก 2 วินาที
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("public:dd_user")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dd_user" },
        () => mutate(`/api/admin/users?search=${encodeURIComponent(search)}`)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    mutate(`/api/admin/users?search=${encodeURIComponent(search)}`);
  };

  const handleViewEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      const user = await res.json();
      setCurrentUser(user);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลผู้ใช้ล้มเหลว");
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    if (
      !currentUser.firstname?.trim() ||
      !currentUser.lastname?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email) ||
      currentUser.phone?.length !== 10
    ) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบและถูกต้อง",
      });
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${currentUser.personal_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.error || "ตรวจสอบข้อมูล และกรุณาลองใหม่อีกครั้ง!",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsModalOpen(false);
      mutate(`/api/admin/users?search=${encodeURIComponent(search)}`);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "บันทึกข้อมูลล้มเหลว กรุณาลองใหม่",
      });
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Users className="h-6 w-6 text-yellow-500" />
          รายชื่อสมาชิก (เฉพาะผู้ใช้)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && <div className="text-red-600 font-semibold">โหลดข้อมูลไม่สำเร็จ</div>}
        {isLoading && <div className="text-gray-500">กำลังโหลด...</div>}

        <div className="flex justify-between mb-3">
          <input
            type="text"
            placeholder="ค้นหาสมาชิก..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[900px] border border-gray-200 rounded-lg overflow-hidden">
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-left">รหัสบัตร</TableHead>
                <TableHead className="text-left">ชื่อ</TableHead>
                <TableHead className="text-left">นามสกุล</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">เบอร์โทร</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.users?.map((u) => (
                <TableRow
                  key={u.personal_id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <TableCell>{u.personal_id}</TableCell>
                  <TableCell>{u.firstname}</TableCell>
                  <TableCell>{u.lastname}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEdit(u.personal_id)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                    >
                      <IdCard className="h-3 w-3" /> ดู / แก้ไข
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(u.personal_id)}
                      className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" /> ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isModalOpen && currentUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl space-y-5 transform transition-transform duration-300 scale-95 animate-slideIn">
              <h2 className="text-2xl font-bold text-center text-blue-600 border-b pb-2">แก้ไขผู้ใช้</h2>

              <div className="space-y-4">
                {["firstname", "lastname"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium capitalize">
                      {field === "firstname" ? "ชื่อ" : "นามสกุล"}
                    </label>
                    <input
                      type="text"
                      value={currentUser[field as keyof UserRow] || ""}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, [field]: e.target.value })
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                        currentUser[field as keyof UserRow]?.trim() === ""
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-400"
                      }`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    className="border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={currentUser.phone || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) setCurrentUser({ ...currentUser, phone: value });
                    }}
                    maxLength={10}
                    className="border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="border px-4 py-2 hover:bg-gray-100"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
