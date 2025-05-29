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
          console.error("AuthCallback error or no data:", error, data);
          throw new Error("Authentication callback failed: No data received.");
        }

        console.log("Authentication callback successful:", data);

        authStore.setState({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user as components["schemas"]["UserResponse"],
          isLoading: false,
          isInitialized: true, // Important: Set as initialized
          error: null,
        });

        router.replace("/feed"); // Or a more dynamic redirect location
      } catch (err) {
        console.error("Authentication callback error:", err);
        authStore.setState({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
          isInitialized: true, // Still initialized, but with an error and no user
          error:
            err instanceof Error
              ? err.message
              : "Authentication failed during callback",
        });
        router.replace("/auth?error=auth_failed");
      }
    };

    performAuthCallback();
  }, [windowUrl, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col text-center">
      <div className="shadow bg-background text-card-foreground rounded-3xl p-6 flex flex-col items-center justify-center border">
        <Image src="/assets/loader.svg" alt="Loading" width={80} height={80} />
        <div className="animate-pulse">Logging you in...</div>
      </div>
    </div>
  );
};

export default AuthCallback;
