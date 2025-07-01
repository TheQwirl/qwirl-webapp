import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { authStore } from "@/stores/useAuthStore";
import { X, Eye, EyeOff } from "lucide-react";

interface PostCreatorHeaderProps {
  showPreview: boolean;
  hasPollOptions: boolean;
  onTogglePreview: () => void;
  onCollapse: () => void;
}

export function PostCreatorHeader({
  showPreview,
  hasPollOptions,
  onTogglePreview,
  onCollapse,
}: PostCreatorHeaderProps) {
  const user = authStore((s) => s.user);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <UserAvatar
          image={user?.avatar ?? undefined}
          name={user?.name ?? undefined}
          size="sm"
          loading={!user}
          rounded={true}
          ringed={true}
        />
        <div>
          <p className="font-medium text-xs sm:text-sm">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        {hasPollOptions && (
          <Button
            variant="outline"
            size="sm"
            icon={showPreview ? EyeOff : Eye}
            iconPlacement="left"
            onClick={onTogglePreview}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline">
              {showPreview ? "Hide" : "Preview"}
            </span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
