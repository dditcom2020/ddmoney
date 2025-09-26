"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function OnlineTotal() {
  const [online, setOnline] = useState<number>(0);

  const fetchOnline = async () => {
    try {
      const res = await fetch("/api/admin/online", { cache: "no-store" });
      const data = await res.json();
      setOnline(data.online);
    } catch (err) {
      console.error(err);
      setOnline(0);
    }
  };

  useEffect(() => {
    fetchOnline();
    const interval = setInterval(fetchOnline, 10000); // refresh ทุก 10 วิ
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white flex items-center justify-between overflow-hidden">
      {/* ไอคอนพื้นหลังแบบโปร่ง */}
      <Users className="absolute -top-4 -right-4 h-24 w-24 opacity-20" />

      {/* ข้อความหลัก */}
      <div className="flex flex-col gap-1 z-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide">ผู้ใช้งานออนไลน์</h2>
        <p className="text-3xl font-bold">{online}</p>
        <span className="text-xs text-green-100/80">Online users right now</span>
      </div>

      {/* ไอคอนด้านขวา */}
      <div className="p-3 rounded-full bg-white/20 flex items-center justify-center z-10 shadow-md">
        <Users className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}
