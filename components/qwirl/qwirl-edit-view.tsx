"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpDown, LayoutGrid, PlusIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AddPollDialog from "./add-poll-dialog";
import $api from "@/lib/api/client";
import { QwirlPollData } from "./schema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
// import { components } from "@/lib/api/v1-client-side";

type EditViewType = "vertical" | "single-card";
// type QwirlItem = components["schemas"]["QwirlBase"];

const QwirlEditView = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editViewType, setEditViewType] = useState<EditViewType>("vertical");

  const addPollToQwirlMutation = $api.useMutation("post", "/qwirl/me/items");
  const queryClient = useQueryClient();

  const handleAddPoll = async (pollData: QwirlPollData) => {
    const ownerAnswer = pollData?.options?.[pollData?.owner_answer_index] ?? "";
    toast.loading("Adding poll...", {
      id: "add-poll",
    });
    await addPollToQwirlMutation.mutateAsync(
      {
        body: {
          options: pollData.options,
          question_text: pollData.question_text,
          owner_answer: ownerAnswer,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Post created successfully!", {
            id: "add-poll",
          });
          await queryClient.invalidateQueries({
            queryKey: ["get", "/qwirl/me"],
          });

          setShowAddDialog(false);
        },
        onError: () => {
          toast.error("An error occurred while creating the post", {
            id: "add-poll",
          });
          console.error("Error creating post:", addPollToQwirlMutation.error);
        },
      }
    );
  };

  return (
    <>
      <div className="overflow-y-hidden col-span-full lg:col-span-full">
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                Edit Mode
              </CardTitle>

              <div className="flex items-center gap-4">
                {/* Edit View Type Toggle */}
                <div className="flex items-center space-x-3">
                  <Label
                    htmlFor="edit-view-type"
                    className="text-sm font-medium"
                  >
                    Layout
                  </Label>
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <Switch
                      id="edit-view-type"
                      checked={editViewType === "single-card"}
                      onCheckedChange={(checked) =>
                        setEditViewType(checked ? "single-card" : "vertical")
                      }
                    />
                    <LayoutGrid className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Add Poll Button */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    //   disabled={questions.length >= 35}
                    className="group rounded-full md:rounded"
                    icon={PlusIcon}
                    iconPlacement="left"
                  >
                    <span className="hidden md:block">Add Question</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-700"
              >
                {editViewType === "vertical"
                  ? "Vertical Cards"
                  : "Single Card Navigation"}
              </Badge>
              <span>•</span>
              <span>{0} polls total</span>
            </div>
          </CardHeader>
        </Card>
      </div>
      <AddPollDialog
        isModalOpen={showAddDialog}
        setIsModalOpen={setShowAddDialog}
        handleAddPoll={handleAddPoll}
        isSubmitting={addPollToQwirlMutation.isPending}
      />
    </>
  );
};

export default QwirlEditView;
