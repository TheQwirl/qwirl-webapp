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

/**
 * Constructs the full FastAPI path from the slug received by the proxy.
 * Example: slug ['users', 'me'] becomes '/api/v1/users/me'
 */
function constructFastApiPath(slug: string[]): string {
  return `${FASTAPI_PATH_PREFIX}/${slug.join("/")}`;
}

/**
 * Generic handler for all HTTP methods.
 */
async function handleRequest(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access-token")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const slug = (await params).slug;

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

  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "content-type" || lowerKey === "accept") {
      requestOptions.headers[key] = value;
    }
  });

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

  if (["POST", "PUT", "PATCH"].includes(method)) {
    const contentType = req.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        requestOptions.body = await req.json();
      } catch (e) {
        console.error("Proxy: Failed to parse JSON body", e);
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 }
        );
      }
    } else if (req.body) {
      requestOptions.body = req.body;
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

    switch (method) {
      case "GET":
        return serverFetchClient.GET(fastApiPath as GetPaths, {
          headers: fetchClientOptions.headers,
          params: fetchClientOptions.params,
        });
      case "POST":
        return serverFetchClient.POST(
          fastApiPath as PostPaths,
          fetchClientOptions as PostOperationOptions
        );
      case "PUT":
        return serverFetchClient.PUT(
          fastApiPath as PutPaths,
          fetchClientOptions as PutOperationOptions
        );
      case "DELETE":
        return serverFetchClient.DELETE(fastApiPath as DeletePaths, {
          headers: fetchClientOptions.headers,
          params: fetchClientOptions.params,
        });
      case "PATCH":
        return serverFetchClient.PATCH(
          fastApiPath as PatchPaths,
          fetchClientOptions as PatchOperationOptions
        );
      default:
        const exhaustiveCheck: never = method;
        console.error(
          `Proxy: Unsupported HTTP method encountered: ${exhaustiveCheck}`
        );
        return {
          error: { message: `Unsupported HTTP method: ${method}` },
          response: new Response(
            JSON.stringify({ error: `Unsupported HTTP method: ${method}` }),
            { status: 405 }
          ),
          data: null,
        };
    }
  };

  let apiCallResult = await makeApiCall(accessToken);

  if (apiCallResult.response?.status === 401) {
    console.log(
      `Proxy: Received 401 for ${method} ${fastApiPath}. Attempting token refresh.`
    );
    if (refreshToken) {
      const newTokens = await attemptTokenRefreshInProxy(
        refreshToken,
        cookieStore
      );
      if (newTokens && newTokens.access_token) {
        console.log(
          `Proxy: Token refresh successful. Retrying request for ${method} ${fastApiPath}.`
        );
        accessToken = newTokens.access_token;
        apiCallResult = await makeApiCall(accessToken);
      } else {
        console.log(
          `Proxy: Token refresh failed for ${method} ${fastApiPath}. Original 401 response will be processed.`
        );
      }
    } else {
      console.log(
        `Proxy: No refresh token available for ${method} ${fastApiPath}. Cannot refresh. Original 401 response will be processed.`
      );
      cookieStore.delete("access-token");
    }
  }

  if (apiCallResult?.data) {
    const headers = new Headers(apiCallResult.response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");

    return NextResponse.json(apiCallResult.data, {
      status: apiCallResult.response.status,
      statusText: apiCallResult.response.statusText,
      headers: headers,
    });
  } else if (apiCallResult.error) {
    console.log("This is the data:", apiCallResult.error, apiCallResult.data);
    let errorPayload = apiCallResult.error;
    const status = apiCallResult.response?.status || 500;

    if (typeof errorPayload !== "object" || errorPayload === null) {
      errorPayload = {
        message: String(errorPayload) || "An unexpected error occurred.",
      };
    }

    return NextResponse.json(errorPayload, { status });
  } else {
    console.error(
      "Proxy: Unknown state from serverFetchClient call. Neither data nor error was present."
    );
    return NextResponse.json(
      { error: "Unknown proxy error. API response was inconclusive." },
      { status: 500 }
    );
  }
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as DELETE,
  handleRequest as PATCH,
  handleOptionsRequest as OPTIONS,
};

export async function handleOptionsRequest(req: NextRequest) {
  const headers = new Headers();

  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  const requestedHeaders = req.headers.get("Access-Control-Request-Headers");
  if (requestedHeaders) {
    headers.set("Access-Control-Allow-Headers", requestedHeaders);
  }

  headers.set("Access-Control-Allow-Origin", req.headers.get("Origin") || "*");

  headers.set("Access-Control-Allow-Credentials", "true");

  headers.set("Access-Control-Max-Age", "86400");

  return new NextResponse(null, { status: 204, headers });
}
