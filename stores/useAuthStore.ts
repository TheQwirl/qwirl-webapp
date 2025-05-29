import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchClient } from "@/lib/api/client"; // Ensure this client is the one with middleware
import { components } from "@/lib/api/v1"; // Ensure v1.d.ts paths are correct

export interface AuthState {
  user: components["schemas"]["UserResponse"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}

let ongoingRefreshPromise: Promise<void> | null = null;

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
        const currentIsInitialized = get().isInitialized;
        const currentIsLoading = get().isLoading;

        if (currentIsInitialized && !currentIsLoading) {
          console.log(
            "AuthStore: Initialize called but already initialized. Re-running for now."
          );
        }
        if (currentIsLoading) {
          console.log(
            "AuthStore: Initialize called but already loading. Skipping."
          );
          return;
        }

        console.log(
          "Initializing authStore. Current state - isInitialized:",
          currentIsInitialized,
          "isLoading:",
          currentIsLoading,
          "localStorage (auth-storage):",
          localStorage.getItem("auth-storage")
        );

        set({ isLoading: true, error: null, isInitialized: false });
        const { refreshToken } = get();

        if (refreshToken) {
          try {
            console.log(
              "Initialize: Attempting background refresh with existing refresh token."
            );
            await get().refreshAccessToken(); // This now uses the race-condition-proof version
            console.log(
              "Initialize: Refresh attempt completed. User:",
              get().user
            );
          } catch (err) {
            console.error("Initialize: Failed during token refresh:", err);
            if (get().user) {
              set({
                error: "Failed to initialize authentication via refresh",
                user: null,
                accessToken: null,
              });
            }
          }
        } else {
          console.log("Initialize: No refreshToken found, skipping refresh.");
        }
        set({ isLoading: false, isInitialized: true });
        console.log(
          "Initialize: Completed. isInitialized:",
          get().isInitialized,
          "User:",
          get().user
        );
      },

      refreshAccessToken: async () => {
        const {
          refreshToken: currentRefreshToken,
          isLoading: currentIsLoading,
        } = get();

        if (ongoingRefreshPromise) {
          console.log(
            "RefreshAccessToken: Attaching to ongoing token refresh promise."
          );
          return ongoingRefreshPromise;
        }

        if (!currentRefreshToken) {
          const errMsg = "No refresh token available.";
          console.error("RefreshAccessToken:", errMsg);
          set({
            isLoading: false,
            error: errMsg,
            accessToken: null,
            user: null,
          });
          throw new Error(errMsg);
        }

        console.log(
          "RefreshAccessToken: Starting new token refresh. Current isLoading:",
          currentIsLoading
        );
        set({ isLoading: true, error: null });

        ongoingRefreshPromise = (async () => {
          try {
            const requestBody = { refresh_token: currentRefreshToken! };
            console.log(
              "RefreshAccessToken: Sending request body:",
              requestBody
            );
            const { data, error: apiError } = await fetchClient.POST(
              "/api/v1/users/refresh-token",
              { body: requestBody }
            );

            if (apiError || !data || !data.access_token) {
              console.error(
                "RefreshAccessToken: API error or no data/access_token:",
                apiError,
                data
              );
              const shouldLogout = true;
              // apiError?.status === 400 || apiError?.status === 401;
              if (shouldLogout) {
                console.warn(
                  "RefreshAccessToken: Refresh token likely invalid. Logging out."
                );
                get().logout();
                throw new Error("Refresh token invalid, logged out.");
              }
              throw new Error(
                "Refresh token failed: No data or new access_token received."
              );
            }

            set({
              accessToken: data.access_token,
              refreshToken: data.refresh_token || currentRefreshToken,
              user: data.user,
              isLoading: false,
              error: null,
            });
            console.log(
              "RefreshAccessToken: Token refresh successful, user:",
              data.user
            );
          } catch (err) {
            console.error("RefreshAccessToken: Catch block error:", err);
            if (get().user) {
              set({
                error:
                  err instanceof Error ? err.message : "Token refresh failed",
                isLoading: false,
                accessToken: null,
              });
            }
            throw err;
          } finally {
            ongoingRefreshPromise = null;
          }
        })();
        return ongoingRefreshPromise;
      },

      logout: () => {
        console.log("Logging out, clearing auth state");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        console.log("Logout completed. User is null, isInitialized is true.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        accessToken: state.accessToken, // Persisting accessToken is common but has security implications (XSS)
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated authStore state:", state);
        // Consider if initialize should be called here or by an AuthProvider component.
        // If called here, need to access `initialize` carefully.
        // It's often cleaner to let an AuthProvider component trigger initialization
        // after rehydration has completed.
        // For now, we assume AuthProvider in layout.tsx or _app.tsx handles calling initialize.
      },
    }
  )
);
