import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Qwirl, QwirlItem } from "@/components/qwirl/types";
import { useEffect, useState } from "react";
import { QwirlPollData } from "@/components/qwirl/schema";
import { useConfirmationModal } from "@/stores/useConfirmationModal";
import { useSearchParams } from "next/navigation";

export type ViewMode = "edit" | "view";

export function useQwirlEditor() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "edit" || tabParam === "view") {
      setViewMode(tabParam);
    } else if (tabParam !== null) {
      console.warn(`Invalid tab param: "${tabParam}". Defaulting to "edit".`);
      setViewMode("edit");
    }
  }, [searchParams]);
  const { show } = useConfirmationModal();

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
          if (viewMode === "edit") {
            window.scrollTo({
              top: document.body.scrollHeight,
              left: 0,
              behavior: "smooth",
            });
          }
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
      onMutate: async (variables) => {
        const reorderedPayload = variables.body;
        await queryClient.cancelQueries({ queryKey });

        const previousQwirlData = queryClient.getQueryData<Qwirl>(queryKey);
        if (!previousQwirlData) return { previousQwirlData };

        const updatedItems = previousQwirlData?.items?.map((item) => {
          const newPos = reorderedPayload.find(
            (r: { item_id: number; new_position: number }) =>
              r.item_id === item.id
          )?.new_position;

          return newPos !== undefined ? { ...item, position: newPos } : item;
        });

        queryClient.setQueryData(queryKey, {
          ...previousQwirlData,
          items: updatedItems,
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
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
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
    viewMode,
    setViewMode,
  };
}
