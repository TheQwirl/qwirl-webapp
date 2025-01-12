export class TokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenRefreshError";
  }
}
let refreshPromise: Promise<Response> | null = null;

export async function refreshAccessToken() {
  // Ensure only one refresh request is made at a time
  if (refreshPromise) {
    return refreshPromise;
  }

  try {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // Important for sending cookies
    });

    const response = await refreshPromise;

    if (!response.ok) {
      throw new TokenRefreshError("Failed to refresh token");
    }

    return response;
  } finally {
    refreshPromise = null;
  }
}

export default refreshAccessToken;
