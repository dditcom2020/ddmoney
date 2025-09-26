"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Phone, Mail, IdCard } from "lucide-react";

type UserRow = {
  personal_id: string;
  firstname: string;
  lastname: string | null;
  email: string;
  phone: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UserList() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR<{ users: UserRow[] }>(
    `/api/admin/users?search=${encodeURIComponent(search)}`,
    fetcher
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);

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
    try {
      const res = await fetch(`/api/admin/users/${currentUser.personal_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });
      if (!res.ok) throw new Error("อัปเดตข้อมูลล้มเหลว");
      setIsModalOpen(false);
      mutate(`/api/admin/users?search=${encodeURIComponent(search)}`);
    } catch (err) {
      console.error(err);
      alert("บันทึกข้อมูลล้มเหลว");
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

        {/* --- Modal Popup --- */}
        {isModalOpen && currentUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-96 space-y-5 shadow-xl animate-fadeIn">
              <h2 className="text-xl font-semibold border-b pb-2">แก้ไขผู้ใช้</h2>

              <div className="space-y-3">
                {["firstname", "lastname", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium capitalize">
                      {field === "firstname"
                        ? "ชื่อ"
                        : field === "lastname"
                        ? "นามสกุล"
                        : field === "email"
                        ? "Email"
                        : "Phone"}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={currentUser[field as keyof UserRow] || ""}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          [field]: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
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
