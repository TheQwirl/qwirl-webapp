import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenSetup: boolean;
  hasSeenInteractiveTour: boolean;
  currentTourStep: number;
  tourActive: boolean;
  shouldStartTour: boolean; // New flag to trigger tour

  // Actions
  setHasSeenSetup: (seen: boolean) => void;
  setHasSeenInteractiveTour: (seen: boolean) => void;
  setCurrentTourStep: (step: number) => void;
  setShouldStartTour: (should: boolean) => void;
  startTour: () => void;
  endTour: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenSetup: false,
      hasSeenInteractiveTour: false,
      currentTourStep: 0,
      tourActive: false,
      shouldStartTour: false,

      setHasSeenSetup: (seen) => set({ hasSeenSetup: seen }),

      setHasSeenInteractiveTour: (seen) =>
        set({ hasSeenInteractiveTour: seen }),

      setCurrentTourStep: (step) => set({ currentTourStep: step }),

      setShouldStartTour: (should) => {
        console.log("useOnboardingStore: setShouldStartTour", should);
        set({ shouldStartTour: should });
      },

      startTour: () => {
        console.log("useOnboardingStore: Starting tour");
        set({ tourActive: true, currentTourStep: 0, shouldStartTour: false });
      },

      endTour: () => {
        console.log("useOnboardingStore: Ending tour");
        set({
          tourActive: false,
          hasSeenInteractiveTour: true,
          shouldStartTour: false,
        });
      },

      resetOnboarding: () =>
        set({
          hasSeenSetup: false,
          hasSeenInteractiveTour: false,
          currentTourStep: 0,
          tourActive: false,
          shouldStartTour: false,
        }),
    }),
    {
      name: "qwirl-onboarding-storage",
    }
  )
);
