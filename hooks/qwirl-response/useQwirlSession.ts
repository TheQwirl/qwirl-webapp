import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { authStore } from "@/stores/useAuthStore";
import { useMemo } from "react";

export const useQwirlSession = (
  user: components["schemas"]["UserProfileResponse"] | undefined
) => {
  const { isAuthenticated } = authStore();
  const queryKey = useMemo(
    () => [
      "get",
      "/qwirl/users/{username}/qwirl",
      {
        params: {
          path: { username: user?.username ?? "" },
        },
        enabled: isAuthenticated,
      },
    ],
    [user?.username, isAuthenticated]
  );

  const userQwirlQuery = $api.useQuery(
    "get",
    "/qwirl/users/{username}/qwirl",
    {
      params: { path: { username: user?.username ?? "undefined" } },
      enabled: isAuthenticated && !!user?.username,
    },
    {
      enabled: isAuthenticated && !!user?.username,
    }
  );

  return { queryKey, userQwirlQuery };
};
