"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Edit3,
  Share2,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  BarChart3,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

interface OwnQwirlPreviewProps {
  qwirl: {
    id: string;
    pollCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  stats: {
    totalResponses: number;
    completionRate: number;
    totalComments: number;
    recentResponses: Array<{
      userName: string;
      userAvatar?: string;
      completedAt: Date;
      wavelengthScore: number;
    }>;
  };
  onShare?: () => void;
  onViewResponses?: () => void;
}

export function OwnQwirlPreview({
  qwirl,
  stats,
  onShare,
  onViewResponses,
}: OwnQwirlPreviewProps) {
  const router = useRouter();
  const timeAgo = dayjs(qwirl.updatedAt).fromNow();
  const averageWavelength =
    stats.recentResponses.length > 0
      ? Math.round(
          stats.recentResponses.reduce((sum, r) => sum + r.wavelengthScore, 0) /
            stats.recentResponses.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Main Preview Card */}
      <Card className=" shadow-lg overflow-hidden bg-white border border-primary">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">
                  Your Primary Qwirl
                </span>
              </div>
              <p className="text-sm opacity-75">
                {qwirl.pollCount} questions • Updated {timeAgo}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalResponses}</div>
              <div className="text-sm opacity-75">responses</div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card text-card-foreground rounded-lg">
                <div className="text-2xl font-bold">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-card text-card-foreground rounded-lg">
                <div className="text-2xl font-bold">{averageWavelength}%</div>
                <div className="text-sm text-gray-600">Avg Wavelength</div>
              </div>
              <div className="text-center p-4 bg-card text-card-foreground rounded-lg">
                <div className="text-2xl font-bold">{stats.totalComments}</div>
                <div className="text-sm text-gray-600">Comments</div>
              </div>
            </div>

            {/* Recent Activity */}
            {stats.recentResponses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Recent Responses
                </h3>
                <div className="space-y-2">
                  {stats.recentResponses.slice(0, 3).map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={response.userAvatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {response.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {response.userName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dayjs(response.completedAt).fromNow()}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          response.wavelengthScore >= 70
                            ? "bg-green-100 text-green-700"
                            : response.wavelengthScore >= 40
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {response.wavelengthScore}% match
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push(`/qwirl/primary?tab=edit`)}
                variant="outline"
                icon={Edit3}
                iconPlacement="left"
                className="flex items-center gap-2 bg-transparent"
              >
                Edit Qwirl
              </Button>
              <Button
                onClick={() => router.push(`/qwirl/primary?tab=view`)}
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
                onClick={onShare}
                className="flex items-center gap-2"
              >
                Share Qwirl
              </Button>
              <Button
                onClick={onViewResponses}
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExternalLink className="h-4 w-4" />
                  <span>qwirl.app/{qwirl.id}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  icon={Copy}
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
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Qwirl Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.totalResponses === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium mb-1">No responses yet</h3>
              <p className="text-sm">
                Share your qwirl to start getting responses!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Engagement Level</span>
                <span className="font-medium">
                  {stats.completionRate >= 80
                    ? "Excellent"
                    : stats.completionRate >= 60
                    ? "Good"
                    : stats.completionRate >= 40
                    ? "Fair"
                    : "Needs Improvement"}
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />

              <div className="text-xs text-gray-500 space-y-1">
                <p>• {stats.totalResponses} people have started your qwirl</p>
                <p>
                  •{" "}
                  {Math.round(
                    stats.totalResponses * (stats.completionRate / 100)
                  )}{" "}
                  completed it fully
                </p>
                {stats.totalComments > 0 && (
                  <p>• {stats.totalComments} thoughtful comments left</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
