"use client";

import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Edit3,
  Share2,
  // TrendingUp,
  Users,
  // MessageSquare,
  Zap,
  BarChart3,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import $api from "@/lib/api/client";
import { MyUser } from "../profile/types";
import { toast } from "sonner";
import { UserAvatar } from "../user-avatar";
import { Skeleton } from "../ui/skeleton";

dayjs.extend(relativeTime);

interface OwnQwirlPreviewProps {
  user: MyUser | undefined;
}

export function OwnQwirlPreview({ user }: OwnQwirlPreviewProps) {
  const router = useRouter();

  const qwirlStatsQuery = $api.useQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/stats",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

  const qwirlRespondersQuery = $api.useQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/responders",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
        query: {
          limit: 3,
          // status: "completed",
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );
  function handleCopyLink() {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${user?.username}`
    );
    toast.success(
      "Link copied to clipboard: " +
        `${window.location.origin}/profile/${user?.username}`,
      {
        id: "copy-link",
      }
    );
  }

  // const timeAgo = dayjs(userQwirlQuery?.data?.).fromNow();

  return (
    <div className="space-y-6">
      {/* Main Preview Card */}
      <Card className=" overflow-hidden bordern-none">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">
                  Your Primary Qwirl
                </span>
              </div>
              {qwirlStatsQuery?.isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="text-sm opacity-75">
                  {qwirlStatsQuery?.data?.total_items} questions
                  {/* • Updated{" "}{timeAgo} */}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {qwirlStatsQuery?.data?.unique_responders}
              </div>
              <div className="text-sm opacity-75">responses</div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {qwirlStatsQuery?.data?.average_completion_rate}%
                </div>
                <div className="text-sm">Completion Rate</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {qwirlStatsQuery?.data?.in_progress_sessions}
                </div>
                <div className="text-sm">In Progress</div>
              </div>
              {/* bg-gradient-to-r from-red-50 via-red-100 to-red-200  */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {qwirlStatsQuery?.data?.completed_sessions}
                </div>
                <div className="text-sm">Completed</div>
              </div>
            </div>

            {/* Recent Activity */}
            {qwirlRespondersQuery?.data?.responders &&
              qwirlRespondersQuery?.data?.responders?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recent Responses
                  </h3>
                  <div className="space-y-2">
                    {qwirlRespondersQuery?.data?.responders?.map(
                      (responder, index) => (
                        <motion.div
                          key={responder.id ?? index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                          {/* Left section: Avatar + Info */}
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={responder?.name ?? undefined}
                              image={responder?.avatar ?? undefined}
                            />
                            <div className="flex flex-col leading-tight">
                              <span className="font-medium text-sm">
                                {responder.username}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {responder.completed_at && (
                                  <span>
                                    {dayjs(responder.completed_at).fromNow()}
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 rounded-full capitalize text-[10px] font-medium`}
                                >
                                  {responder.status.replace("_", " ")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px]">
                                  {responder.response_count} polls answered
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right section: Action button */}
                          <Button
                            onClick={() => {
                              router.push(`/qwirls/primary?tab=view`);
                            }}
                            variant="ghost"
                            size={"icon"}
                          >
                            <Eye />
                          </Button>
                        </motion.div>
                      )
                    )}
                  </div>

                  {/* <Badge
                    variant="secondary"
                    className={`text-xs ${
                      responder.wavelengthScore >= 70
                        ? "bg-green-100 text-green-700"
                        : responder.wavelengthScore >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {responder.wavelengthScore}% match
                  </Badge> */}
                </div>
              )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push(`/qwirls/primary?tab=edit`)}
                variant="outline"
                icon={Edit3}
                iconPlacement="left"
                className="flex items-center gap-2 bg-transparent"
              >
                Edit Qwirl
              </Button>
              <Button
                onClick={() => router.push(`/qwirls/primary?tab=view`)}
                variant="outline"
                icon={BarChart3}
                iconPlacement="left"
                className="flex items-center gap-2 bg-transparent"
              >
                View
              </Button>
              <Button
                icon={Share2}
                iconPlacement="left"
                onClick={handleCopyLink}
                className="flex items-center gap-2"
              >
                Share Qwirl
              </Button>
              <Button
                onClick={() => router.push(`/qwirls/primary?tab=view`)}
                variant="outline"
                icon={Eye}
                iconPlacement="left"
                className="flex items-center gap-2 bg-transparent"
              >
                View Responses
              </Button>
            </div>

            {/* Share Link Preview */}
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm ">
                  <ExternalLink className="h-4 w-4" />
                  <span>{`${window.location.origin}/profile/${user?.username}`}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  icon={Copy}
                  onClick={() => handleCopyLink()}
                  iconPlacement="left"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Card */}
      {/* <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Qwirl Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qwirlStatsQuery?.data?.total_responses === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium mb-1">No responses yet</h3>
              <p className="text-sm">
                Share your qwirl to start getting responses!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {!!qwirlStatsQuery?.data?.average_completion_rate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="">Engagement Level</span>
                  <span className="font-medium">
                    {qwirlStatsQuery?.data?.average_completion_rate >= 80
                      ? "Excellent"
                      : qwirlStatsQuery?.data?.average_completion_rate >= 60
                      ? "Good"
                      : qwirlStatsQuery?.data?.average_completion_rate >= 40
                      ? "Fair"
                      : "Needs Improvement"}
                  </span>
                </div>
              )}
              <Progress
                value={qwirlStatsQuery?.data?.average_completion_rate}
                className="h-2"
              />

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  • {qwirlStatsQuery?.data?.total_sessions} people have started
                  your qwirl
                </p>
                {!!qwirlStatsQuery?.data?.total_responses &&
                  !!qwirlStatsQuery?.data?.average_completion_rate && (
                    <p>
                      •{" "}
                      {Math.round(
                        qwirlStatsQuery?.data?.total_responses *
                          (qwirlStatsQuery?.data?.average_completion_rate / 100)
                      )}{" "}
                      completed it fully
                    </p>
                  )}
                {stats.totalComments > 0 && (
                  <p>• {stats.totalComments} thoughtful comments left</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
