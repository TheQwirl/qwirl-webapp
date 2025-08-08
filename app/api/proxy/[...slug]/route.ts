import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { paths as ServerPaths } from "@/lib/api/v1";
import { attemptTokenRefreshInProxy } from "@/lib/auth/proxyRefresh";
import { serverFetchClient } from "@/lib/api/server";
import { PathsWithMethod } from "openapi-typescript-helpers";
import { FetchOptions } from "openapi-fetch";

type GetPaths = PathsWithMethod<ServerPaths, "get">;
type PostPaths = PathsWithMethod<ServerPaths, "post">;
type PutPaths = PathsWithMethod<ServerPaths, "put">;
type DeletePaths = PathsWithMethod<ServerPaths, "delete">;
type PatchPaths = PathsWithMethod<ServerPaths, "patch">;

type PostOperationOptions = FetchOptions<ServerPaths[PostPaths]["post"]>;
type PutOperationOptions = FetchOptions<ServerPaths[PutPaths]["put"]>;
type PatchOperationOptions = FetchOptions<ServerPaths[PatchPaths]["patch"]>;

const FASTAPI_PATH_PREFIX = "/api/v1";

// Error types for better error handling
interface NetworkError extends Error {
  code?: string;
  cause?: unknown;
}

/**
 * Constructs the full FastAPI path from the slug received by the proxy.
 * Example: slug ['users', 'me'] becomes '/api/v1/users/me'
 */
function constructFastApiPath(slug: string[]): string {
  return `${FASTAPI_PATH_PREFIX}/${slug.join("/")}`;
}

/**
 * Determines if an error is a network connectivity issue
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const networkError = error as NetworkError;
    return (
      networkError.code === "ECONNREFUSED" ||
      networkError.code === "ENOTFOUND" ||
      networkError.code === "ETIMEDOUT" ||
      networkError.code === "ECONNRESET" ||
      networkError.message.includes("fetch failed") ||
      networkError.message.includes("network error") ||
      networkError.message.includes("connection refused")
    );
  }
  return false;
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(
  message: string,
  status: number = 503,
  details?: unknown
): NextResponse {
  const errorPayload = {
    error: message,
    timestamp: new Date().toISOString(),
    ...(typeof details === "object" && details !== null ? { details } : {}),
  };

  console.error(`API Proxy Error (${status}):`, message, details);

  return NextResponse.json(errorPayload, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Generic handler for all HTTP methods.
 */
