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
import DeleteConfirmationDialog from "../delete-confirmation-dialog";

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
  isDeleting = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={clsx(className)}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 relative bg-white">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <SortableList.DragHandle />

            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {poll.question_text}
              </h3>

              {/* Image */}
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

              <div className="space-y-3">
                {poll?.options?.map((option, optionIndex) => {
                  const isMyChoice = poll?.owner_answer === option;
                  return (
                    <div
                      key={optionIndex}
                      className={clsx(
                        " flex items-center justify-between flex-wrap text-foreground w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
                        {
                          "bg-accent": isMyChoice,
                          "bg-background": !isMyChoice,
                        }
                      )}
                    >
                      <span className="text-gray-900 font-medium">
                        {option}
                      </span>
                      {isMyChoice && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-background text-foreground  rounded-full flex items-center gap-1"
                        >
                          <div className="rounded-full h-3 w-3 bg-primary" />
                          You
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge variant="outline" className="">
                  #{poll.position}
                </Badge>
                <span>{poll.options.length} options</span>
                <div className="flex-shrink-0 block lg:hidden">
                  <DeleteConfirmationDialog
                    onConfirm={handleDelete}
                    title="Delete Poll"
                    description="Are you sure you want to delete this poll? This action cannot be undone. All relevant statistics and data will be permanently removed."
                    isSubmitting={isDeleting}
                    trigger={
                      <Button
                        variant="destructive"
                        loading={isDeleting}
                        className="!py-2 !px-2 !rounded-md !text-xs !h-8 !w-8 shadow-none"
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 hidden lg:block">
              <DeleteConfirmationDialog
                onConfirm={handleDelete}
                title="Delete Poll"
                description="Are you sure you want to delete this poll? This action cannot be undone. All relevant statistics and data will be permanently removed."
                isSubmitting={isDeleting}
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    loading={isDeleting}
                    className=""
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QwirlEditorCard;
