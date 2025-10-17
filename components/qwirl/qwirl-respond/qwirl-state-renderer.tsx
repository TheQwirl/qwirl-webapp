import React from "react";
import { OtherUser } from "@/components/profile/types";
import { Qwirl } from "@/components/qwirl/types";
import { CONSTANTS } from "@/constants/qwirl-respond";
import CompletedPanel from "@/components/qwirl/qwirl-respond/completed-panel";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import { authStore } from "@/stores/useAuthStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

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
  user: OtherUser | undefined;
  data: Qwirl | undefined;
  pollsLength: number;
  newCount: number;
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
  const { user: currentUser } = authStore();

  // Loading state
  if (isLoading || isCoverLoading || !user) {
    return <QwirlCoverSkeleton />;
  }

  const getUserVariant = () => {
    if (!currentUser) return "guest";
    if (currentUser.id === user.id) return "owner";
    return "visitor";
  };

  const isIncompleteQwirl = Boolean(
    currentUser && !isLoading && pollsLength < CONSTANTS.MIN_QWIRL_POLLS
  );

  if (!showInteractive || isIncompleteQwirl) {
    return (
      <div className="w-full max-w-md mx-auto">
        <QwirlCover
          qwirlCoverData={{
            background_image: qwirlCoverData?.background_image,
            title: qwirlCoverData?.title,
            description: qwirlCoverData?.description,
            totalPolls: pollsLength,
          }}
          user={{
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            categories: user.categories,
          }}
          onButtonClick={handleShowInteractive}
          onNotifyMe={handleNotifyMe}
          hasExistingSession={false} // TODO: Check if session exists based on proper session data
          variant={getUserVariant()}
          isIncomplete={isIncompleteQwirl}
        />
      </div>
    );
  }

  if (isCompleted && !isReviewMode && !isAnsweringNew) {
    return (
      <div className="space-y-4">
        <CompletedPanel
          data={data}
          newCount={newCount}
          wavelength={user?.relationship?.wavelength ?? 0}
          userName={user?.name ?? null}
          onStartReview={startReview}
          onStartAnsweringNew={startAnsweringNew}
        />
      </div>
    );
  }

  // Interactive state
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-md border">
      <CardHeader className="flex-row items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user?.name || "NA"}
            image="https://avatar.iran.liara.run/public/boy?username="
            ringed
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
