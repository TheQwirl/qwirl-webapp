// types/auth.ts
// store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (access_token: string | null, refresh_token: string | null) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (access_token, refresh_token) =>
        set({
          accessToken: access_token,
          refreshToken: refresh_token,
          isAuthenticated: !!access_token && !!refresh_token,
        }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      // not storing in localstorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
