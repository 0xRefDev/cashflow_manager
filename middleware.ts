import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("cashflow_token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    if (pathname.startsWith("/app/") || pathname.startsWith("/setup/")) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json(
      { success: false, message: "Unauthorized: Missing session token" },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token) as { userId: string };

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (pathname.startsWith("/app/") || pathname.startsWith("/setup/")) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid or expired session" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/app/:path*",
    "/setup/:path*",
    "/api/protected/:path*",
    "/api/user/:path*",
    "/api/v1/wallet/:path*",
    "/api/v1/user/:path*",
    "/api/v1/preferences/:path*",
    "/api/v1/transactions/:path*",
    "/api/v1/profile/:path*",
    "/api/v1/analytics/:path*",
    "/api/v1/reports/:path*",
    "/api/v1/logout/:path*",
    "/api/v1/currency/wallets/:path*",
    "/api/v1/notifications/:path*",
  ],
};
