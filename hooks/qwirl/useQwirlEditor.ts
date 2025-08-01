import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Qwirl, QwirlItem } from "@/components/qwirl/types";
import { useMemo } from "react";

export function useQwirlEditor() {
  const queryClient = useQueryClient();
  const queryKey = ["get", "/qwirl/me"];

  const qwirlQuery = $api.useQuery("get", "/qwirl/me");
  const polls = useMemo(() => {
    return (
      qwirlQuery?.data?.items?.sort((a, b) => a.position - b.position) ?? []
    );
  }, [qwirlQuery?.data?.items]);

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
    polls,
    qwirlQuery,
    handleReorder,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
