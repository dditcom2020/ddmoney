import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function savingsfordown() {
  return(
    <div className="home-section">
      {/* // navigator */}
      <div className="flex justify-between items-center bg-[#000957] p-3">
        <div className="left-section flex items-center gap-2 md:gap-10">
          {/*  image logo */}
          <Image className="rounded-full" src="/images/Logoddmoney.png" alt="" width={50} height={50} />
          <Link href="/" className="text-white text-sm md:text-base">หน้าแรก</Link>
          <Link href="/makealist" className="text-white text-sm md:text-base">ทำรายการ</Link>
          <Link href="/aboutus" className="text-white text-sm md:text-base">เกี่ยวกับเรา</Link>
          <Link href="/contactus" className="text-white text-sm md:text-base">ติดต่อเรา</Link>
        </div>
        <div className="right-section flex items-center gap-2">
          <Button asChild className=" text-center w-100 max-w-[140px] bg-[#FFEB00] text-[#000957] hidden md:block " variant={"outline"}><Link href="/login">เข้าสู่ระบบ</Link></Button>
          <Button asChild className=" text-center w-100 max-w-[140px] bg-[#FFEB00] text-[#000957] hidden md:block " variant={"outline"}><Link href="/register">สมัครสมาชิก</Link></Button>
      
          <div className="mobile-menu block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white text-2xl cursor-pointer">≡</DropdownMenuTrigger>
              <DropdownMenuContent>
              <DropdownMenuItem asChild className="cursor-pointer"><Link href="/login">เข้าสู่ระบบ</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer"><Link href="/register">สมัครสมาชิก</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* // banner */}
      <div className="banner-section">
        <Image className="shadow-md" src="/images/Banner ddmoney website.png" alt="" width={1920} height={600} />
      </div>
      <div className="finance-product p-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            เลือกดูสินค้า
        </h2>
      </div>
      <div className="footer-section bg-[#000957] p-5">
        <div className="flex justify-center mb-5">
          <Image className="Logo" src="/images/Logoddmoney.png" alt="" width={120} height={120}></Image>
        </div>
          <p className="leading-7 text-white text-center [$:not(:first-child)]:mt-6">
            บริษัท ดีดีมันนี่ จำกัด (DDMONEY CO., LTD.) 
            <br></br>
            ที่อยู่ 72/47-48ก ถนนชัยประสิทธิ์ ต.ในเมือง อ.เมือง จ.ชัยภูมิ 36000
            <br></br>
            เวลาทำการ : จันทร์ - อาทิตย์  เวลา 09.00 - 20.00 น. | เบอร์โทร : <u>063-7498941</u>
            <br></br>
            Line Official : <u>@ddmoney</u>
          </p>
      </div>
    </div>
  )
} 