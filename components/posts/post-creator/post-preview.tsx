import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle, Share } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { UserAvatar } from "@/components/user-avatar";
import { useFormContext } from "react-hook-form";
import { PostCreatorData } from "./schema";
import { GoHeart } from "react-icons/go";

export function PostPreview() {
  const user = authStore((s) => s.user);
  const { getValues } = useFormContext<PostCreatorData>();
  const content = getValues("text_content");
  const question = getValues("question_text");
  const pollOptions = getValues("pollOptions");
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border-t p-3 sm:p-4"
    >
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-medium text-gray-600">Preview:</p>
        <div className=" bg-white border rounded-lg p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <UserAvatar
              name={user?.name ?? undefined}
              image={user?.avatar ?? undefined}
              size={"sm"}
            />
            <div>
              <p className="font-medium text-xs sm:text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.username}</p>
            </div>
          </div>

          {content && <p className="text-xs sm:text-sm">{content}</p>}

          <div className="space-y-2 sm:space-y-3">
            <p className="font-medium text-sm sm:text-base">{question}</p>
            <div className="space-y-1 sm:space-y-2">
              {pollOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between bg-background text-foreground relative w-full p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-md cusror-pointer"
                >
                  <span className="text-xs sm:text-sm">{option.text}</span>
                  <span className="text-xs text-gray-500 ml-auto">0%</span>
                </div>
              ))}
            </div>

            <div className="flex items-center divide-gray-200 divide-x-2 text-sm text-gray-500 py-3 border-y border-gray-100">
              <div className="flex items-center gap-1 pr-2">
                <Clock className="h-3 w-3" />
                <span>2 minutes ago</span>
              </div>
              <div className="px-2">0 total votes</div>
            </div>
          </div>

          <div className="flex items-center justify-between ">
            <Button
              variant="link"
              size="sm"
              icon={GoHeart}
              iconPlacement="left"
              className="text-gray-500 hover:text-red-500"
            >
              0
            </Button>

            <Button
              variant="link"
              size="sm"
              icon={MessageCircle}
              iconPlacement="left"
              className="text-gray-500 hover:text-blue-500"
            >
              0
            </Button>

            <Button
              variant="link"
              size="sm"
              icon={Share}
              iconPlacement="left"
              className="text-gray-500 hover:text-green-500"
            >
              0
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
