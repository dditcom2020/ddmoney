"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ✅ นำ component ที่เราทำไว้มาใช้
import ShowProduct, { Product, ShowProductSkeleton } from "@/components/ShowProduct";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Installment() {
  const { data: products, error, isLoading } = useSWR<Product[]>("/api/showproduct", fetcher);

  return (
    <div className="home-section">
      <NavBar />
      {/* // banner */}
      <div className="banner-section">
        <Image className="shadow-md" src="/images/Banner ddmoney website.png" alt="" width={1920} height={600} />
      </div>

      {/* // เลือกดูสินค้า */}
      <div className="finance-product p-5">
        <h2 className="scroll-m-20 border-b mb-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          เลือกดูสินค้า
        </h2>

        {/* states: error / loading / data */}
        {error && (
          <div className="mt-4 text-red-600">
            เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex flex-wrap -m-2 md:-m-3 lg:-m-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 md:p-3 lg:p-4"
              >
                {/* ทำให้ card สูงเท่ากันได้ด้วย h-full */}
                <div className="h-full">
                  <ShowProductSkeleton />
                </div>
              </div>
            ))}
          </div>
        )}

        {!!products && (
          products.length > 0 ? (
            <div className="mt-6 flex flex-wrap -m-2 md:-m-3 lg:-m-4">
              {products.map((p) => (
                <div
                  key={p.product_id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 md:p-3 lg:p-4"
                >
                  <div className="h-full">
                    <ShowProduct
                      product={p}
                      variant="card"
                      showWishlist
                      onAddToCart={(prod) => console.log("add to cart:", prod)}
                      onClick={(prod) => console.log("open product:", prod)}
                    // ถ้าการ์ดรองรับ className: ส่ง h-full เข้าไปด้วยเพื่อ equal height
                    // className="h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="mt-6 p-6 text-center text-sm text-muted-foreground">
              ไม่มีสินค้าให้แสดงในขณะนี้
            </Card>
          )
        )}


        {/* วางปุ่มโหลดเพิ่ม/ตัวกรองภายหลังได้ที่นี่ */}
        {/* <div className="mt-6 flex justify-center">
          <Button variant="outline">โหลดเพิ่ม</Button>
        </div> */}
      </div>

      {/* // footer */}
      <div className="footer-section bg-[#000957] p-5">
        <div className="flex justify-center mb-5">
          <Image className="Logo" src="/images/Logoddmoney.png" alt="" width={120} height={120} />
        </div>
        <p className="leading-7 text-white text-center [$:not(:first-child)]:mt-6">
          บริษัท ดีดีมันนี่ จำกัด (DDMONEY CO., LTD.)
          <br />
          ที่อยู่ 72/47-48ก ถนนชัยประสิทธิ์ ต.ในเมือง อ.เมือง จ.ชัยภูมิ 36000
          <br />
          เวลาทำการ : จันทร์ - อาทิตย์  เวลา 09.00 - 20.00 น. | เบอร์โทร : <u>063-7498941</u>
          <br />
          Line Official : <u>@ddmoney</u>
        </p>
      </div>
    </div>
  );
}
