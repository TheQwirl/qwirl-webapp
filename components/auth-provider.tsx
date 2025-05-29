"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { useStore } from "zustand";
import { authStore, type AuthState } from "@/stores/useAuthStore";

const AuthContext = createContext<typeof authStore | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    console.log("AuthProvider: Mounting.");
    const state = authStore.getState();

    if (!state.isInitialized && !state.isLoading) {
      console.log("AuthProvider: Triggering store initialization.");
      authStore
        .getState()
        .initialize()
        .catch((err) => {
          console.error(
            "AuthProvider: Error during initialize() trigger that was not handled by the store action:",
            err
          );
          if (!authStore.getState().isInitialized) {
            authStore.setState({
              isLoading: false,
              isInitialized: true, // Mark as initialized even on failure to unblock UI
              error: "Initialization trigger failed unexpectedly.",
            });
          }
        });
    } else {
      console.log(
        "AuthProvider: Store initialization not triggered (already initialized or loading). isInitialized:",
        state.isInitialized,
        "isLoading:",
        state.isLoading
      );
    }
  }, []);

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const storeInstance = useContext(AuthContext);
  if (!storeInstance) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure your component is wrapped."
    );
  }
  const state = useStore(storeInstance);
  return state;
};
