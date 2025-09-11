"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import NavBar from "@/components/Navbar";

// ✅ นำ component ที่เราทำไว้มาใช้
import ShowProduct, { Product, ShowProductSkeleton } from "@/components/ShowProduct";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
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


export default function refinance() {
  const { data: products, error, isLoading } = useSWR<Product[]>("/api/showproduct", fetcher);
  // ...
  return (
    <div className="home-section">
      <NavBar/>
      {/* // banner */}
      <div className="banner-section">
        <Image className="shadow-md" src="/images/Banner ddmoney website.png" alt="" width={1920} height={600} />
      </div>
      <div className="finance-product p-5">
        <h2 className="scroll-m-20 border-b mb-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          เลือกดูสินค้า
        </h2>

        {/* states: error / loading / data */}
        {error && (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
            เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex flex-wrap -m-2 md:-m-3 lg:-m-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 md:p-3 lg:p-4">
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
                  <ShowProduct
                    className="h-full"       // ทำให้การ์ดยืดเต็มคอลัมน์ → สูงเท่ากัน
                    product={p}
                    variant="card"           // เปลี่ยนเป็น "row"/"compact" ได้
                    showWishlist
                    onAddToCart={(prod) => console.log("add to cart:", prod)}
                    onClick={(prod) => console.log("open product:", prod)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="mt-6 p-6 text-center text-sm text-muted-foreground">
              ไม่มีสินค้าให้แสดงในขณะนี้
            </Card>
          )
        )}
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