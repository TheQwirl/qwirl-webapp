"use client";
import { authStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export function AuthDebugger() {
  const { user, isAuthenticated, isLoading } = authStore();

  useEffect(() => {
    console.log("AuthDebugger - Auth state:", {
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      isAuthenticated,
      isLoading,
    });
  }, [user, isAuthenticated, isLoading]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-2">Auth Debug:</div>
      <div>Loading: {isLoading ? "true" : "false"}</div>
      <div>Authenticated: {isAuthenticated ? "true" : "false"}</div>
      <div>User: {user ? user.name || user.email : "null"}</div>
    </div>
  );
}
