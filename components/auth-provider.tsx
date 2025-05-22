import { createContext, useContext, useEffect, ReactNode } from "react";
import { useStore } from "zustand";
import { authStore } from "@/stores/useAuthStore";

const AuthContext = createContext<typeof authStore | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    console.log("AuthProvider: Mounting, triggering initialize");
    // const initialize = async () => {
    //   await authStore.getState().initialize();
    // };
    // initialize();
    return () => {
      console.log("AuthProvider: Unmounting");
    };
  }, []);

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const store = useContext(AuthContext);
  if (!store) throw new Error("useAuth must be used within an AuthProvider");
  return useStore(store);
};
