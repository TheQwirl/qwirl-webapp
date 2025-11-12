import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Qwirl, QwirlItem } from "@/components/qwirl/types";
import { useState } from "react";
import { QwirlPollData } from "@/components/qwirl/schema";
import { useConfirmationModal } from "@/stores/useConfirmationModal";
import { authStore } from "@/stores/useAuthStore";

export type ViewMode = "edit" | "view";

const queryKey = ["get", "/qwirl/me", {}];
export function useQwirlEditor() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = authStore();

  const { show } = useConfirmationModal();

  const [showAddDialog, setShowAddDialog] = useState(false);

  const addPollToQwirlMutation = $api.useMutation("post", "/qwirl/me/items");

  const handleAddPoll = async (pollData: QwirlPollData): Promise<void> => {
    const ownerAnswer = pollData?.options?.[pollData?.owner_answer_index] ?? "";

    await addPollToQwirlMutation.mutateAsync(
      {
        body: {
          items: [
            {
              options: pollData.options,
              question_text: pollData.question_text,
              owner_answer: ownerAnswer,
            },
          ],
        },
      },
      {
        onSuccess: async () => {
          // Invalidate and refetch the query
          await queryClient.invalidateQueries({
            queryKey: ["get", "/qwirl/me"],
          });

          // Wait for the query to refetch and update
          await queryClient.refetchQueries({
            queryKey: ["get", "/qwirl/me"],
          });

          toast.success("Poll added successfully!", {
            id: "add-poll",
          });

          setShowAddDialog(false);

          // Scroll after a small delay to ensure DOM has updated
          setTimeout(() => {
            const allPollCards = document.querySelectorAll("[data-poll-card]");
            const lastPollCard = allPollCards[allPollCards.length - 1];
            if (lastPollCard) {
              lastPollCard.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }
          }, 150);
        },
        onError: () => {
          toast.error("An error occurred while adding the poll.", {
            id: "add-poll",
          });
          console.error("Error adding poll:", addPollToQwirlMutation.error);
        },
      }
    );
  };

  const qwirlQuery = $api.useQuery(
    "get",
    "/qwirl/me",
    {},
    {
      enabled: isAuthenticated,
    }
  );
  const polls = qwirlQuery?.data?.items
    ? [...qwirlQuery.data.items].sort((a, b) => a.position - b.position)
    : [];

  const deleteMutation = $api.useMutation(
    "delete",
    "/qwirl/me/items/{item_id}",
    {
      // onMutate: async (variables) => {
      //   await queryClient.cancelQueries({ queryKey });
      //   const previousQwirlData = queryClient.getQueryData<Qwirl>(queryKey);
      //   if (!previousQwirlData) return;
      //   const newOptimisticItems = previousQwirlData?.items?.filter(
      //     (item) => item.id !== variables.params.path.item_id
      //   );
      //   queryClient.setQueryData(queryKey, {
      //     ...previousQwirlData,
      //     items: newOptimisticItems,
      //   });
      //   return { previousQwirlData };
      // },
      onError: (error) => {
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
      onError: () => {
        toast.error(
          "Failed to reorder items. Reverting changes. Please try again.",
          {
            id: "reorder-items",
          }
        );
      },
    }
  );

  const handleReorder = async (reorderedItems: QwirlItem[]) => {
    await queryClient.cancelQueries({ queryKey });

    const previousQwirlData = queryClient.getQueryData<Qwirl>(queryKey);

    if (previousQwirlData) {
      queryClient.setQueryData(queryKey, {
        ...previousQwirlData,
        items: reorderedItems.map((item, index) => ({
          ...item,
          position: index + 1,
        })),
      });
    }

    // Prepare payload for API
    const payload = reorderedItems.map((item, index) => ({
      item_id: item.id,
      new_position: index + 1,
    }));

    // Fire the mutation (happens in background, UI already updated)
    reorderQwirlMutation.mutate(
      { body: payload },
      {
        onError: () => {
          // Rollback on error
          if (previousQwirlData) {
            queryClient.setQueryData(queryKey, previousQwirlData);
          }
        },
        // Don't refetch on success - we already have the correct data!
      }
    );
  };

  const handleDelete = (id: number) => {
    return new Promise<void>((resolve, reject) => {
      show({
        title: "Are you sure you want to delete this Qwirl Poll?",
        description:
          "This action is irreversible and all its votes will be lost.",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          toast.loading("Deleting Poll...", {
            id: "delete-qwirl-item",
          });

          try {
            await deleteMutation.mutateAsync(
              { params: { path: { item_id: id } } },
              {
                onSuccess: async () => {
                  toast.success("Post deleted successfully!", {
                    id: "delete-qwirl-item",
                  });
                  await queryClient.invalidateQueries({
                    queryKey,
                  });
                  resolve();
                },
                onError: (error) => {
                  toast.error("Failed to delete poll. Please try again.", {
                    id: "delete-qwirl-item",
                  });
                  reject(error);
                },
              }
            );
          } catch (error) {
            reject(error);
          }
        },
      });
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
