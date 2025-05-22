import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchClient } from "@/lib/api/client";
import { components } from "@/lib/api/v1";

interface AuthState {
  user: components["schemas"]["UserResponse"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean; // Track if initialize has completed
  error: string | null;
  initialize: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,
      error: null,
      initialize: async () => {
        console.log(
          "Initializing authStore, localStorage:",
          localStorage.getItem("auth-storage")
        );
        set({ error: null, isInitialized: false });
        const { refreshToken } = get();

        if (refreshToken) {
          try {
            console.log("Attempting background refresh");
            await get().refreshAccessToken();
            console.log("Initialization successful, user:", get().user);
            localStorage.setItem("auth-last-updated", Date.now().toString());
          } catch (err) {
            console.error("Initialization failed:", err);
            set({
              error: "Failed to initialize authentication",
              user: null,
              accessToken: null,
            });
          }
        } else {
          console.log("No refreshToken found, skipping refresh");
        }
        set({ isInitialized: true });
      },
      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;
        console.log("Refreshing access token, refreshToken:", refreshToken);
        set({ isLoading: true, error: null }); // Set loading during refresh
        try {
          const requestBody = { refresh_token: refreshToken! };
          console.log("refreshAccessToken: Sending request body:", requestBody);
          const { data, error } = await fetchClient.POST(
            "/api/v1/users/refresh-token",
            {
              body: requestBody,
            }
          );
          if (error || !data) {
            throw new Error(`Refresh token failed: ${"No data"}`);
          }
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: data.user,
            isLoading: false,
            error: null,
          });
          console.log("Token refresh successful, user:", data.user);
        } catch (err) {
          console.error("Token refresh failed:", err);
          set({ error: "Token refresh failed", isLoading: false });
          throw err;
        }
      },
      logout: () => {
        console.log("Logging out, clearing auth state");
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("auth-last-updated");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          isInitialized: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated authStore:", state);
      },
    }
  )
);
