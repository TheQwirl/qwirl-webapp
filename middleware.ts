import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { fetchClient } from "./lib/api/client";

export const config = {
  matcher: [
    /*
     * Match all request paths except for starting with:
     * - api/auth
     * - login
     * - policies
     * - / (is ensured by ^$ as its the empty string)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api/auth|policies|login||^$|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("auth-token");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // Verify token with your backend
    const response = await fetch(`/api/v1/auth/verify-token`, {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    // Clear invalid cookies
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.delete("auth-token");
    response.cookies.delete("refresh-token");
    return response;
  }
}
