// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "session_id";

/** เส้นทางที่ "ไม่" ควรโดนบังคับล็อกอิน */
const PUBLIC_PATHS = [
  "/",                 // หน้าแรก
  "/login",
  "/register",
  "/403",
  // APIs ที่ควรเข้าถึงได้โดยไม่ต้องล็อกอิน
  "/api/login",
  "/api/logout",
  "/api/register",
  "/api/health",
];

/** เส้นทางที่ "ควร" ต้องมี session (เช็ค role ลึก ๆ ใน server อีกชั้น) */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",      // แนะนำ: ให้หน้า/ API ภายใต้ /admin ตรวจ role ใน server
  "/api/private"
];

/** ไฟล์/asset ที่ปล่อยผ่าน */
function isAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  );
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) ปล่อย assets และเส้นทาง public
  if (isAsset(pathname) || isPublic(pathname)) {
    return NextResponse.next();
  }

  // 2) ถ้าไม่อยู่ในโซนที่ต้องล็อกอิน ก็ผ่านไป
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  // 3) ตรวจคุกกี้ session แบบเบา ๆ (ไม่เรียก DB ใน middleware)
  const hasSessionCookie = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  // 4) ไม่มี session → แยกพฤติกรรมระหว่าง Page vs API
  const accept = req.headers.get("accept") || "";
  const isHTML = accept.includes("text/html");

  if (isHTML) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    const nextPath = pathname + (search || "");
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

export const config = {
  // ใช้กับทุกเส้นทาง แล้วคัดกรองเองด้านบน
  matcher: ["/:path*"],
};
