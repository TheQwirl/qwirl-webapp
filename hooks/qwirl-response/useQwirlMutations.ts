import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { QwirlWithSession, QwirlItemOptionStatistics } from "@/types/qwirl";
import { TOAST_IDS } from "@/constants/qwirl-respond";

type QueryKey = readonly unknown[];

/**
 * Hook for submitting answers to qwirl polls
 */
export function useSubmitAnswer(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/responses",
    {
      onMutate: async (variables) => {
        const { qwirl_item_id, selected_answer } = variables.body;

        await queryClient.cancelQueries({ queryKey });
        const previousData =
          queryClient.getQueryData<QwirlWithSession>(queryKey);

        if (previousData) {
          queryClient.setQueryData<QwirlWithSession>(queryKey, (oldData) => {
            if (!oldData) {
              console.log("⚠️ [OPTIMISTIC UPDATE] oldData is null/undefined");
              return oldData;
            }

            return {
              ...oldData,
              items: oldData.items?.map((item) => {
                if (item.id !== qwirl_item_id) return item;

                // Check if this is a new response or changing an existing one
                const hadPreviousResponse =
                  item.user_response !== undefined &&
                  item.user_response !== null;
                const previousAnswer = item.user_response?.selected_answer;

                const nextResponseCount = hadPreviousResponse
                  ? item.response_count ?? 0
                  : (item.response_count ?? 0) + 1;

                // Update statistics (remove old answer, add new answer)
                const nextStats = updateOptionStatistics(
                  item.option_statistics,
                  previousAnswer ?? null,
                  selected_answer ?? null,
                  hadPreviousResponse
                );

                return {
                  ...item,
                  response_count: nextResponseCount,
                  option_statistics: nextStats,
                  user_response: {
                    selected_answer: selected_answer ?? null,
                    comment: item.user_response?.comment ?? null,
                  },
                };
              }),
              answered_count:
                (oldData.answered_count ?? 0) +
                (selected_answer !== null ? 1 : 0),
              skipped_count:
                (oldData.skipped_count ?? 0) +
                (selected_answer === null ? 1 : 0),
              unanswered_count: Math.max(
                0,
                (oldData.unanswered_count ?? 0) - 1
              ),
            };
          });
        }

        return { previousData };
      },
      onError: (error, variables, context) => {
        console.log("❌ [OPTIMISTIC UPDATE] Error occurred, rolling back");
        const ctx = context as
          | { previousData: QwirlWithSession | undefined }
          | undefined;

        if (ctx?.previousData) {
          queryClient.setQueryData<QwirlWithSession>(
            queryKey,
            ctx.previousData
          );
        }

        toast.error("An error occurred while submitting your response.", {
          id: TOAST_IDS.SUBMIT_ANSWER,
        });
      },
      onSettled: (data, error) => {
        console.log("🏁 [OPTIMISTIC UPDATE] Settled - invalidating queries", {
          hadError: !!error,
          response: data,
        });
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );
}

/**
 * Hook for saving comments on qwirl responses
 */
export function useSaveComment(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return $api.useMutation(
    "patch",
    "/qwirl-responses/sessions/{session_id}/items/{qwirl_item_id}/comment",
    {
      onMutate: async (variables) => {
        const { qwirl_item_id } = variables.params.path;
        const newComment = variables.body.comment ?? "";

        await queryClient.cancelQueries({ queryKey });
        const previousData =
          queryClient.getQueryData<QwirlWithSession>(queryKey);

        if (previousData) {
          queryClient.setQueryData<QwirlWithSession>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              items: oldData.items?.map((item) => {
                if (item.id !== qwirl_item_id) return item;

                return {
                  ...item,
                  user_response: {
                    ...(item.user_response ?? {
                      selected_answer: null,
                      comment: null,
                    }),
                    comment: newComment,
                  },
                };
              }),
            };
          });
        }

        return { previousData };
      },
      onError: (error, variables, context) => {
        const ctx = context as
          | { previousData: QwirlWithSession | undefined }
          | undefined;
        if (ctx?.previousData) {
          queryClient.setQueryData<QwirlWithSession>(
            queryKey,
            ctx.previousData
          );
        }
        toast.error("Couldn't save your comment. Please try again.");
      },
      onSuccess: () => {
        toast.success("Comment saved.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );
}

/**
 * Hook for finishing a qwirl session and getting wavelength
 */
export function useFinishSession() {
  return $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/finish"
  );
}

/**
 * Helper function to update option statistics
 * Handles both new responses and changing existing responses
 */
function updateOptionStatistics(
  currentStats: QwirlItemOptionStatistics | undefined,
  previousAnswer: string | null,
  newAnswer: string | null,
  hadPreviousResponse: boolean
) {
  console.log("📈 [UPDATE STATS] Input:", {
    currentStats,
    previousAnswer,
    newAnswer,
    hadPreviousResponse,
  });

  let nextStats = currentStats ?? { counts: {}, total_responses: 0 };

  // If changing an answer, decrement the old answer's count
  if (hadPreviousResponse && previousAnswer !== null) {
    console.log(
      "➖ [UPDATE STATS] Decrementing previous answer:",
      previousAnswer
    );
    nextStats = {
      ...nextStats,
      counts: {
        ...(nextStats?.counts ?? {}),
        [previousAnswer]: Math.max(
          0,
          (nextStats?.counts?.[previousAnswer] ?? 0) - 1
        ),
      },
    };
  }

  // Add the new answer's count
  if (newAnswer !== null) {
    console.log("➕ [UPDATE STATS] Incrementing new answer:", newAnswer);
    nextStats = {
      ...nextStats,
      counts: {
        ...(nextStats?.counts ?? {}),
        [newAnswer]: (nextStats?.counts?.[newAnswer] ?? 0) + 1,
      },
      // Only increment total_responses if this is a new response, not a change
      total_responses: hadPreviousResponse
        ? nextStats.total_responses
        : nextStats.total_responses + 1,
    };
  }

  console.log("✅ [UPDATE STATS] Output:", nextStats);

  return nextStats;
}
