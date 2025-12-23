"use client";

import { useEffect, useState } from "react";
import { Onborda, OnbordaProvider } from "onborda";
import { usePathname } from "next/navigation";
import { onboardingSteps } from "@/lib/onboarding/steps";
import { OnbordaCard } from "./onborda-card";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { authStore } from "@/stores/useAuthStore";

interface InteractiveOnboardingProviderProps {
  children: React.ReactNode;
}

export function InteractiveOnboardingProvider({
  children,
}: InteractiveOnboardingProviderProps) {
  const pathname = usePathname();
  const { user } = authStore();
  const {
    tourActive,
    hasSeenInteractiveTour,
    shouldStartTour,
    startTour,
    // setShouldStartTour,
  } = useOnboardingStore();

  const [showOnborda, setShowOnborda] = useState(false);
  const [activeSteps, setActiveSteps] = useState(onboardingSteps);

  // Additional logging for showOnborda changes
  useEffect(() => {
    console.log("showOnborda state changed to:", showOnborda);
  }, [showOnborda]);

  // Check if we should start the tour
  useEffect(() => {
    // Debug logging
    console.log("InteractiveOnboarding - Checking conditions:", {
      user: !!user,
      has_seen_onboarding: user?.has_seen_onboarding,
      hasSeenInteractiveTour,
      shouldStartTour,
      pathname,
      tourActive,
    });

    // Only show tour if:
    // 1. User is authenticated
    // 2. User has completed user setup (has_seen_onboarding)
    // 3. User hasn't seen the interactive tour yet
    // 4. User is on the primary edit page
    // 5. shouldStartTour flag is true (set by user setup completion)
    const shouldStart =
      user &&
      user.has_seen_onboarding &&
      !hasSeenInteractiveTour &&
      pathname === "/qwirls/primary/edit" &&
      shouldStartTour;

    console.log("Should start tour:", shouldStart);

    if (shouldStart && !tourActive) {
      console.log("Tour conditions met! Starting in 1.5s...");

      // Increased delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        const missing: string[] = [];

        // Build filtered steps: remove steps whose selectors are missing
        const filtered = onboardingSteps.map((group) => {
          const kept = group.steps.filter((s) => {
            if (!s.selector) return true;
            const el = document.querySelector(s.selector as string);
            if (!el) {
              missing.push(s.selector as string);
              return false;
            }
            return true;
          });
          return { ...group, steps: kept };
        });

        if (missing.length > 0) {
          console.warn(
            "Onboarding: missing step targets, these will be skipped:",
            missing
          );
        }

        // If every group's steps would be empty, don't start the tour
        const hasAny = filtered.some((g) => g.steps.length > 0);
        if (!hasAny) {
          console.warn(
            "Onboarding: No valid steps found in the DOM, aborting tour start."
          );
          return;
        }

        // Save and start
        setActiveSteps(filtered);
        console.log(
          "🎉 Starting tour NOW! filtered step counts:",
          filtered.map((g) => g.steps.length)
        );
        console.log("Setting tourActive to true and showOnborda to true");
        startTour();
        // Force set showOnborda immediately
        setShowOnborda(true);
      }, 1500);

      return () => {
        console.log("Cleanup: clearing tour start timer");
        clearTimeout(timer);
      };
    } else if (!shouldStart) {
      console.log("Tour conditions NOT met. Reasons:", {
        noUser: !user,
        noSetupComplete: !user?.has_seen_onboarding,
        alreadySeenTour: hasSeenInteractiveTour,
        wrongPage: pathname !== "/qwirls/primary/edit",
        noStartFlag: !shouldStartTour,
        alreadyActive: tourActive,
      });
    }
  }, [
    user,
    pathname,
    hasSeenInteractiveTour,
    shouldStartTour,
    tourActive,
    startTour,
  ]);

  // Sync tour visibility with store
  useEffect(() => {
    console.log("Setting showOnborda to:", tourActive);
    setShowOnborda(tourActive);
  }, [tourActive]);

  console.log("Rendering Onborda with showOnborda:", showOnborda);

  return (
    <OnbordaProvider>
      <Onborda
        steps={activeSteps}
        showOnborda={showOnborda}
        shadowRgb="0,0,0"
        shadowOpacity="0.3"
        cardComponent={OnbordaCard}
        cardTransition={{ duration: 0.3, type: "spring" }}
      >
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}
