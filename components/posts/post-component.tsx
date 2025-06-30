"use client";

import { forwardRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Clock } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserAvatar } from "../user-avatar";
import { components } from "@/lib/api/v1-client-side";

dayjs.extend(relativeTime);

type ReturnedPost = components["schemas"]["PostFetchByID"];
type Post = {
  results?: Record<string, never>[] | null;
} & ReturnedPost;
interface PostComponentProps {
  post: Post;
  user?: {
    name?: string | null;
    avatar?: string | null;
  };
  onOptionSelect?: (optionIndex: number) => void;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

const PostComponent = forwardRef<HTMLDivElement, PostComponentProps>(
  ({ post, user, onOptionSelect, onLike, onShare, onComment }, ref) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(
      post.my_selected_option_index ?? null
    );

    const shouldShowResults =
      post.is_mine ||
      (post.my_selected_option_index !== null &&
        post.my_selected_option_index !== undefined);
    const isPollPost =
      post.question_text && post.options && post.options.length > 0;
    const timeAgo = dayjs(post.created_at).fromNow();

    const totalVotes =
      post.results?.reduce(
        (sum, result) => sum + (result?.vote_count || 0),
        0
      ) || 0;

    const getResultsForOption = (optionText: string) => {
      if (!post.results) return null;
      return post.results.find((result) => result.option_text === optionText);
    };

    const getPercentageForOption = (optionText: string) => {
      const result = getResultsForOption(optionText);
      if (!result || totalVotes === 0) return 0;
      return Math.round(((result.vote_count ?? 0) / totalVotes) * 100);
    };

    const handleOptionClick = (optionIndex: number) => {
      if (shouldShowResults) return;
      setSelectedOption(optionIndex);
      onOptionSelect?.(optionIndex);
    };

    return (
      <Card
        ref={ref}
        className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={user?.name ?? undefined}
                  image={user?.avatar ?? undefined}
                  size="sm"
                />
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {post.is_mine ? "You" : user?.name || "Anonymous"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
              </div>

              {post.duration && (
                <Badge variant="outline" className="text-xs">
                  {post.duration}h left
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Text Content */}
              {post.text_content && (
                <div>
                  <p className="text-gray-900 leading-relaxed">
                    {post.text_content}
                  </p>
                </div>
              )}

              {/* Poll Content */}
              {isPollPost && (
                <div className="space-y-4">
                  {/* Question */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {post.question_text}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {post.options!.map((option, index) => {
                      const isMyChoice =
                        selectedOption === index ||
                        post.my_selected_option_index === index;
                      const isAuthorChoice =
                        !post.is_mine &&
                        post.author_selected_option_index === index;
                      const optionResult = getResultsForOption(option);
                      const percentage = getPercentageForOption(option);
                      const canClick = !shouldShowResults;

                      return (
                        <motion.div
                          key={index}
                          whileHover={canClick ? { scale: 1.01 } : {}}
                          whileTap={canClick ? { scale: 0.99 } : {}}
                        >
                          <button
                            onClick={() => handleOptionClick(index)}
                            disabled={!canClick}
                            className={`relative w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                              isMyChoice && shouldShowResults
                                ? "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 shadow-lg shadow-purple-200/50"
                                : isAuthorChoice &&
                                  shouldShowResults &&
                                  !post.is_mine
                                ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-lg shadow-blue-200/50"
                                : shouldShowResults
                                ? "bg-gray-50 border-gray-200"
                                : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer"
                            }`}
                          >
                            {/* Background percentage bar */}
                            {shouldShowResults &&
                              optionResult &&
                              totalVotes > 0 && (
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 rounded-xl transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              )}

                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-900 font-medium">
                                  {option}
                                </span>

                                {/* Show badges based on conditions */}
                                {isMyChoice && shouldShowResults && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-200 text-purple-800 text-xs"
                                  >
                                    {post.is_mine ? "My Choice" : "Your Choice"}
                                  </Badge>
                                )}

                                {/* Only show "Their Choice" if it's not my post */}
                                {isAuthorChoice &&
                                  shouldShowResults &&
                                  !post.is_mine && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-200 text-blue-800 text-xs"
                                    >
                                      Their Choice
                                    </Badge>
                                  )}
                              </div>

                              {/* Show stats if results should be displayed */}
                              {shouldShowResults && optionResult && (
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <span className="text-gray-600">
                                    {optionResult.vote_count}
                                  </span>
                                  <span className="text-purple-600">
                                    {percentage}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Poll Stats */}
                  {shouldShowResults && totalVotes > 0 && (
                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                      <span>
                        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  icon={Heart}
                  iconPlacement="left"
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                >
                  Like
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onComment}
                  icon={MessageCircle}
                  iconPlacement="left"
                  className="text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                >
                  Comment
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  icon={Share}
                  iconPlacement="left"
                  className="text-gray-500 hover:text-green-500 hover:bg-green-50"
                >
                  Share
                </Button>
              </div>

              {/* Additional info */}
              <div className="text-xs text-gray-400">
                {post.created_at !== post.updated_at && (
                  <span>Edited {dayjs(post.updated_at).fromNow()}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PostComponent.displayName = "PostComponent";
export default PostComponent;
