import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenAdmin = request.cookies.get("token_admin")?.value;
  const tokenuser = request.cookies.get("token")?.value;

  // Redirect /login to /auth
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!tokenAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/trade/auth", request.url));
  }
  if (!tokenAdmin && pathname.startsWith("/dashboard_admin") && pathname !== "/dashboard_admin/login") {
    return NextResponse.redirect(new URL("/dashboard_admin/login", request.url));
  }
  if (tokenAdmin && pathname === "/dashboard_admin/login") {
    return NextResponse.redirect(new URL("/dashboard_admin", request.url));
  }
  if (tokenAdmin && pathname === "/trade/register") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (
    (tokenuser && pathname === "/register") ||
    (tokenuser && pathname === "/auth")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!tokenuser && pathname.startsWith("/payment")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (tokenAdmin && pathname === "/trade/login_trade") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard_admin/:path*",
    "/trade/register",
    "/register",
    "/login",
    "/auth",
    "/trade/login_trade",
    "/payment",
  ],
};
