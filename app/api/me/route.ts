// app/api/me/route.ts
import { serverFetchClient } from "@/lib/api/server";
import { attemptTokenRefresh } from "@/lib/auth/refreshToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access-token")?.value;

  if (!accessToken) {
    const refreshToken = cookieStore.get("refresh-token")?.value;

    if (refreshToken) {
      console.log("/api/me: No access token, attempting refresh...");
      const newTokens = await attemptTokenRefresh(refreshToken, cookieStore); // Pass cookieStore to set new cookies
      if (newTokens) {
        accessToken = newTokens.access_token;
      } else {
        // Refresh failed, clear auth state (attemptTokenRefresh should handle cookie clearing on hard failure)
        return NextResponse.json(
          { error: "Session expired or invalid" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Not authenticated, no tokens found" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 401 }
    );
  }

  // Use the access token to fetch user details from your FastAPI backend
  const userResponse = await serverFetchClient.GET("/api/v1/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!userResponse.response?.ok) {
    console.log(userResponse?.error?.detail);
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: userResponse.response.status }
    );
  }

  return NextResponse.json({ user: userResponse?.data, isAuthenticated: true });
}
