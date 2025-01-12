import { useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import refreshAccessToken from "../lib/auth/refreshToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setAuth, logout } = useAuthStore();

  useEffect(() => {
    // Set up refresh interval
    const refreshInterval = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
        router.push("/auth");
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (before 15-minute expiry)

    return () => clearInterval(refreshInterval);
  }, [router, logout]);

  useEffect(() => {
    // Handle token in URL (from OAuth callback)
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      fetch("/api/auth/callback?token=" + token).then(() => {
        router.replace(window.location.pathname);
        setAuth(token);
      });
    }
  }, [router, setAuth]);

  return <>{children}</>;
}
