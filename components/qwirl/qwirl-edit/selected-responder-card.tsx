import { QwirlResponder } from "@/types/qwirl";
import dayjs from "dayjs";
import React from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserAvatar } from "@/components/user-avatar";
import { X } from "lucide-react";

dayjs.extend(relativeTime);
interface SelectedResponderCardProps {
  responder: QwirlResponder;
  onClose: () => void;
}
const SelectedResponderCard: React.FC<SelectedResponderCardProps> = ({
  responder,
  onClose,
}) => {
  return (
    <div className="relative flex items-center gap-2 p-2 bg-card rounded-xl border shadow-sm transition-shadow">
      <X
        onClick={onClose}
        className="absolute top-[6px] right-[6px] cursor-pointer w-3 h-3"
      />

      <UserAvatar
        image={responder.avatar ?? ""}
        name={responder.name ?? ""}
        size={"sm"}
        linkTo={`/qwirl/${responder.username}`}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">
            {responder.name}
          </span>
        </div>
        <div className="flex items-center divide-x text-muted-foreground text-[8px]">
          <div className="pr-1">{responder.response_count} answered</div>
          {responder.started_at && (
            <div className="pl-1">{dayjs(responder.started_at).fromNow()}</div>
          )}
        </div>
      </div>

      {/* Response count */}
    </div>
  );
};

export default SelectedResponderCard;
