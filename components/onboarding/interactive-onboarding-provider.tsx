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

      // Check if target elements exist
      const checkElements = () => {
        const welcomeEl = document.querySelector("#onboarding-welcome");
        const addPollBtn = document.querySelector("#add-poll-button");
        const libraryBtn = document.querySelector("#add-from-library-button");
        console.log("Target elements check:", {
          welcomeEl: !!welcomeEl,
          addPollBtn: !!addPollBtn,
          libraryBtn: !!libraryBtn,
        });
      };

      // Increased delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        checkElements();
        console.log("🎉 Starting tour NOW!");
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
        steps={onboardingSteps}
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
