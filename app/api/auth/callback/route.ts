import { serverFetchClient } from "@/lib/api/server";
import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const FRONTEND_SUCCESS_ROUTE = "/feed";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const headerList = await headers();
  const host = headerList.get("host");
  const pathname = headerList.get("x-current-path");
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const fullUrl = `${protocol}://${host}${pathname}?${searchParams.toString()}`;

  if (!protocol || !host || !pathname || !fullUrl) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("error", "authorization_code_missing");
    return NextResponse.redirect(loginUrl);
  }

  const fastapiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!fastapiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  try {
    const tokenResponse = await serverFetchClient.GET(
      "/api/v1/users/auth-callback",
      {
        params: {
          query: {
            client_type: "google",
            url: fullUrl,
          },
        },
      }
    );

    if (!tokenResponse.response?.ok) {
      console.error("FastAPI token exchange failed:", tokenResponse?.response);
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("error", "token_exchange_failed");
      if (tokenResponse.response?.status === 401)
        loginUrl.searchParams.set(
          "error_detail",
          "invalid_credentials_or_code"
        );
      return NextResponse.redirect(loginUrl);
    }

    if (
      !tokenResponse?.data?.access_token ||
      !tokenResponse?.data?.refresh_token
    ) {
      console.error(
        "Tokens missing from FastAPI response:",
        tokenResponse?.data
      );
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("error", "token_missing_in_response");
      return NextResponse.redirect(loginUrl);
    }

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as "lax" | "strict" | "none" | undefined,
    };

    cookieStore.set("access-token", tokenResponse?.data?.access_token, {
      ...cookieOptions,
      // maxAge for access token (e.g., 15 minutes)
      maxAge: 24 * 60 * 60,
    });
    cookieStore.set("refresh-token", tokenResponse?.data?.refresh_token, {
      ...cookieOptions,
      // maxAge for refresh token (e.g., 7 days)
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("user", JSON.stringify(tokenResponse?.data?.user ?? ""), {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });

    const redirectUrl = new URL(FRONTEND_SUCCESS_ROUTE, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Next.js auth callback:", error);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("error", "internal_callback_error");
    return NextResponse.redirect(loginUrl);
  }
}
