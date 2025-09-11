import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/Navbar";
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

export default function Makealist() {
  return(
    <div className="home-section">
      <NavBar/>
      {/* // banner */}
      <div className="banner-section">
        <Image className="shadow-md" src="/images/Banner ddmoney website.png" alt="" width={1920} height={600} />
      </div>
      <div className="listcard flex flex-col md:flex-row gap-20 justify-center items-center p-15">
          <Link href="/installment">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการผ่อนชำระ.png" alt="" width={250} height={250}></Image>
            <div className="text-center text-2xl font-bold my-3 text-[#000957]">
                ผ่อนสินค้ามือถือ
            </div>
          </Link>
          <Link href="/refinance">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการรีไฟแนนซ์.png" alt="" width={250} height={250}></Image>
            <div 
              className="text-center text-2xl font-bold my-3 text-[#000957]">บริการรีไฟแนนซ์
            </div>
          </Link>
          <Link href="/savingsfordown">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการออมดาวน์.png" alt="" width={250} height={250}></Image>
            <div 
              className="text-center text-2xl font-bold my-3 text-[#000957]">ออมดาวน์
            </div>
          </Link>
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