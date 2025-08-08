import { create } from "zustand";
import { MyUser, OtherUser } from "@/components/profile/types";

type ProfileState =
  | { profileFor: "self"; user: MyUser | undefined }
  | { profileFor: "other"; user: OtherUser | undefined };

interface ProfileActions {
  setProfileData: (data: ProfileState) => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
  profileFor: "self",
  user: undefined,
  setProfileData: (data) => set(data),
}));
