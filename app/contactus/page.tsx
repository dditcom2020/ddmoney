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
import { SiFacebook, SiLine, SiTiktok, SiInstagram, SiYoutube  } from "react-icons/si";

export default function contactus() {
  return(
    <div className="home-section">
      <NavBar />
      {/* // banner */}
      <div className="banner-section">
        <Image className="shadow-md" src="/images/Banner ddmoney website.png" alt="" width={1920} height={600} />
      </div>
      <div className="contactinformation-section p-5">
        <div className="text-center text-2xl font-semibold shadow-md p-5">
            <div className="flex justify-center mb-5">
                <Image className="Logo" src="/images/Logoddmoney.png" alt="" width={120} height={120}></Image>
            </div>
            <p className="leading-7 text-[#000957] text-center [$:not(:first-child)]:mt-6">
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
      <div className="form-contact-section flex flex-col justify-center p-5 gap-2">
        <div className="aspect-video">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239.92639358346852!2d102.02505046831335!3d15.813321351675265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311f358263e528d3%3A0xee8a309df3355a7e!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4lOC4teC4lOC4tS7guYTguK3guJfguLUu4LiE4Lit4LihIOC4iOC4s-C4geC4seC4lA!5e0!3m2!1sth!2sth!4v1756175625542!5m2!1sth!2sth"
          style={{ border: 0 }} loading="lazy" allowFullScreen
          referrerPolicy="no-referrer-when-downgrade" className="w-full h-full"
        />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button asChild variant="outline" className="w-full p-10 md:w-50">
            <Link href="https://www.facebook.com/profile.php?id=61572879531376"><SiFacebook className="text-blue-500"></SiFacebook>Facebook</Link>
          </Button>
          <Button asChild variant="outline" className="w-full p-10 md:w-50">
              <Link href="https://lin.ee/Gtc5c4g"><SiLine className="text-green-500"></SiLine>Line</Link>
          </Button>
          <Button asChild variant="outline" className="w-full p-10 md:w-50">
              <Link href=""><SiTiktok className="text-black-500"></SiTiktok>Tiktok</Link>
          </Button>
          <Button asChild variant="outline" className="w-full p-10 md:w-50">
              <Link href=""><SiInstagram className="text-pink-500"></SiInstagram>Instagram</Link>
          </Button>
          <Button asChild variant="outline" className="w-full p-10 md:w-50">
              <Link href=""><SiYoutube className="text-red-500"></SiYoutube>Youtube</Link>
          </Button>
        </div>
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