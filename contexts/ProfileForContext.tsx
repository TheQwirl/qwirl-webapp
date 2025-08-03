import { MyUser, OtherUser } from "@/components/profile/types";
import { createContext, useContext } from "react";

// type ProfileFor = "self" | "other";

interface MyProfileContextType {
  profileFor: "self";
  user: MyUser | undefined;
}

interface OtherProfileContextType {
  profileFor: "other";
  user: OtherUser | undefined;
}

type ProfileContextType = MyProfileContextType | OtherProfileContextType;

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

type ProfileProviderProps =
  | { profileFor: "self"; user: MyUser | undefined; children: React.ReactNode }
  | {
      profileFor: "other";
      user: OtherUser | undefined;
      children: React.ReactNode;
    };

export function ProfileProvider(props: ProfileProviderProps) {
  const { children, ...rest } = props;
  return (
    <ProfileContext.Provider value={{ ...rest }}>
      {children}
    </ProfileContext.Provider>
  );
}
