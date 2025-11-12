import { useEffect } from "react";
import { authStore } from "@/stores/useAuthStore";
import { MyUser } from "@/components/profile/types";

/**
 * Custom hook to sync user data with authStore when it changes
 * Useful for updating user state when profile data changes (e.g., avatar update)
 */
export function useUserSync() {
  const { setUser } = authStore();

  const syncUser = (updatedUser: MyUser | null) => {
    setUser(updatedUser);
  };

  const updateUserField = <K extends keyof MyUser>(
    field: K,
    value: MyUser[K]
  ) => {
    const { user } = authStore.getState();
    if (user) {
      const updatedUser = { ...user, [field]: value };
      setUser(updatedUser);
    }
  };

  return {
    syncUser,
    updateUserField,
  };
}

/**
 * Hook to hydrate authStore with server-side user data
 * Should be used at the layout level to initialize user state
 */
export function useUserHydration(initialUser: MyUser | null) {
  const { setUser } = authStore();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);
}
