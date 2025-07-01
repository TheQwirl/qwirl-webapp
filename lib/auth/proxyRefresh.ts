import type {
  //   paths as ServerPaths,
  operations as ServerOperations,
} from "@/lib/api/v1"; // Server-side types, adjust path
import type {
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { serverFetchClient } from "../api/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface NewTokens {
  access_token: string;
  refresh_token: string;
}

const FASTAPI_REFRESH_PATH = "/api/v1/users/refresh-token" as const;

/**
 * Attempts to refresh the access token using the refresh token by calling FastAPI.
 * Sets new HttpOnly cookies if successful.
 * @param refreshTokenValue The current refresh token string.
 * @param cookieStore The Next.js mutable cookie store (from `cookies()` in a Route Handler or Server Action).
 * @returns The new access and refresh tokens as an object, or null if refresh fails.
 */
export async function attemptTokenRefreshInProxy(
  refreshTokenValue: string,
  cookieStore: ReadonlyRequestCookies | ResponseCookies
): Promise<NewTokens | null> {
  try {
    console.log("Proxy Refresh: Attempting token refresh with FastAPI...");

    type RefreshRequestBody =
      ServerOperations["refresh_access_token_api_v1_users_refresh_token_post"]["requestBody"]["content"]["application/json"];

    const requestBody: RefreshRequestBody = {
      refresh_token: refreshTokenValue,
    };

    console.log("Current refresh token: ", requestBody);

    const refreshResponse = await serverFetchClient.POST(FASTAPI_REFRESH_PATH, {
      body: requestBody,
    });

    if (refreshResponse?.data) {
      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        refreshResponse.data;

      if (newAccessToken && newRefreshToken) {
        console.log(
          "Proxy Refresh: Token refresh successful. Setting new cookies."
        );

        const cookieOptions: Partial<ResponseCookie> = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        };

        cookieStore.set("access-token", newAccessToken, {
          ...cookieOptions,
          maxAge: 60 * 60, // 15 minutes
        });

        cookieStore.set("refresh-token", newRefreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        cookieStore.set(
          "user",
          JSON.stringify(refreshResponse?.data?.user ?? ""),
          {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60,
          }
        );

        return { access_token: newAccessToken, refresh_token: newRefreshToken };
      } else {
        console.error(
          "Proxy Refresh: FastAPI refresh response missing new tokens:",
          refreshResponse.data
        );
        cookieStore.delete("refresh-token");
        cookieStore.delete("access-token");
        cookieStore.delete("user");
        return null;
      }
    } else {
      console.error(
        `Proxy Refresh: FastAPI refresh token endpoint failed with status ${refreshResponse?.response?.status}. Error:`,
        refreshResponse.error
      );

      if (
        refreshResponse?.response?.status === 401 ||
        refreshResponse?.response?.status === 403
      ) {
        console.log(
          "Proxy Refresh: Refresh token is invalid or expired. Clearing auth cookies."
        );
        cookieStore.delete("access-token");
        cookieStore.delete("refresh-token");
        cookieStore.delete("user");
      }
      return null;
    }
  } catch (error) {
    console.error(
      "Proxy Refresh: Exception during token refresh attempt:",
      error
    );
    try {
      cookieStore.delete("access-token");
      cookieStore.delete("refresh-token");
      cookieStore.delete("user");
    } catch (cookieError) {
      console.error(
        "Proxy Refresh: Failed to clear cookies during exception handling:",
        cookieError
      );
    }
    return null;
  }
}
