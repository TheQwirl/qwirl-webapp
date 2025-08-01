import { TabItemProp } from "./types";
import { UserAvatar } from "../user-avatar";
import QwirlRespond from "../qwirl/qwirl-respond";

export default function QwirlTab({ user }: TabItemProp) {
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
      <QwirlRespond user={user} />
    </div>
  );
}
