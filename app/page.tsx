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

export default function Home() {
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
      <div className="listcard flex flex-col md:flex-row gap-20 justify-center items-center p-15">
          <Link href="/installment">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการผ่อนชำระ.png" alt="" width={250} height={250}></Image>
          <div className="text-center text-2xl font-bold my-3 text-[#000957]">
            ผ่อนสินค้ามือถือ
          </div>
          </Link>
          
          <Link href="/refinance">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการรีไฟแนนซ์.png" alt="" width={250} height={250}></Image>
          <div className="text-center text-2xl font-bold my-3 text-[#000957]">
            บริการรีไฟแนนซ์
          </div>
          </Link>
          
          <Link href="/savingsfordown">
          <Image className="shadow-md rounded-md transition duration-150 ease-in-out hover:scale-[1.1]" src="/images/บริการออมดาวน์.png" alt="" width={250} height={250}></Image>
          <div className="text-center text-2xl font-bold my-3 text-[#000957]">
            บริการออมดาวน์
          </div>
          </Link>
      </div>
      <div className="info-section bg-[#344CB7] p-5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance text-white ">
          บริษัท ดีดีมันนี่ จำกัด
        </h1>
        <p className="leading-7 text-white [$:not(:first-child)]:mt-6">
          ผู้เชียวชาญทางด้านสินค้าโทรศัพท์มือถือและสินค้าไอที ก่อตั้งขึ้นในปี พ.ศ. 2549 โดยมีรากฐานจากอุตสาหกรรมโทรศัพท์มือถือและเทคโนโลยี 

            โดยเริ่มต้นจากการจำหน่ายโทรศัพท์มือถือและจำหน่ายสินค้าไอทีในร้านค้าที่อยู่ในศูนย์การค้า 
          ในปัจจุบัน ภาวะเศรษฐกิจถดถอย ทำให้ลูกค้าขาดสภาพคล่องทางการเงิน แต่ความต้องการ
          ทางด้านเทคโนโลยีเพิ่มมากขึ้น ตามยุคสมัย

            บริษัทฯ จึงได้พัฒนาธุรกิจเช่าซื้อเพื่อตอบสนองความต้องการที่เพิ่มมากขึ้นของลูกค้า เราเข้าใจความต้องการของลูกค้า และงบประมาณที่มีอย่างจำกัด 
          ทางบริษัทฯ จึงพัฒนาตัวเลือกการผ่อนชำระที่ยืดหยุ่น รวดเร็ว และเข้าถึงง่าย ลูกค้าทุกท่านจึงสามารถเป็นเจ้าของไอทีล้ำยุคได้โดยไม่ยุ่งยาก
        </p>
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