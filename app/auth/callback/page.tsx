"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { fetchClient } from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { components } from "@/lib/api/v1";

const AuthCallback = () => {
  const windowUrl = typeof window !== "undefined" ? window.location.href : "";
  const router = useRouter();

  useEffect(() => {
    if (!windowUrl) return;

    const performAuthCallback = async () => {
      try {
        const { data, error } = await fetchClient.GET(
          "/api/v1/users/auth-callback",
          {
            params: {
              query: {
                client_type: "google",
                url: windowUrl,
              },
            },
          }
        );

        if (error || !data) {
          throw new Error("Authentication failed");
        }

        console.log("Authentication successful:", data);

        // Update auth store with tokens and user data
        authStore.setState({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user as components["schemas"]["UserResponse"],
          isLoading: false,
          error: null,
        });

        // Redirect to feed
        router.replace("/feed");
      } catch (err) {
        console.error("Authentication error:", err);
        // Update auth store with error state
        authStore.setState({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
          error: "Authentication failed",
        });
        router.replace("/auth?error=auth_failed");
      }
    };

    performAuthCallback();
  }, [windowUrl, router]);
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col text-center">
      <div className="shadow bg-background text-card-foreground rounded-3xl p-6 flex flex-col  items-center justify-center border">
        <Image src="/assets/loader.svg" alt="Loading" width={80} height={80} />
        <div className=" animate-pulse">Logging you in</div>
      </div>
    </div>
  );
};

export default AuthCallback;
