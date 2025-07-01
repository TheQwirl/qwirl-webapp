"use server";
import { fetchClient } from "@/lib/api/client";
import { queryToString } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type tParams = Promise<{ code: string; state: string }>;

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: tParams;
}) {
  const searchparams = await searchParams;
  const headerList = await headers();
  const host = headerList.get("host");
  const pathname = headerList.get("x-current-path");
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const fullUrl = `${protocol}://${host}${pathname}${queryToString(
    searchparams
  )}`;

  // If Google doesn't return a code, redirect to an error page or login
  if (!searchparams?.code || !searchparams?.state || !fullUrl) {
    redirect("/auth?error=No code received from Google");
    return;
  }

  const fastapiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!fastapiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set in environment variables");
  }

  try {
    const tokenResponse = await fetchClient.GET("/users/auth-callback", {
      params: {
        query: {
          client_type: "google",
          url: fullUrl,
        },
      },
    });

    if (!tokenResponse.response?.ok) {
      console.error("Failed to exchange code for tokens:", tokenResponse);
      redirect(`/auth?error=Failed to authenticate with backend`);
      return;
    }

    if (
      !tokenResponse?.data?.access_token ||
      !tokenResponse?.data?.refresh_token
    ) {
      redirect(`/auth?error=Invalid token response from backend`);
      return;
    }

    // 2. Set the tokens as HttpOnly cookies. The browser will now store them securely.
    // await setAuthCookies(
    //   tokenResponse.data.access_token,
    //   tokenResponse.data.refresh_token
    // );
  } catch (error) {
    console.error("Error in auth callback:", error);
    redirect("/auth?error=An unexpected error occurred");
    return;
  }

  // 3. Redirect the user to a protected page. The flow is complete.
  redirect("/feed");

  // This part will not be rendered due to the redirect, but it's good practice to have a fallback.
  return <div>Loading...</div>;
}
