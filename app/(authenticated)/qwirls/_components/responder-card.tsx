"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

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
};

interface ResponderCardProps {
  responder: ResponderData;
  index?: number;
}

export const ResponderCard: React.FC<ResponderCardProps> = ({
  responder,
  index = 0,
}) => {
  const router = useRouter();
  const isCompleted = responder.status === "completed";

  const getStatusConfig = () => {
    switch (responder.status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
          badge: "bg-primary/10 text-primary border-primary/20",
          progress: "bg-primary",
          textColor: "text-primary",
        };
      case "in_progress":
        return {
          icon: <Clock className="h-4 w-4 text-amber-600" />,
          badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
          progress: "bg-amber-500",
          textColor: "text-amber-600",
        };
      case "abandoned":
        return {
          icon: <XCircle className="h-4 w-4 text-destructive" />,
          badge: "bg-destructive/10 text-destructive border-destructive/20",
          progress: "bg-destructive",
          textColor: "text-destructive",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
          badge: "bg-muted text-muted-foreground border-border",
          progress: "bg-muted-foreground",
          textColor: "text-muted-foreground",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getProgressPercentage = () => {
    const totalQuestions = 15;
    return Math.round((responder.response_count / totalQuestions) * 100);
  };

  const handleCardClick = () => {
    if (isCompleted) {
      router.push(`/qwirls/primary/analytics?responder=${responder.id}`);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(responder.started_at), {
    addSuffix: true,
  });
  const completedTimeAgo = responder.completed_at
    ? formatDistanceToNow(new Date(responder.completed_at), { addSuffix: true })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={isCompleted ? { y: -3, transition: { duration: 0.2 } } : {}}
      whileTap={isCompleted ? { scale: 0.99 } : {}}
      className={isCompleted ? "cursor-pointer w-full" : "w-full"}
      onClick={handleCardClick}
    >
      <Card
        className={`w-full bg-card border transition-all duration-300 shadow-sm group overflow-hidden ${
          isCompleted
            ? "border-border/80 hover:border-primary/50 hover:shadow-lg"
            : "border-border/40 opacity-60"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            {/* Left section - User info */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 relative">
                <UserAvatar
                  image={responder.avatar || ""}
                  name={responder.name || responder.username}
                  size="lg"
                  ringed={isCompleted}
                  className="transition-all duration-300"
                />
                <div className="absolute -bottom-1 -right-1 bg-card p-0.5 rounded-full">
                  {statusConfig.icon}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className={`text-lg font-semibold ${
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {responder.name || responder.username}
                  </h3>
                  {responder.name && (
                    <span className="text-sm text-muted-foreground">
                      @{responder.username}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{responder.response_count} responses</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Started {timeAgo}</span>
                  </div>

                  {responder.status === "completed" && completedTimeAgo && (
                    <div
                      className={`flex items-center gap-1.5 ${statusConfig.textColor}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Completed {completedTimeAgo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right section - Progress and actions */}
            <div className="flex items-center gap-8">
              {/* Progress indicator */}
              <div className="flex flex-col items-center">
                <div className={`text-3xl font-bold ${statusConfig.textColor}`}>
                  {getProgressPercentage()}%
                </div>
                <div className="text-xs text-muted-foreground font-medium tracking-wide">
                  {responder.status === "completed"
                    ? "COMPLETED"
                    : "IN PROGRESS"}
                </div>
              </div>

              {/* Action button */}
              <Button
                variant="ghost"
                className={clsx("h-12 w-12 p-0 rounded-full border", {
                  "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300":
                    isCompleted,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
          <motion.div
            className={`h-1 ${statusConfig.progress}`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div> */}
      </Card>
    </motion.div>
  );
};
