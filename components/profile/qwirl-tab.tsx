import React from "react";
import QwirlRespond from "../qwirl/qwirl-respond";
import { OwnQwirlPreview } from "../qwirl/own-qwirl-preview";
import { useProfileStore } from "@/stores/profile-store";
import { authStore } from "@/stores/useAuthStore";
import { OtherUser } from "./types";

function QwirlTabInner() {
  const { user, profileFor } = useProfileStore();
  const { user: loggedInUser } = authStore();

  return (
    <div className="space-y-4">
      {profileFor === "other" || user?.id !== loggedInUser?.id ? (
        <QwirlRespond user={user as OtherUser} />
      ) : (
        <OwnQwirlPreview user={user} />
      )}
    </div>
  );
}

const QwirlTab = React.memo(QwirlTabInner);
export default QwirlTab;
