// components/DashboardAdmin/MembersTotal.tsx
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
    <Card className="border-[#FFEB00]/40">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-[#FFEB00]" />
          สมาชิกทั้งหมด
        </CardTitle>
        <Badge variant="secondary">รวม</Badge>
      </CardHeader>
      <CardContent className="pt-0">
        {error ? (
          <div className="text-sm text-red-600">ดึงข้อมูลไม่สำเร็จ</div>
        ) : (
          <div className="text-4xl font-bold leading-tight">
            {isLoading ? "…" : data?.total ?? 0}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          จำนวนผู้สมัครสมาชิกทั้งหมด (role = &duotuser&duot)
        </p>
      </CardContent>
    </Card>
  );
}