type tParams = Promise<{ slug: string[] }>;
async function handleRequest(req: NextRequest, context: { params: tParams }) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("access-token")?.value;
    const refreshToken = cookieStore.get("refresh-token")?.value;

    let slug: string[];
    try {
      slug = (await context.params).slug;
    } catch (error) {
      console.error("Proxy: Failed to extract slug from params", error);
      return createErrorResponse("Invalid request parameters", 400);
    }

    const fastApiPath = constructFastApiPath(slug) as keyof ServerPaths;
    const method = req.method.toUpperCase() as
      | "GET"
      | "POST"
      | "PUT"
      | "DELETE"
      | "PATCH";

    const requestOptions: {
      headers: Record<string, string>;
      body?: unknown;
      params?: { query?: Record<string, string | string[]> };
    } = {
      headers: {},
    };

    // Copy relevant headers
    try {
      req.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === "content-type" || lowerKey === "accept") {
          requestOptions.headers[key] = value;
        }
      });
    } catch (error) {
      console.error("Proxy: Failed to process request headers", error);
      return createErrorResponse("Invalid request headers", 400);
    }

    // Process query parameters
    try {
      const searchParams = req.nextUrl.searchParams;
      const query: Record<string, string | string[]> = {};
      searchParams.forEach((value, key) => {
        const existing = query[key];
        if (existing) {
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            query[key] = [existing, value];
          }
        } else {
          query[key] = value;
        }
      });
      if (Object.keys(query).length > 0) {
        requestOptions.params = { query };
      }
    } catch (error) {
      console.error("Proxy: Failed to process query parameters", error);
      return createErrorResponse("Invalid query parameters", 400);
    }

    // Process request body for POST, PUT, PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = req.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          requestOptions.body = await req.json();
        } catch (error) {
          console.error("Proxy: Failed to parse JSON body", error);
          return createErrorResponse("Invalid JSON body", 400);
        }
      } else if (req.body) {
        try {
          requestOptions.body = req.body;
        } catch (error) {
          console.error("Proxy: Failed to process request body", error);
          return createErrorResponse("Invalid request body", 400);
        }
      }
    }

    const makeApiCall = async (token: string | undefined) => {
      const headersForApiCall: Record<string, string> = {
        ...requestOptions.headers,
      };
      if (token) {
        headersForApiCall["Authorization"] = `Bearer ${token}`;
      } else {
        delete headersForApiCall["Authorization"];
      }

      const fetchClientOptions = {
        headers: headersForApiCall,
        params: requestOptions.params,
        body: requestOptions.body,
      };

      try {
        switch (method) {
          case "GET":
            return await serverFetchClient.GET(fastApiPath as GetPaths, {
              headers: fetchClientOptions.headers,
              params: fetchClientOptions.params,
            });
          case "POST":
            return await serverFetchClient.POST(
              fastApiPath as PostPaths,
              fetchClientOptions as PostOperationOptions
            );
          case "PUT":
            return await serverFetchClient.PUT(
              fastApiPath as PutPaths,
              fetchClientOptions as PutOperationOptions
            );
          case "DELETE":
            return await serverFetchClient.DELETE(fastApiPath as DeletePaths, {
              headers: fetchClientOptions.headers,
              params: fetchClientOptions.params,
            });
          case "PATCH":
            return await serverFetchClient.PATCH(
              fastApiPath as PatchPaths,
              fetchClientOptions as PatchOperationOptions
            );
          default:
            const exhaustiveCheck: never = method;
            console.log(
              `Proxy: Unsupported HTTP method encountered: ${exhaustiveCheck}`
            );
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      } catch (error) {
        // Handle network and other errors at the fetch level
        if (isNetworkError(error)) {
          console.log(
            `Proxy: Backend service unavailable for ${method} ${fastApiPath} - will return 503`
          );
          throw { type: "network", error, method, path: fastApiPath };
        } else {
          console.log(
            `Proxy: API processing error for ${method} ${fastApiPath} - will return 502`
          );
          throw { type: "api", error, method, path: fastApiPath };
        }
      }
    };

    let apiCallResult;
    try {
      apiCallResult = await makeApiCall(accessToken);
    } catch (error: unknown) {
      if (isNetworkError(error)) {
        return createErrorResponse(
          "Service temporarily unavailable. Please try again later.",
          503,
          { reason: "Backend service unreachable" }
        );
      } else {
        return createErrorResponse("An unexpected error occurred", 502);
      }
    }

    // Handle 401 and token refresh
    if (apiCallResult.response?.status === 401) {
      console.log(
        `Proxy: Received 401 for ${method} ${fastApiPath}. Attempting token refresh.`
      );
      if (refreshToken) {
        try {
          const newTokens = await attemptTokenRefreshInProxy(
            refreshToken,
            cookieStore
          );
          if (newTokens && newTokens.access_token) {
            console.log(
              `Proxy: Token refresh successful. Retrying request for ${method} ${fastApiPath}.`
            );
            accessToken = newTokens.access_token;
            try {
              apiCallResult = await makeApiCall(accessToken);
            } catch (retryError: unknown) {
              if (isNetworkError(retryError)) {
                return createErrorResponse(
                  "Service temporarily unavailable. Please try again later.",
                  503,
                  {
                    reason: "Backend service unreachable after token refresh",
                  }
                );
              } else {
                return createErrorResponse(
                  "Failed to process request after authentication",
                  502
                );
              }
            }
          } else {
            console.log(
              `Proxy: Token refresh failed for ${method} ${fastApiPath}. Proceeding with original 401 response.`
            );
          }
        } catch (refreshError) {
          console.error(`Proxy: Token refresh attempt failed:`, refreshError);
          // Continue with original 401 response
        }
      } else {
        console.log(
          `Proxy: No refresh token available for ${method} ${fastApiPath}. Cannot refresh.`
        );
        try {
          cookieStore.delete("access-token");
        } catch (cookieError) {
          console.error(
            "Proxy: Failed to delete access token cookie:",
            cookieError
          );
        }
      }
    }

    // Process the API response
    if (apiCallResult?.data) {
      try {
        const headers = new Headers(apiCallResult.response.headers);
        headers.delete("content-encoding");
        headers.delete("content-length");

        return NextResponse.json(apiCallResult.data, {
          status: apiCallResult.response.status,
          statusText: apiCallResult.response.statusText,
          headers: headers,
        });
      } catch (error) {
        console.error("Proxy: Failed to process successful response:", error);
        return createErrorResponse("Failed to process response data", 502);
      }
    } else if (apiCallResult.error) {
      console.log(
        "Proxy: API returned error:",
        apiCallResult.error,
        apiCallResult.data
      );

      let errorPayload = apiCallResult.error;
      let status = apiCallResult.response?.status || 502;

      // Ensure we never return 500
      if (status === 500) {
        status = 502;
      }

      if (typeof errorPayload !== "object" || errorPayload === null) {
        errorPayload = {
          detail: [
            {
              loc: ["body"],
              msg: String(errorPayload) || "An unexpected error occurred.",
              type: "error",
            },
          ],
        };
      }

      return NextResponse.json(errorPayload, { status });
    } else if (apiCallResult.response) {
      // Handle successful responses with no data (like 204 No Content)
      const status = apiCallResult.response.status;

      if (status >= 200 && status < 300) {
        try {
          const headers = new Headers(apiCallResult.response.headers);
          headers.delete("content-encoding");
          headers.delete("content-length");

          return new NextResponse(null, {
            status: status,
            statusText: apiCallResult.response.statusText,
            headers: headers,
          });
        } catch (error) {
          console.error(
            "Proxy: Failed to process successful empty response:",
            error
          );
          return createErrorResponse("Failed to process response", 502);
        }
      } else {
        // Error response with no data
        let errorStatus = status;
        if (errorStatus === 500) {
          errorStatus = 502;
        }

        return NextResponse.json(
          { error: `Request failed with status ${status}` },
          { status: errorStatus }
        );
      }
    } else {
      console.error(
        "Proxy: Unknown state from serverFetchClient call. Neither data nor error was present."
      );
      return createErrorResponse(
        "Unexpected response format from backend service",
        502
      );
    }
  } catch (error) {
    // Catch-all for any unhandled errors in the entire function
    console.error("Proxy: Unhandled error in handleRequest:", error);

    if (isNetworkError(error)) {
      return createErrorResponse(
        "Service temporarily unavailable. Please try again later.",
        503,
        { reason: "Network connectivity issue" }
      );
    }

    return createErrorResponse(
      "An unexpected error occurred while processing your request",
      502
    );
  }
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as DELETE,
  handleRequest as PATCH,
};

// export async function handleOptionsRequest(req: NextRequest) {
//   const headers = new Headers();

//   headers.set(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );

//   const requestedHeaders = req.headers.get("Access-Control-Request-Headers");
//   if (requestedHeaders) {
//     headers.set("Access-Control-Allow-Headers", requestedHeaders);
//   }

//   headers.set("Access-Control-Allow-Origin", req.headers.get("Origin") || "*");

//   headers.set("Access-Control-Allow-Credentials", "true");

//   headers.set("Access-Control-Max-Age", "86400");

//   return new NextResponse(null, { status: 204, headers });
// }
