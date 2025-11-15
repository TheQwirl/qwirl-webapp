"use client";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Library, Plus } from "lucide-react";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import QwirlEditorCard from "./qwirl-editor-card";

type VerticalEditViewProps = {
  onAddQuestion?: () => void;
  onOpenLibrary?: () => void;
};

const VerticalEditView = ({
  onAddQuestion,
  onOpenLibrary,
}: VerticalEditViewProps) => {
  const { polls, qwirlQuery, handleReorder, handleDelete, isDeleting } =
    useQwirlEditor();

  const pollCount = polls?.length ?? 0;
  const lastMovedPollIdRef = useRef<string | number | null>(null);

  const movePoll = (pollId: string | number, direction: "up" | "down") => {
    if (!polls || pollCount === 0) return;

    const currentIndex = polls.findIndex((item) => item.id === pollId);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= pollCount) return;

    const reorderedItems = [...polls];
    const [movedPoll] = reorderedItems.splice(currentIndex, 1);
    if (!movedPoll) return;

    reorderedItems.splice(targetIndex, 0, movedPoll);
    handleReorder(reorderedItems);
    lastMovedPollIdRef.current = pollId;
  };

  useEffect(() => {
    if (!lastMovedPollIdRef.current) return;

    const selector = `[data-poll-card-id="${lastMovedPollIdRef.current}"]`;
    const element = document.querySelector(selector) as HTMLElement | null;

    if (element) {
      window.requestAnimationFrame(() => {
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.top + elementRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const scrollOffset = elementCenter - viewportCenter;
        const targetScroll = window.scrollY + scrollOffset;

        window.scrollTo({
          top: Math.max(targetScroll, 0),
          behavior: "smooth",
        });
      });
    }

    lastMovedPollIdRef.current = null;
  }, [polls]);

  if (qwirlQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-0 bg-white shadow-sm animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (qwirlQuery?.data?.items?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No polls yet</h3>
              <p className="text-gray-600">
                Add your first poll to get started with your Qwirl!
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={onAddQuestion}
                  disabled={!onAddQuestion}
                  icon={Plus}
                  iconPlacement="left"
                  className="w-full rounded-full md:w-auto"
                >
                  Add Question
                </Button>
                <Button
                  onClick={onOpenLibrary}
                  disabled={!onOpenLibrary}
                  variant="secondary"
                  icon={Library}
                  iconPlacement="left"
                  className="w-full rounded-full md:w-auto"
                >
                  Add from Library
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {polls?.map((qwirlPoll, index) => (
        <div
          key={qwirlPoll.id}
          data-poll-card
          data-poll-card-id={qwirlPoll.id}
          id={`qwirl-poll-card-${index}`}
        >
          <QwirlEditorCard
            poll={qwirlPoll}
            handleDelete={() => handleDelete(qwirlPoll.id)}
            isDeleting={isDeleting}
            onMoveUp={() => movePoll(qwirlPoll.id, "up")}
            onMoveDown={() => movePoll(qwirlPoll.id, "down")}
            disableMoveUp={index === 0}
            disableMoveDown={index === pollCount - 1}
          />
        </div>
      ))}
    </div>
  );
};

export default VerticalEditView;
