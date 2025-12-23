import { MyUser } from "@/components/profile/types";
import { create } from "zustand";

interface AuthState {
  user: MyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: MyUser | null) => void;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkSession: async () => {
    if (!get().isLoading) {
      // Only set loading if not already loading
      set({ isLoading: true });
    }
    try {
      const response = await fetch("/api/me", { cache: "no-store" });
      if (response.ok) {
        const userData: { user: MyUser | null; isAuthenticated: boolean } =
          await response.json();
        if (userData?.user && userData?.user?.id) {
          // Check if user data is valid
          set({
            user: userData?.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Valid response but no user data or invalid structure
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        // API call failed (e.g., 401 after refresh attempts by /api/me)
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Error during checkSession:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    const wasAuthenticated = get().isAuthenticated;
    set({ user: null, isAuthenticated: false, isLoading: false }); // Optimistic update
    try {
      // Call Next.js API route that clears cookies
      const logoutResponse = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!logoutResponse.ok) {
        console.error("Logout API call failed");
        // Potentially revert optimistic update if critical, but usually client-side clear is enough
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Ensure redirection even if API call fails.
      // Note: `next/navigation`'s `redirect()` is primarily for Server Components.
      // In client-side Zustand actions it can be unreliable, so use a hard navigation.
      if (typeof window !== "undefined") {
        const url = wasAuthenticated ? "/auth?logged_out=true" : "/auth";
        window.location.assign(url);
      }
    }
  },

  setUser: (user: MyUser | null) => {
    console.log(
      "AuthStore setUser called with:",
      user ? { id: user.id, name: user.name } : null
    );
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },
}));
