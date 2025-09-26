"use client";

import { useState, useEffect } from "react";
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

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);

  // --- ฟังก์ชันลบ ---
  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    mutate(`/api/admin/users?search=${encodeURIComponent(search)}`);
  };

  // --- เปิด modal และโหลดข้อมูลผู้ใช้ ---
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

  // --- บันทึกข้อมูลจาก modal ---
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#FFEB00]" />
          รายชื่อสมาชิก (เฉพาะผู้ใช้)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-600">โหลดข้อมูลไม่สำเร็จ</div>}
        {isLoading && <div>กำลังโหลด...</div>}

        {/* --- Mobile & Desktop --- */}
        <div className="overflow-x-auto">
          <div className="flex justify-between mb-3">
            <input
              type="text"
              placeholder="ค้นหาสมาชิก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1 w-60"
            />
          </div>
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow>
                <TableHead>รหัสบัตร</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>นามสกุล</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users?.map((u) => (
                <TableRow key={u.personal_id} className="hover:bg-slate-50">
                  <TableCell>{u.personal_id}</TableCell>
                  <TableCell>{u.firstname}</TableCell>
                  <TableCell>{u.lastname}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    {/* ปุ่มดู/แก้ไข */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEdit(u.personal_id)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                    >
                      <IdCard className="h-3 w-3" />
                      ดู / แก้ไข
                    </Button>

                    {/* ปุ่มลบ */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(u.personal_id)}
                      className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      ลบ
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
            <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold">แก้ไขผู้ใช้</h2>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm">ชื่อ</label>
                  <input
                    type="text"
                    value={currentUser.firstname}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, firstname: e.target.value })
                    }
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm">นามสกุล</label>
                  <input
                    type="text"
                    value={currentUser.lastname || ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, lastname: e.target.value })
                    }
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, email: e.target.value })
                    }
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm">Phone</label>
                  <input
                    type="text"
                    value={currentUser.phone}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, phone: e.target.value })
                    }
                    className="border rounded w-full px-2 py-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="border px-3 py-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-700"
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
