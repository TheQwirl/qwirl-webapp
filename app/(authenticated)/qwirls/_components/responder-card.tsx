"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import WavelengthIndicator from "@/components/wavelength-indicator";

type ResponderData = {
  id: number;
  name: string | null;
  username: string;
  avatar: string | null;
  session_id: number;
  status: string;
  started_at: string;
  completed_at?: string | null | undefined;
  response_count: number;
  wavelength: number;
};

interface ResponderCardProps {
  responder: ResponderData;
  index?: number;
  total_qwirl_polls: number;
  onClick?: (responderId: number) => void;
}

export const ResponderCard: React.FC<ResponderCardProps> = ({
  responder,
  index = 0,
  onClick,
  total_qwirl_polls,
}) => {
  const router = useRouter();
  const isCompleted = responder.status === "completed";

  const handleCardClick = () => {
    if (onClick) {
      onClick(responder.id);
    } else {
      router.push(`/qwirls/primary/insights?responder=${responder.id}`);
    }
  };

  const completedTimeAgo = responder.completed_at
    ? formatDistanceToNow(new Date(responder.completed_at), { addSuffix: true })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer w-full"
      onClick={handleCardClick}
    >
      <Card className="w-full bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 shadow-sm group overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            {/* Left section - User info */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <UserAvatar
                  image={responder.avatar || ""}
                  name={responder.name || responder.username}
                  size="lg"
                  ringed
                  className="transition-all duration-300"
                />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {responder.name || responder.username}
                  </h3>
                  {responder.name && (
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      @{responder.username}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {responder.response_count} / {total_qwirl_polls} Responses
                  </div>
                  {completedTimeAgo && (
                    <>
                      <span className="hidden sm:inline text-muted-foreground">
                        •
                      </span>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Completed {completedTimeAgo}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right section - Wavelength and action */}
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              {/* Wavelength indicator - only show if completed */}
              {isCompleted && (
                <WavelengthIndicator
                  userName={responder.username}
                  wavelength={responder.wavelength}
                  variant="compact-horizontal"
                />
              )}

              {/* Action button */}
              <Button
                variant="ghost"
                className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-full border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
