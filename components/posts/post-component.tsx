"use client";

import { forwardRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Share, Clock } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserAvatar } from "../user-avatar";
import { components } from "@/lib/api/v1-client-side";
import { GoHeart, GoHeartFill } from "react-icons/go";
import clsx from "clsx";
import { getFirstName } from "@/lib/utils";
import PollTimer from "../poll-timer";

dayjs.extend(relativeTime);

type Post = components["schemas"]["PostFetchByID"];
interface PostComponentProps {
  post: Post;
  user?: {
    name?: string | null;
    avatar?: string | null;
    username?: string | null;
  };
  onOptionSelect?: (postId: string, optionId: number) => void;
  onLike?: (postId: string, isLiked: boolean) => void;
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

    const getResultsForOption = (option_id: number) => {
      if (!post.results) return null;
      return post.results.find((result) => result.option_id === option_id);
    };

    const getPercentageForOption = (option_id: number) => {
      const result = getResultsForOption(option_id);
      if (!result || totalVotes === 0) return 0;
      return Math.round(((result.vote_count ?? 0) / totalVotes) * 100);
    };

    const handleOptionClick = (optionIndex: number) => {
      if (shouldShowResults) return;
      setSelectedOption(optionIndex);
      if (post?.options?.[optionIndex]?.option_id) {
        onOptionSelect?.(post.id, post?.options?.[optionIndex]?.option_id);
      }
    };

    return (
      <Card
        ref={ref}
        className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={user?.name ?? undefined}
                  image={user?.avatar ?? undefined}
                  size="sm"
                />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">
                    {user?.name || "Anonymous"}
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-none">
                    {user?.username}
                  </div>
                </div>
              </div>

              {post.duration && (
                <PollTimer
                  createdAt={post.created_at}
                  duration={post.duration}
                  showDays
                  showHours
                  variant="default"
                  size="sm"
                />
              )}
            </div>

            <div className="space-y-4">
              {post.text_content && (
                <div>
                  <p className="text-gray-900 leading-relaxed">
                    {post.text_content}
                  </p>
                </div>
              )}

              {isPollPost && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {post.question_text}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {post?.options?.map((option, index) => {
                      const isMyChoice =
                        selectedOption === index ||
                        post.my_selected_option_index === index;
                      const isAuthorChoice =
                        !post.is_mine &&
                        post.author_selected_option_index === index;
                      const optionResult = getResultsForOption(
                        option?.option_id
                      );
                      const percentage = getPercentageForOption(
                        option?.option_id
                      );
                      const canClick = !shouldShowResults;

                      return (
                        <motion.div
                          key={index}
                          whileHover={canClick ? { scale: 1.01 } : {}}
                          whileTap={canClick ? { scale: 0.99 } : {}}
                          className="flex items-center gap-4 relative z-10"
                        >
                          <button
                            onClick={() => handleOptionClick(index)}
                            disabled={!canClick}
                            className={clsx(
                              "bg-background text-foreground relative w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
                              {
                                // "bg-gradient-to-r from-primary-50 to-purple-100 border-gray-300 shadow-lg shadow-primary-200/50":
                                //   isMyChoice && shouldShowResults,
                                // "bg-gradient-to-r from-secondary-50 to-secondary-100 border-gray-300 shadow-lg shadow-blue-200/50":
                                //   isAuthorChoice &&
                                //   shouldShowResults &&
                                //   !post.is_mine,
                                // "bg-gray-50 border-gray-200":
                                //   shouldShowResults &&
                                //   !isMyChoice &&
                                //   !(isAuthorChoice && !post.is_mine),
                                // "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer":
                                //   !shouldShowResults,
                                "shadow-lg":
                                  isMyChoice ||
                                  (isAuthorChoice && shouldShowResults),
                                "hover:shadow-md cursor-pointer":
                                  !shouldShowResults,
                              }
                            )}
                          >
                            {/* Background percentage bar */}
                            {shouldShowResults &&
                              optionResult &&
                              totalVotes > 0 && (
                                <motion.div
                                  className="h-full absolute inset-0  bg-accent rounded-xl transition-all duration-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    delay: 0.2 + index * 0.1,
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    bounce: 0.5,
                                  }}
                                />
                              )}

                            <div className="relative flex items-center justify-between">
                              <span className="text-gray-900 font-medium">
                                {option?.option_text}
                              </span>
                              <div className="flex items-center gap-3">
                                {isMyChoice && shouldShowResults && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-background text-foreground rounded-full flex items-center gap-1"
                                  >
                                    <div className="rounded-full h-3 w-3 bg-primary" />
                                    {post.is_mine ? "Me" : "You"}
                                  </Badge>
                                )}

                                {isAuthorChoice &&
                                  shouldShowResults &&
                                  !post.is_mine && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-background text-foreground rounded-full flex items-center gap-1"
                                    >
                                      <div className="rounded-full h-3 w-3 bg-secondary" />
                                      {getFirstName(user?.name) ?? user?.name}
                                    </Badge>
                                  )}
                                {shouldShowResults && optionResult && (
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    {/* <span className="text-gray-600">
                                    {optionResult.vote_count}
                                  </span> */}
                                    <span className="text-purple-600">
                                      {percentage}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {shouldShowResults && totalVotes > 0 && (
                    <div className="flex items-center divide-gray-200 divide-x-2 text-sm text-gray-500 py-3 border-y border-gray-100">
                      <div className="flex items-center gap-1 pr-2">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo}</span>
                      </div>
                      <div className="px-2">
                        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
                      </div>
                      <div className="pl-2">
                        {post.created_at !== post.updated_at && (
                          <span>Edited {dayjs(post.updated_at).fromNow()}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => onLike?.(post?.id, post?.is_liked ?? false)}
                icon={post?.is_liked ? GoHeartFill : GoHeart}
                iconPlacement="left"
                className="text-gray-500 hover:text-red-500"
              >
                {post?.likes_count ?? 0}
              </Button>

              <Button
                variant="link"
                size="sm"
                onClick={onComment}
                icon={MessageCircle}
                iconPlacement="left"
                className="text-gray-500 hover:text-blue-500"
              >
                {post?.comments_count ?? 0}
              </Button>

              <Button
                variant="link"
                size="sm"
                onClick={onShare}
                icon={Share}
                iconPlacement="left"
                className="text-gray-500 hover:text-green-500"
              >
                {post?.shares_count ?? 0}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PostComponent.displayName = "PostComponent";
export default PostComponent;
