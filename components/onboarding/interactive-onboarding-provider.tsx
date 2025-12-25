"use client";

import React from "react";

interface InteractiveOnboardingProviderProps {
  children: React.ReactNode;
}

export function InteractiveOnboardingProvider({
  children,
}: InteractiveOnboardingProviderProps) {
  // Onboarding/tour is temporarily disabled. Keep this provider as a placeholder
  // so we can re-enable or replace the onboarding UX later without changing
  // the application structure.
  return <>{children}</>;
}
