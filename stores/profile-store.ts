import { create } from "zustand";
import { MyUser, OtherUser } from "@/components/profile/types";
import { components } from "@/lib/api/v1-client-side";

type ProfileState =
  | { profileFor: "self"; user: MyUser | undefined }
  | {
      profileFor: "other";
      user:
        | OtherUser
        | components["schemas"]["UserProfileResponse"]
        | undefined;
    };

interface ProfileActions {
  setProfileData: (data: ProfileState) => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
  profileFor: "self",
  user: undefined,
  setProfileData: (data) => set(data),
}));
