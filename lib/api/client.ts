import { authStore } from "@/stores/useAuthStore";
import type { paths } from "./v1.d"; // Make sure v1.d.ts paths match the corrected relative paths
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public cause?: unknown,
    public data?: unknown
  ) {
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
      // IMPORTANT: Ensure these paths match how your openapi-fetch client constructs them.
      // If baseUrl is "https://myapi.dev/v1/", and you call fetchClient.POST("/users/refresh-token"),
      // then request.url will be "https://myapi.dev/v1/users/refresh-token".
      // The check should be against the *relative path* if that's easier, or the full URL.
      !request.url.endsWith("/users/refresh-token") && // Adjusted path for check
      !request.url.endsWith("/users/auth-callback") // Adjusted path for check
    ) {
      console.log(
        "authMiddleware: 401 detected, attempting token refresh for:",
        request.url
      );
      try {
        // refreshAccessToken in store now handles race conditions
        await authStore.getState().refreshAccessToken();
        const newAccessToken = authStore.getState().accessToken;

        console.log(
          "authMiddleware: Token refresh result, newAccessToken present:",
          !!newAccessToken
        );

        if (!newAccessToken) {
          console.error(
            "authMiddleware: No new access token after refresh attempt from store."
          );
          // Logout would have been called by refreshAccessToken on critical failure,
          // or if token simply wasn't there.
          // If logout didn't happen and token is missing, force it.
          if (authStore.getState().user) authStore.getState().logout();
          throw new Error(
            "Failed to refresh token: No new access token was made available."
          );
        }

        const newRequest = new Request(request, {
          headers: new Headers(request.headers),
          // Ensure body is correctly cloned if it's a POST/PUT etc.
          // For GET, this is fine. For other methods, ensure 'request' can be re-used.
          // If 'request' is a string (URL), this is fine. If it's a Request object,
          // its body might have been consumed. openapi-fetch usually handles this.
        });
        newRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        console.log(
          "authMiddleware: Retrying request with new token for:",
          newRequest.url
        );
        const retryResponse = await fetch(newRequest);

        if (retryResponse.status === 401) {
          console.error(
            "authMiddleware: Retried request also resulted in 401. Logging out.",
            newRequest.url
          );
          authStore.getState().logout();
          // Return the 401 response to let the application layer handle it.
        }
        return retryResponse;
      } catch (refreshError) {
        console.error(
          "authMiddleware: Token refresh process failed:",
          refreshError
        );
        // refreshAccessToken should ideally handle logout on non-recoverable errors.
        // If not already logged out by the store, ensure it here.
        if (authStore.getState().user) {
          // Check if user still exists before logging out again
          authStore.getState().logout();
        }
        // Propagate a meaningful error. The original 401 'response' is lost here.
        // We throw a new error that the application or onError handler can catch.
        throw new ApiError(
          401,
          "Authentication failed: Token refresh was unsuccessful.",
          refreshError
        );
      }
    }
    return response;
  },

  onError(error) {
    console.error("authMiddleware: API error:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      // Handle AbortError gracefully
      console.log("authMiddleware: Request aborted, likely due to navigation");
      return new ApiError(0, "Request aborted", error);
    } else if (error instanceof TypeError) {
      return new ApiError(0, "Network error occurred", error);
    } else if (error instanceof Error) {
      return new ApiError(500, error.message, error);
    }
    return new ApiError(500, "Unknown error occurred");
  },
};

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);

export default $api;
