import { UserAvatar } from "../user-avatar";
import QwirlRespond from "../qwirl/qwirl-respond";
import { useProfile } from "@/contexts/ProfileForContext";
import { OwnQwirlPreview } from "../qwirl/own-qwirl-preview";

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
        <OwnQwirlPreview
          // dummy data
          qwirl={{
            id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            pollCount: 0,
          }}
          onShare={() => {}}
          onViewResponses={() => {}}
          stats={{
            totalResponses: 0,
            completionRate: 0,
            totalComments: 0,
            recentResponses: [],
          }}
        />
      )}
    </div>
  );
}
