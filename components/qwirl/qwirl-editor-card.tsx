import Image from "next/image";
import React from "react";
import { SortableList } from "../sortable-list/sortable-list";
import { Badge } from "@/components/ui/badge";
import { QwirlItem } from "./types";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";
import PollOption from "./poll-option";

type Props = {
  poll: QwirlItem;
  className?: string;
  handleDelete: () => void;
  isDeleting: boolean;
};

const QwirlEditorCard: React.FC<Props> = ({
  poll,
  className,
  handleDelete,
}) => {
  return (
    <Card
      className={clsx(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-lg border-l-4 border-l-primary/20 hover:border-l-primary/60",
        "bg-white/80 backdrop-blur-sm",
        className
      )}
    >
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <SortableList.DragHandle />

          <div className="flex-1 space-y-4 min-w-0">
            <h3 className="text-lg font-semibold leading-tight line-clamp-2">
              {poll.question_text}
            </h3>

            {/* Image placeholder - ready for future implementation */}
            {false && (
              <div className="relative">
                <Image
                  src={""}
                  alt="Poll image"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-gray-700"
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Image
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {poll?.options?.map((option, optionIndex) => {
                const isMyChoice = poll?.owner_answer === option;
                return (
                  <motion.div
                    key={optionIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: optionIndex * 0.05 }}
                  >
                    <PollOption
                      option={option}
                      optionNumber={optionIndex + 1}
                      variant="display"
                      isMyChoice={isMyChoice}
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Badge variant="outline" className="text-xs">
                #{poll.position}
              </Badge>
              <span className="text-xs">{poll.options.length} options</span>
              <div className="flex-shrink-0 block lg:hidden">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  size="sm"
                  className="h-8 w-8 p-0 hover:scale-105 transition-transform duration-200"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const QwirlEdiorCardLoading: React.FC = () => {
  return (
    <Card className="border-0 bg-white shadow-sm transition-shadow hover:shadow-md animate-pulse">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />

            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="bg-gray-100 w-full p-3 rounded-xl" key={index}>
                  <Skeleton
                    className={clsx("h-5", {
                      "w-3/4": index % 2 === 0,
                      "w-1/2": index % 2 !== 0,
                    })}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="rounded-full w-12 h-5" />
              <Skeleton className="h-4 w-16" />
              <div className="flex-shrink-0 block lg:hidden">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 hidden lg:block">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QwirlEditorCard;
