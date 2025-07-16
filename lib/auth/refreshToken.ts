// lib/auth/refresh.ts
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { serverFetchClient } from "../api/server";

interface NewTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Attempts to refresh the access token using the refresh token.
 * Sets new cookies if successful.
 * @param refreshTokenValue The current refresh token.
 * @param cookieStore The Next.js mutable cookie store to set new cookies.
 * @returns The new access and refresh tokens, or null if refresh fails.
 */
export async function attemptTokenRefresh(
  refreshTokenValue: string,
  cookieStore: ReadonlyRequestCookies | ResponseCookies
): Promise<NewTokens | null> {
  try {
    console.log("Attempting token refresh with FastAPI...");
    const refreshTokenResponse = await serverFetchClient.POST(
      "/api/v1/users/refresh-token",
      {
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`,
          cache: "no-store",
        },
        body: {
          refresh_token: refreshTokenValue,
        },
      }
    );

    if (refreshTokenResponse?.response?.ok) {
      const newAccessToken = refreshTokenResponse?.data?.access_token;
      const newRefreshToken = refreshTokenResponse?.data?.refresh_token;
      const newTokensData = {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };

      if (newAccessToken && newRefreshToken) {
        console.log("Token refresh successful. Setting new cookies.");
        const cookieOptions: Partial<ResponseCookie> = {
          // Use Partial<ResponseCookie> for options
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        };

        cookieStore.set("access-token", newAccessToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60,
        });
        cookieStore.set("refresh-token", newRefreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60,
        });
        cookieStore.set(
          "user",
          JSON.stringify(refreshTokenResponse?.data?.user ?? ""),
          {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60,
          }
        );

        return { access_token: newAccessToken, refresh_token: newRefreshToken };
      } else {
        console.error(
          "Refresh response from FastAPI missing new tokens:",
          newTokensData
        );
        // Clear potentially invalid refresh token if FastAPI didn't return new ones
        cookieStore.delete("refresh-token");
        cookieStore.delete("access-token"); // Also clear access token
        cookieStore.delete("user");
        return null;
      }
    } else {
      console.error(
        `FastAPI refresh token endpoint failed with status ${refreshTokenResponse?.response.status}`
      );
      // If refresh token itself is invalid/expired (e.g., 401 from refresh endpoint)
      if (
        refreshTokenResponse?.response.status === 401 ||
        refreshTokenResponse?.response.status === 403
      ) {
        console.log(
          "Refresh token is invalid or expired. Clearing auth cookies."
        );
        cookieStore.delete("access-token");
        cookieStore.delete("refresh-token");
        cookieStore.delete("user");
      }
      return null;
    }
  } catch (error) {
    console.error("Exception during token refresh attempt:", error);
    return null;
  }
}
