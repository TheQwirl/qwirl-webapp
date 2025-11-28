"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

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
  // const isCompleted = responder.status === "completed";

  const handleCardClick = () => {
    if (onClick) {
      onClick(responder.id);
    } else {
      router.push(`/qwirls/primary/responses?responder=${responder.id}`);
    }
  };

  const progressTotal = Math.max(total_qwirl_polls, 0);
  const answeredCopy = `${responder.response_count} / ${progressTotal} answered`;

  // const activityDate = responder.completed_at || responder.started_at;
  // const formattedActivityDate = React.useMemo(() => {
  //   if (!activityDate) return null;
  //   const parsed = new Date(activityDate);
  //   if (Number.isNaN(parsed.getTime())) return null;
  //   return new Intl.DateTimeFormat(undefined, {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   }).format(parsed);
  // }, [activityDate]);

  const displayName = responder.name || responder.username;

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
      <Card className="group relative w-full overflow-hidden border border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-6 p-4 sm:p-5">
          <div className="flex gap-2 items-start justify-between">
            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <UserAvatar
                image={responder.avatar || ""}
                name={displayName}
                size="md"
                ringed
                className="transition-all duration-300 group-hover:ring-primary"
              />
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
                  {displayName}
                </h3>
                <div className=" flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                  {responder.name && (
                    <span className="truncate">@{responder.username}</span>
                  )}
                  <span className="font-medium text-foreground/80">
                    {answeredCopy}
                  </span>
                </div>
              </div>
            </div>
            {responder.wavelength && (
              <div className="flex flex-col-reverse items-start gap-3 text-left sm:flex-col sm:items-end sm:text-right">
                <WavelengthIndicator
                  wavelength={responder.wavelength}
                  variant="badge"
                />
              </div>
            )}
            <Button
              className="sm:hidden absolute right-4 bottom-4"
              size={"icon"}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
