import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const FASTAPI_REFRESH_URL = `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`;

export async function POST() {
  const requestCookies = await cookies();
  const refreshToken = requestCookies.get("refresh-token");

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token not found" },
      { status: 401 }
    );
  }

  try {
    // Forward the refresh token to FastAPI. The browser sends the cookie to Next.js,
    // and Next.js forwards it to FastAPI.
    const response = await fetch(FASTAPI_REFRESH_URL, {
      method: "POST",
      headers: {
        // FastAPI will read the cookie from this forwarded request
        Cookie: `refresh-token=${refreshToken.value}`,
      },
    });

    if (response.ok) {
      // FastAPI's response to this fetch call includes `Set-Cookie` headers.
      // We need to relay those back to the original browser client.
      const newCookies = response.headers.get("set-cookie");
      const responseData = await response.json();

      const nextResponse = NextResponse.json(responseData);
      if (newCookies) {
        // Relay the new cookies to the browser
        nextResponse.headers.set("Set-Cookie", newCookies);
      }
      return nextResponse;
    } else {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Refresh token proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
