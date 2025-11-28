import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import { QwirlResponder } from "@/types/qwirl";

interface ResponderSelectorProps {
  responders: QwirlResponder[];
  onResponderToggle: (id: number) => void;
}

const ResponderSelector: React.FC<ResponderSelectorProps> = ({
  responders,
  onResponderToggle,
}) => (
  <div>
    <Select
      value={""}
      onValueChange={(value) => onResponderToggle(Number(value))}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select responder" />
      </SelectTrigger>
      <SelectContent>
        {responders?.length ? (
          responders.map((user) => (
            <SelectItem
              key={user.id}
              value={user.id.toString()}
              className="text-xs sm:text-sm cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserAvatar
                  image={user.avatar ?? ""}
                  name={user.name ?? undefined}
                  size="sm"
                  rounded={true}
                />
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="px-4 py-2 text-xs sm:text-sm opacity-60">
            No responders yet
          </div>
        )}
      </SelectContent>
    </Select>
  </div>
);

export default ResponderSelector;
