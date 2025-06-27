import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { UserAvatar } from "@/components/user-avatar";
import { useFormContext } from "react-hook-form";
import { PostCreatorData } from "./schema";

export function PostPreview() {
  const user = authStore((s) => s.user);
  const { getValues } = useFormContext<PostCreatorData>();
  const content = getValues("content");
  const question = getValues("question");
  const pollOptions = getValues("pollOptions");
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border-t  p-3 sm:p-4"
    >
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-medium text-gray-600">Preview:</p>
        <div className=" bg-secondary/10 border rounded-lg p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <UserAvatar
              name={user?.name ?? undefined}
              image={user?.avatar ?? undefined}
              size={"sm"}
            />
            <div>
              <p className="font-medium text-xs sm:text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>

          {content && <p className="text-xs sm:text-sm">{content}</p>}

          <div className="space-y-2 sm:space-y-3">
            <p className="font-medium text-sm sm:text-base">{question}</p>
            <div className="space-y-1 sm:space-y-2">
              {pollOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 sm:gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm">{option.text}</span>
                  <span className="text-xs text-gray-500 ml-auto">0%</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0 votes</span>
              <span>24 hours left</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 pt-2 border-t">
            <Button
              icon={Heart}
              iconPlacement="left"
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm"
            >
              Like
            </Button>
            <Button
              icon={MessageCircle}
              iconPlacement="left"
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm"
            >
              Comment
            </Button>
            <Button
              variant="ghost"
              icon={Share}
              iconPlacement="left"
              size="sm"
              className="text-xs sm:text-sm"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
