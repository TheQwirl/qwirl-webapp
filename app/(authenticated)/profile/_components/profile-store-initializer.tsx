"use client";

import { MyUser, OtherUser } from "@/components/profile/types";
import { useProfileStore } from "@/stores/profile-store";
import { useRef } from "react";

type InitializerProps =
  | { profileFor: "self"; user: MyUser | undefined }
  | { profileFor: "other"; user: OtherUser | undefined };

function ProfileStoreInitializer({ profileFor, user }: InitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    switch (profileFor) {
      case "self":
        useProfileStore.setState({ profileFor, user });
        break;
      case "other":
        useProfileStore.setState({ profileFor, user });
        break;
      default:
        throw new Error("Invalid profileFor value");
    }
    initialized.current = true;
  }

  return null;
}

export default ProfileStoreInitializer;
