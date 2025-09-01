import { OtherUser } from "@/components/profile/types";
import $api from "@/lib/api/client";
import { useMemo } from "react";

export const useQwirlSession = (user: OtherUser | undefined) => {
  const queryKey = useMemo(
    () => [
      "get",
      "/qwirl/users/{username}/qwirl",
      {
        params: {
          path: { username: user?.username ?? "" },
        },
        enabled: true,
      },
    ],
    [user?.username]
  );

  const userQwirlQuery = $api.useQuery("get", "/qwirl/users/{username}/qwirl", {
    params: { path: { username: user?.username ?? "" } },
    enabled: !!user?.id,
  });

  return { queryKey, userQwirlQuery };
};
