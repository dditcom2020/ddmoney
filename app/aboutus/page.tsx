// app/aboutus/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/Navbar"; // ✅ ใช้ชื่อไฟล์/ตัวพิมพ์ให้ตรง

export default function AboutUs() {
  return (
    <div className="home-section">
      {/* navigator */}
      <NavBar />

      {/* banner */}
      <div className="banner-section">
        <Image
          className="shadow-md"
          src="/images/Banner ddmoney website.png"
          alt=""
          width={1920}
          height={600}
          priority
        />
      </div>

      {/* activities */}
      <div className="activities-section p-5">
        <div className="text-center text-2xl font-semibold">ภาพกิจกรรมแสดงตรงนี้</div>
      </div>

      {/* info */}
      <div className="info-section bg-[#344CB7] p-5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance text-white">
          บริษัท ดีดีมันนี่ จำกัด
        </h1>
        <p className="leading-7 text-white [$:not(:first-child)]:mt-6">
          ผู้เชียวชาญทางด้านสินค้าโทรศัพท์มือถือและสินค้าไอที ก่อตั้งขึ้นในปี พ.ศ. 2549 ...
          บริษัทฯ จึงได้พัฒนาธุรกิจเช่าซื้อเพื่อตอบสนองความต้องการที่เพิ่มมากขึ้นของลูกค้า ...
        </p>
      </div>

      {/* footer */}
      <div className="footer-section bg-[#000957] p-5">
        <div className="flex justify-center mb-5">
          <Image className="Logo" src="/images/Logoddmoney.png" alt="" width={120} height={120} />
        </div>
        <p className="leading-7 text-white text-center [$:not(:first-child)]:mt-6">
          บริษัท ดีดีมันนี่ จำกัด (DDMONEY CO., LTD.)<br />
          ที่อยู่ 72/47-48ก ถนนชัยประสิทธิ์ ต.ในเมือง อ.เมือง จ.ชัยภูมิ 36000<br />
          เวลาทำการ : จันทร์ - อาทิตย์  เวลา 09.00 - 20.00 น. | เบอร์โทร : <u>063-7498941</u><br />
          Line Official : <u>@ddmoney</u>
        </p>
      </div>
    </div>
  );
}
