"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/stores/useAuthStore";
import { UserSetupModal } from "./user-setup-modal";

interface UserSetupProviderProps {
  children: React.ReactNode;
}

export function UserSetupProvider({ children }: UserSetupProviderProps) {
  const { user, isAuthenticated, isLoading } = authStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only show onboarding if user is authenticated but hasn't seen onboarding
    if (isAuthenticated && user && !user.has_seen_onboarding && !isLoading) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, user, isLoading]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      {children}
      <UserSetupModal open={showOnboarding} onClose={handleCloseOnboarding} />
    </>
  );
}
