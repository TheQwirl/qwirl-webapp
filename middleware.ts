// import { NextResponse } from "next/server";
import { NextResponse, type NextRequest } from "next/server";
import { attemptTokenRefresh } from "./lib/auth/refreshToken";
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    // "/((?!api/auth|policies|login||^$|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

const PROTECTED_ROUTES = ["/feed", "/profile", "settings"];
const AUTH_PATH = "/auth";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ headers });

  const requestCookieStore = request.cookies;
  let accessToken = requestCookieStore.get("access-token")?.value;
  const refreshToken = requestCookieStore.get("refresh-token")?.value;

  const isApiPath = pathname.startsWith("/api/"); // Don't run full UI redirect logic for API routes
  const base = process.env.NEXT_PUBLIC_BASE_URL || request.url;

  // If trying to access a protected path
  if (PROTECTED_ROUTES.some((path) => pathname.startsWith(path)) || isApiPath) {
    if (!accessToken && refreshToken) {
      console.log(
        `Middleware: No access token for "${pathname}", attempting refresh...`
      );
      const newTokens = await attemptTokenRefresh(
        refreshToken,
        response.cookies
      ); // Pass response.cookies for setting
      if (newTokens) {
        accessToken = newTokens.access_token;
        console.log(
          `Middleware: Refresh successful for "${pathname}". Proceeding.`
        );
        // If it was a UI path, we might want to ensure the request continues with the new cookie
        // For API paths, the refreshed token is set, subsequent fetches by the handler will use it.
        // For UI paths, if the original request was a navigation, this response will have the new cookies.
      } else {
        console.log(
          `Middleware: Refresh failed for "${pathname}". Redirecting to login.`
        );
        response.cookies.delete("access-token");
        response.cookies.delete("refresh-token");

        if (!isApiPath) {
          // Only redirect UI paths
          const loginUrl = new URL(AUTH_PATH, base);
          loginUrl.searchParams.set("error", "session_expired");
          return NextResponse.redirect(loginUrl, {
            headers: { ...headers, ...response.headers },
          });
        } else {
          // For API paths, return 401 if refresh fails
          return NextResponse.json(
            { error: "Session expired" },
            { status: 401, headers: response.headers }
          );
        }
      }
    }

    // If still no access token after potential refresh, and it's a protected UI path
    if (
      !accessToken &&
      PROTECTED_ROUTES.some((path) => pathname.startsWith(path)) &&
      !isApiPath
    ) {
      console.log(
        `Middleware: Still no access token for protected UI path "${pathname}". Redirecting to login.`
      );
      const loginUrl = new URL(AUTH_PATH, base);
      loginUrl.searchParams.set("redirect_from", pathname);
      return NextResponse.redirect(loginUrl, { headers: response.headers });
    }
  }

  // If user is authenticated (has an access token) and tries to access login page
  if (accessToken && pathname.startsWith(AUTH_PATH)) {
    console.log(
      `Middleware: Authenticated user accessing login page. Redirecting to dashboard.`
    );
    return NextResponse.redirect(new URL(PROTECTED_ROUTES[0] || "/", base), {
      headers: response.headers,
    });
  }

  // If we modified cookies (e.g., after a successful refresh), return the modified response
  // The `NextResponse.next()` already prepared will be used, and `response.cookies.set` modified its headers.
  return response;
}
