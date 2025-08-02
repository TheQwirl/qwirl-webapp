"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { LayoutGrid, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import AddPollDialog from "./add-poll-dialog";
import $api from "@/lib/api/client";
import { QwirlPollData } from "./schema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import VerticalEditView from "./vertical-edit-view";
import { Badge } from "../ui/badge";

const QwirlEditView = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addPollToQwirlMutation = $api.useMutation("post", "/qwirl/me/items");
  const queryClient = useQueryClient();

  const handleAddPoll = async (pollData: QwirlPollData) => {
    const ownerAnswer = pollData?.options?.[pollData?.owner_answer_index] ?? "";
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
          toast.success("Poll added successfully!", {
            id: "add-poll",
          });
          setShowAddDialog(false);
          await queryClient.invalidateQueries({
            queryKey: ["get", "/qwirl/me"],
          });
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
      <div className="overflow-y-hidden col-span-full lg:col-span-full px-4 pb-4">
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-between lg:flex-nowrap">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
                  <LayoutGrid className="h-4 lg:h-5 w-4 lg:w-5" />
                  Edit Mode
                </CardTitle>
                <div className=" items-center gap-2 text-sm text-gray-600 hidden md:flex">
                  <Badge
                    variant="default"
                    className="rounded-full whitespace-nowrap"
                  >
                    Total: {0}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Add Poll Button */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    //   disabled={questions.length >= 35}
                    className="group rounded-full md:rounded shadow-none"
                    icon={PlusIcon}
                    iconPlacement="left"
                  >
                    Add Question
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="mt-6 overflow-none">
          <VerticalEditView />
        </div>
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
