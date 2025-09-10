"use client";

import { useMemo, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, ShoppingCart, Star, StarHalf, PackageX } from "lucide-react";

// ----------------------
// Types
// ----------------------
export type Product = {
  product_id: string;
  sku?: string | null;
  product_name: string;
  description?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  price: number;
  cost?: number | null;
  currency?: string;
  stock_qty?: number;
  unit?: string | null;
  images?: string[] | null;
  tags?: string[] | null;
  status?: "active" | "inactive" | "discontinued" | string;
  is_featured?: boolean | null;
  rating?: number | null; // 0..5
};

export type ShowProductProps = {
  product: Product;
  variant?: "card" | "row" | "compact";
  showAddButton?: boolean;
  showWishlist?: boolean;
  onClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
};

// ----------------------
// Helpers
// ----------------------
function formatPrice(value: number, currency: string = "THB") {
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString("th-TH")} ${currency}`;
  }
}

function Stars({ rating = 0 }: { rating?: number | null }) {
  const r = Math.max(0, Math.min(5, rating ?? 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
      ))}
      {half && <StarHalf className="h-4 w-4 fill-current" />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4" />
      ))}
    </div>
  );
}

function Cover({
  src,
  alt,
  onClick,
}: {
  src?: string;
  alt: string;
  onClick?: () => void;
}) {
  const safeSrc = src ?? "/images/placeholder-product.png";
  return (
    <div onClick={onClick} className={cn("cursor-pointer")}>
      <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-xl">
        <Image
          src={safeSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
        />
      </AspectRatio>
    </div>
  );
}

// ----------------------
// Main component
// ----------------------
function ShowProductBase({
  product,
  variant = "card",
  showAddButton = true,
  showWishlist = false,
  onClick,
  onAddToCart,
  className,
}: ShowProductProps) {
  const cover = product.images?.[0] ?? undefined;
  const priceText = useMemo(
    () => formatPrice(product.price, product.currency ?? "THB"),
    [product.price, product.currency]
  );
  const outOfStock =
    (product.stock_qty ?? 0) <= 0 || product.status === "discontinued";

  // ---------- ROW VARIANT (improved responsive) ----------
  if (variant === "row") {
    return (
      <Card
        className={cn(
          // xs: จัดเรียงแนวตั้ง / sm+: แนวนอน
          "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3",
          className
        )}
      >
        {/* รูป: xs เต็มความกว้าง, sm/md กำหนดความกว้างคงที่ */}
        <div className="w-full sm:w-28 md:w-32 shrink-0">
          <Cover
            src={cover}
            alt={product.product_name}
            onClick={() => onClick?.(product)}
          />
        </div>

        {/* เนื้อหา */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold truncate max-w-full sm:max-w-[70%]">
              {product.product_name}
            </h3>
            {product.is_featured && <Badge>แนะนำ</Badge>}
            {outOfStock && (
              <Badge variant="secondary" className="gap-1">
                <PackageX className="h-3 w-3" />
                หมดสต็อก
              </Badge>
            )}
          </div>

          {product.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {product.tags?.length ? (
            <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
              {product.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 bg-muted rounded">
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          {/* คะแนน + ราคา: ให้ wrap ได้บนจอเล็ก */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Stars rating={product.rating ?? 0} />
            <Separator orientation="vertical" className="hidden sm:block h-5" />
            <div className="font-bold">{priceText}</div>
          </div>
        </div>

        {/* ปุ่ม: xs เต็มความกว้าง / sm+ ชิดขวา */}
        <div className="flex flex-row sm:flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
          {showWishlist && (
            <Button variant="ghost" size="icon" aria-label="Wishlist" className="sm:order-1">
              <Heart className="h-5 w-5" />
            </Button>
          )}
          {showAddButton && (
            <Button
              onClick={() => onAddToCart?.(product)}
              disabled={outOfStock}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {outOfStock ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // ---------- COMPACT ----------
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="w-16">
          <Cover
            src={cover}
            alt={product.product_name}
            onClick={() => onClick?.(product)}
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">
            {product.product_name}
          </div>
          <div className="text-xs text-muted-foreground">{priceText}</div>
        </div>
        {showAddButton && (
          <Button
            className="ml-auto"
            size="sm"
            onClick={() => onAddToCart?.(product)}
            disabled={outOfStock}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            ใส่ตะกร้า
          </Button>
        )}
      </div>
    );
  }

  // ---------- CARD (เดิม) ----------
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardHeader className="p-0">
        <div className="relative">
          <Cover
            src={cover}
            alt={product.product_name}
            onClick={() => onClick?.(product)}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {product.is_featured && <Badge className="shadow">แนะนำ</Badge>}
            {outOfStock && (
              <Badge variant="secondary" className="shadow gap-1">
                <PackageX className="h-3 w-3" />
                หมดสต็อก
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight line-clamp-2">
              {product.product_name}
            </h3>
            {product.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          {showWishlist && (
            <Button variant="ghost" size="icon" className="shrink-0">
              <Heart className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Stars rating={product.rating ?? 0} />
          <div className="text-base font-bold">{priceText}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
          disabled={outOfStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {outOfStock ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ----------------------
// Memoized export
// ----------------------
const ShowProduct = memo(ShowProductBase);
ShowProduct.displayName = "ShowProduct";
export default ShowProduct;

// ----------------------
// Skeletons (responsive)
// ----------------------
type SkeletonVariant = "card" | "row" | "compact";

export function ShowProductSkeleton({ variant = "card" }: { variant?: SkeletonVariant }) {
  if (variant === "row") {
    return (
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3">
        <div className="w-full sm:w-28 md:w-32 aspect-square rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 w-full space-y-2">
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-full sm:w-28 bg-muted rounded animate-pulse" />
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-16 aspect-square rounded-xl bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-8 w-20 bg-muted rounded animate-pulse ml-auto" />
      </div>
    );
  }

  return (
    <Card>
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-9 w-full bg-muted rounded animate-pulse" />
      </div>
    </Card>
  );
}
