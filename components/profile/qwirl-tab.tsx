import { UserAvatar } from "../user-avatar";
import QwirlRespond from "../qwirl/qwirl-respond";
import { useProfile } from "@/contexts/ProfileForContext";
import { Button } from "../ui/button";

export default function QwirlTab() {
  const { user, profileFor } = useProfile();
  return (
    <div className="bg-white p-4 rounded-2xl space-y-4">
      <div className="flex items-center gap-3">
        <UserAvatar
          image={user?.avatar ?? ""}
          loading={!user}
          name={user?.name ?? undefined}
          size={"md"}
        />
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {user?.name}
          </h2>
          <p className="text-xs text-gray-600">{user?.username}</p>
        </div>
      </div>
      {profileFor === "other" ? (
        <QwirlRespond user={user} />
      ) : (
        <div className="flex items-center justify-end space-x-2">
          <Button>Edit Qwirl</Button>
          <Button variant={"ghost"}>View Qwirl</Button>
        </div>
      )}
    </div>
  );
}
