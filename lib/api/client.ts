import { authStore } from "@/stores/useAuthStore";
import type { paths } from "./v1.d";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";

class ApiError extends Error {
  constructor(public status: number, message: string, public cause?: unknown) {
    super(message);
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://myapi.dev/v1/";

export const fetchClient = createFetchClient<paths>({ baseUrl });

const isBrowser = typeof window !== "undefined";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (isBrowser) {
      const accessToken = authStore.getState().accessToken;
      console.log("authMiddleware: onRequest, accessToken:", accessToken);
      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
    return request;
  },

  async onResponse({ response, request }) {
    if (
      isBrowser &&
      response.status === 401 &&
      !request.url.includes("/refresh-token") &&
      !request.url.includes("/auth-callback")
    ) {
      console.log(
        "authMiddleware: 401 detected, attempting token refresh for:",
        request.url
      );
      try {
        await authStore.getState().refreshAccessToken();
        const newAccessToken = authStore.getState().accessToken;
        console.log(
          "authMiddleware: Token refresh result, newAccessToken:",
          newAccessToken
        );
        if (!newAccessToken) {
          console.error("authMiddleware: No new access token after refresh");
          throw new Error("Failed to refresh token");
        }
        const newRequest = new Request(request, {
          headers: new Headers(request.headers),
        });
        newRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        console.log("authMiddleware: Retrying request with new token");
        return await fetch(newRequest);
      } catch (refreshError) {
        console.error("authMiddleware: Token refresh failed:", refreshError);
        authStore.getState().logout();
        throw new Error("Authentication failed");
      }
    }
    return response;
  },

  onError(error) {
    console.error("authMiddleware: API error:", error);
    if (error instanceof Error) {
      return new ApiError(500, error.message, error);
    }
    return new ApiError(500, "Unknown error occurred");
  },
};

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);

export default $api;
