"use client";
import { MyUser } from "@/components/profile/types";
import { useUserHydration } from "@/hooks/useUserSync";

interface PublicUserProviderProps {
  initialUser: MyUser | null;
  children: React.ReactNode;
}

export function PublicUserProvider({
  initialUser,
  children,
}: PublicUserProviderProps) {
  useUserHydration(initialUser);

  return <>{children}</>;
}
