import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { UserAvatar } from "@/components/user-avatar";

interface PostInitiatorProps {
  handleExpand: () => void;
}

const PostInitiator = ({ handleExpand }: PostInitiatorProps) => {
  const user = authStore((s) => s.user);

  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-3 sm:px-4 sm:py-6"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <UserAvatar
          size={"md"}
          image={user?.avatar ?? undefined}
          name={user?.name ?? undefined}
        />
        <div
          className="flex-1 bg-muted text-muted-foreground rounded-xl px-3 sm:px-4 py-2 sm:py-3 cursor-text hover:shadow-md transition-all text-sm sm:text-base"
          onClick={handleExpand}
        >
          What&apos;s on your mind? Create a poll...
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExpand}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PostInitiator;
