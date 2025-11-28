import React from "react";
import { CONSTANTS } from "@/constants/qwirl-respond";
import QwirlCompletionCard from "@/components/qwirl/qwirl-respond/completed-panel";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import { authStore } from "@/stores/useAuthStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { components } from "@/lib/api/v1-client-side";

type QwirlCoverData = {
  id: number;
  background_image?: string | null;
  name?: string | null;
  description?: string | null;
  visibility?: boolean | null;
  title: string;
  type: string;
};

interface QwirlStateRendererProps {
  // Data
  user: components["schemas"]["UserProfileResponse"] | undefined;
  data: components["schemas"]["QwirlWithSession"] | undefined;
  pollsLength: number;
  newCount: number;
  unansweredCount: number;
  qwirlCoverData: QwirlCoverData | undefined;
  // States
  isLoading: boolean;
  isCoverLoading: boolean;
  isCompleted: boolean;
  isReviewMode: boolean;
  isAnsweringNew: boolean;
  showInteractive: boolean;
  // Handlers
  startReview: () => void;
  startAnsweringNew: () => void;
  handleShowInteractive: () => void;
  handleNotifyMe: () => void;
  // Children for interactive state
  children: React.ReactNode;
}

const QwirlStateRenderer: React.FC<QwirlStateRendererProps> = ({
  user,
  data,
  pollsLength,
  newCount,
  unansweredCount,
  qwirlCoverData,
  isLoading,
  isCoverLoading,
  isCompleted,
  isReviewMode,
  isAnsweringNew,
  showInteractive,
  startReview,
  startAnsweringNew,
  handleShowInteractive,
  handleNotifyMe,
  children,
}) => {
  const { user: currentUser, isAuthenticated } = authStore();

  // Loading state
  if (isLoading || isCoverLoading || !user) {
    return (
      <div className="w-full max-w-md mx-auto">
        <QwirlCoverSkeleton />
      </div>
    );
  }

  const getUserVariant = () => {
    if (!currentUser) return "guest";
    if (currentUser.id === user.id) return "owner";
    return "visitor";
  };

  const variant = getUserVariant();

  const isIncompleteQwirl = Boolean(
    !isLoading && isAuthenticated && pollsLength < CONSTANTS.MIN_QWIRL_POLLS
  );

  // Check if there are new unanswered questions (user has completed but owner added more)
  const hasNewUnansweredQuestions = unansweredCount > 0 && isCompleted;

  // Calculate answered count (including skipped as they are "responded to")
  const answeredCount = pollsLength - unansweredCount;

  // Show QwirlCover when:
  // 1. Qwirl is incomplete (less than minimum polls)
  // 2. User hasn't started yet (!showInteractive) AND not completed AND not in review mode
  // 3. There are new unanswered questions added by owner
  const shouldShowCover =
    isIncompleteQwirl ||
    (!showInteractive && !isCompleted && !isReviewMode) ||
    (hasNewUnansweredQuestions && !isReviewMode && !isAnsweringNew);

  if (shouldShowCover) {
    return (
      <div className="w-full max-w-md mx-auto">
        <QwirlCover
          qwirlCoverData={{
            background_image: qwirlCoverData?.background_image,
            title: qwirlCoverData?.title,
            description: hasNewUnansweredQuestions
              ? `${
                  user.name || user.username
                } has added ${unansweredCount} new question${
                  unansweredCount !== 1 ? "s" : ""
                } to their Qwirl! Come back and see what else you can discover about them.`
              : qwirlCoverData?.description,
            totalPolls: pollsLength,
            name: qwirlCoverData?.name,
          }}
          user={{
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            categories: user.categories,
          }}
          onButtonClick={handleShowInteractive}
          onNotifyMe={handleNotifyMe}
          onReview={startReview}
          variant={variant}
          isIncomplete={isIncompleteQwirl}
          answeredCount={answeredCount}
          totalQwirlQuestions={pollsLength}
          hasNewQuestions={hasNewUnansweredQuestions}
          previewOrReview={variant === "owner" ? "review" : "preview"}
          answeringStatus={
            data?.session_status === "in_progress"
              ? "in_progress"
              : data?.session_status === "completed"
              ? "completed"
              : undefined
          }
          isProfile
        />
      </div>
    );
  }

  if (isCompleted && !isReviewMode && !isAnsweringNew) {
    return (
      <div className="w-full max-w-md mx-auto">
        <QwirlCompletionCard
          data={data}
          newCount={newCount}
          wavelength={user?.relationship?.wavelength ?? 0}
          userName={user?.name ?? null}
          userAvatar={user?.avatar ?? null}
          username={user?.username ?? ""}
          userId={user?.id ?? 0}
          categories={user?.categories ?? []}
          backgroundImage={qwirlCoverData?.background_image}
          onStartReview={startReview}
          onStartAnsweringNew={startAnsweringNew}
        />
      </div>
    );
  }

  // Interactive state
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl bg-card/80 backdrop-blur-md border">
      <CardHeader className="flex-row items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user?.name || "NA"}
            image={user?.avatar || undefined}
            ringed
            className="shadow rounded-full"
          />
          <div>
            <p className="font-semibold text-foreground capitalize">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <>{children}</>
      </CardContent>
    </Card>
  );
};

export default QwirlStateRenderer;
