import { createContext, useContext } from "react";

type ProfileFor = "self" | "other";

interface ProfileContextType {
  profileFor: ProfileFor;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

export function ProfileProvider({
  children,
  profileFor,
}: {
  children: React.ReactNode;
  profileFor: ProfileFor;
}) {
  return (
    <ProfileContext.Provider value={{ profileFor }}>
      {children}
    </ProfileContext.Provider>
  );
}
