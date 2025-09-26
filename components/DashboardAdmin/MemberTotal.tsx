"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersRound } from "lucide-react";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function MembersTotal() {
  const { data, error, isLoading } = useSWR<{ total: number }>(
    "/api/admin/stats/members",
    fetcher
  );

  return (
    <Card className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
      {/* ไอคอนพื้นหลังโปร่ง */}
      <UsersRound className="absolute -top-5 -right-5 h-24 w-24 opacity-20" />

      <CardHeader className="pb-2 flex flex-row items-center justify-between z-10 relative">
        <CardTitle className="text-base flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-white" />
          สมาชิกทั้งหมด
        </CardTitle>
        <Badge variant="secondary" className="bg-white/20 text-white">รวม</Badge>
      </CardHeader>

      <CardContent className="pt-0 z-10 relative">
        {error ? (
          <div className="text-sm text-red-200">ดึงข้อมูลไม่สำเร็จ</div>
        ) : (
          <div className="text-4xl font-bold leading-tight text-white">
            {isLoading ? "…" : data?.total ?? 0}
          </div>
        )}
        <p className="text-sm text-white/80 mt-1">
          จำนวนผู้สมัครสมาชิกทั้งหมด (role = user)
        </p>
      </CardContent>
    </Card>
  );
}
