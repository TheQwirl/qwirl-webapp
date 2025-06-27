import { authStore } from "@/stores/useAuthStore";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { paths } from "./v1-client-side";

// class ApiError extends Error {
//   constructor(
//     public status: number,
//     message: string,
//     public cause?: unknown,
//     public data?: unknown
//   ) {
//     super(message);
//   }
// }

// const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "/api/proxy";

if (!baseUrl) {
  throw new Error(
    "base url is not defined for client fetch. Please set it in your .env file."
  );
}

export const fetchClient = createFetchClient<paths>({
  baseUrl,
  credentials: "include",
});

fetchClient.use({
  async onResponse({ response }) {
    if (response.status === 401) {
      console.log(
        "fetchClient: Received 401 from API. Middleware refresh likely failed or wasn't applicable. Logging out."
      );
      // Avoid triggering logout if a refresh is already in progress or just failed,
      // as middleware might be handling redirection.
      // This is a final fallback.
      if (!authStore.getState().isLoading) {
        // Check if not already in a loading/auth state change
        authStore.getState().logout();
      }
    }
    return response;
  },
});

export const $api = createClient(fetchClient);

export default $api;
