import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Qwirl, QwirlItem } from "@/components/qwirl/types";
import { useState } from "react";
import { QwirlPollData } from "@/components/qwirl/schema";

export function useQwirlEditor() {
  const queryClient = useQueryClient();
  const queryKey = ["get", "/qwirl/me"];
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addPollToQwirlMutation = $api.useMutation("post", "/qwirl/me/items");

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

  const qwirlQuery = $api.useQuery("get", "/qwirl/me");
  const polls = qwirlQuery?.data?.items
    ? [...qwirlQuery.data.items].sort((a, b) => a.position - b.position)
    : [];

  const deleteMutation = $api.useMutation(
    "delete",
    "/qwirl/me/items/{item_id}",
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousQwirlData = queryClient.getQueryData<Qwirl>(queryKey);
        if (!previousQwirlData) return;
        const newOptimisticItems = previousQwirlData?.items?.filter(
          (item) => item.id !== variables.params.path.item_id
        );
        queryClient.setQueryData(queryKey, {
          ...previousQwirlData,
          items: newOptimisticItems,
        });
        return { previousQwirlData };
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey });
        toast.success("Poll deleted successfully!", { id: "delete-poll" });
      },
      onError: (error) => {
        toast.error("An error occurred while deleting the poll", {
          id: "delete-poll",
        });
        if ((error as { previousData: unknown })?.previousData) {
          queryClient.setQueryData(
            queryKey,
            (error as { previousData: unknown }).previousData
          );
        }
      },
    }
  );

  const reorderQwirlMutation = $api.useMutation(
    "patch",
    "/qwirl/me/items/reorder",
    {
      onMutate: async (variables) => {
        const reorderedPayload = variables.body;
        await queryClient.cancelQueries({ queryKey });
        const previousQwirlData = queryClient.getQueryData<Qwirl>(queryKey);
        if (!previousQwirlData) return;

        const itemsMap = new Map(
          previousQwirlData?.items?.map((item) => [item.id, item])
        );
        const newOptimisticItems = reorderedPayload.map(
          (reorderedItem: { item_id: number }) =>
            itemsMap.get(reorderedItem.item_id)!
        );

        queryClient.setQueryData(queryKey, {
          ...previousQwirlData,
          items: newOptimisticItems,
        });

        return { previousQwirlData };
      },
      onError: (err, variables, context) => {
        toast.error(
          "Failed to reorder items. Reverting changes. Please try again.",
          {
            id: "reorder-items",
          }
        );
        if ((context as { previousData: unknown })?.previousData) {
          queryClient.setQueryData(
            queryKey,
            (context as { previousData: unknown }).previousData
          );
        }
      },
    }
  );

  const handleReorder = async (reorderedItems: QwirlItem[]) => {
    const payload = reorderedItems.map((item, index) => ({
      item_id: item.id,
      new_position: index + 1,
    }));
    await reorderQwirlMutation.mutateAsync({ body: payload });
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    toast.loading("Deleting poll...", { id: "delete-poll" });
    await deleteMutation.mutateAsync({
      params: { path: { item_id: id } },
    });
  };

  return {
    // Get
    polls,
    qwirlQuery,
    // Patch
    handleReorder,
    // Delete
    handleDelete,
    isDeleting: deleteMutation.isPending,
    deleteMutation,
    // Add
    addPollToQwirlMutation,
    showAddDialog,
    setShowAddDialog,
    handleAddPoll,
  };
}
