"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { authStore } from "@/stores/useAuthStore";
import $api from "@/lib/api/client";
import {
  StepKey,
  StepStatusType,
  STEP_DEFINITIONS,
  POLL_TARGET,
} from "./step-config";

export type StepCardState = {
  key: StepKey;
  stepLabel: string;
  title: string;
  description: string;
  href: string;
  statusType: StepStatusType;
  statusLabel: string;
  statusDetail: string;
};

export type PrimaryQwirlEditContextValue = {
  polls: ReturnType<typeof useQwirlEditor>["polls"];
  qwirlQuery: ReturnType<typeof useQwirlEditor>["qwirlQuery"];
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showAddDialog: boolean;
  setShowLibrary: React.Dispatch<React.SetStateAction<boolean>>;
  showLibrary: boolean;
  addPollToQwirlMutation: ReturnType<
    typeof useQwirlEditor
  >["addPollToQwirlMutation"];
  handleAddPoll: ReturnType<typeof useQwirlEditor>["handleAddPoll"];
  handleReorder: ReturnType<typeof useQwirlEditor>["handleReorder"];
  stepCards: StepCardState[];
  coverStatus: StepStatusType;
  socialsStatus: StepStatusType;
  questionsStatus: StepStatusType;
  savedSocialsCount: number;
  visibleSocialsCount: number;
  pollCount: number;
  pollCountLabel: string;
  remainingPolls: number;
  hasReachedTarget: boolean;
  progressValue: number;
  handleRandomizeQuestions: () => Promise<void>;
  isShuffling: boolean;
  lastLibraryAdd: string | null;
  setLastLibraryAdd: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddPollFromLibrary: (pollData: {
    question_text: string;
    options: string[];
    owner_answer_index: number;
  }) => Promise<void>;
  qwirlCoverQuery: ReturnType<typeof $api.useQuery>;
  socialsQuery: ReturnType<typeof $api.useQuery>;
};

const PrimaryQwirlEditContext =
  createContext<PrimaryQwirlEditContextValue | null>(null);

export const usePrimaryQwirlEdit = () => {
  const context = useContext(PrimaryQwirlEditContext);
  if (!context) {
    throw new Error(
      "usePrimaryQwirlEdit must be used within PrimaryQwirlEditProvider"
    );
  }
  return context;
};

const STATUS_LABELS: Record<StepStatusType, string> = {
  complete: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
  optional: "Optional",
  loading: "Loading…",
};

export const PrimaryQwirlEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    polls,
    qwirlQuery,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    handleReorder,
    showAddDialog,
  } = useQwirlEditor();

  const user = authStore((state) => state.user);

  const qwirlCoverQuery = $api.useQuery(
    "get",
    "/qwirl/{qwirl_id}/cover",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    { enabled: !!user?.primary_qwirl_id }
  );

  const socialsQuery = $api.useQuery("get", "/users/me/socials");

  const [showLibrary, setShowLibrary] = useState(false);
  const [lastLibraryAdd, setLastLibraryAdd] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const { closeCart } = useCartUIStore();
  const { items: cartItems, clearCart } = useQuestionCart();

  const pollCount = polls?.length ?? 0;
  const hasReachedTarget = pollCount >= POLL_TARGET;
  const progressValue = Math.min((pollCount / POLL_TARGET) * 100, 100);
  const remainingPolls = Math.max(POLL_TARGET - pollCount, 0);
  const pollCountLabel = hasReachedTarget
    ? `${pollCount} questions`
    : `${pollCount} / ${POLL_TARGET} questions`;

  const coverData = qwirlCoverQuery.data;
  const socials = socialsQuery.data?.data?.socials ?? [];
  const savedSocialsCount = socials.filter((social: { url?: string | null }) =>
    social?.url?.trim()
  ).length;
  const visibleSocialsCount = socials.filter(
    (social: { is_visible?: boolean; url?: string | null }) =>
      social?.is_visible && social?.url?.trim()
  ).length;

  const coverStatus: StepStatusType = useMemo(() => {
    if (qwirlCoverQuery.isLoading || qwirlQuery.isLoading) {
      return "loading";
    }

    const description = coverData?.description ?? "";
    const hasBackground = Boolean(coverData?.background_image);

    if (description.trim()) {
      return "complete";
    }

    if (hasBackground) {
      return "in-progress";
    }

    return "not-started";
  }, [coverData, qwirlCoverQuery.isLoading, qwirlQuery.isLoading]);

  const socialsStatus: StepStatusType = useMemo(() => {
    if (socialsQuery.isLoading) {
      return "loading";
    }
    if (savedSocialsCount > 0) {
      return "complete";
    }
    return "optional";
  }, [socialsQuery.isLoading, savedSocialsCount]);

  const questionsStatus: StepStatusType = useMemo(() => {
    if (qwirlQuery.isLoading) {
      return "loading";
    }
    if (hasReachedTarget) {
      return "complete";
    }
    if (pollCount > 0) {
      return "in-progress";
    }
    return "not-started";
  }, [hasReachedTarget, pollCount, qwirlQuery.isLoading]);

  const stepCards: StepCardState[] = useMemo(() => {
    return STEP_DEFINITIONS.map((definition) => {
      const statusType =
        definition.key === "cover"
          ? coverStatus
          : definition.key === "socials"
          ? socialsStatus
          : questionsStatus;
      let statusLabel = STATUS_LABELS[statusType];
      if (definition.key === "socials" && statusType === "complete") {
        statusLabel = `${savedSocialsCount} link${
          savedSocialsCount === 1 ? "" : "s"
        } saved`;
      } else if (
        definition.key === "questions" &&
        statusType === "in-progress"
      ) {
        statusLabel = `${remainingPolls} left`;
      }

      const statusDetail = (() => {
        if (definition.key === "cover") {
          if (statusType === "complete") return "Cover is ready.";
          if (statusType === "in-progress")
            return "Finish your intro to help people connect.";
          if (statusType === "loading") return "Checking your cover details…";
          return "Add a title and intro to kick things off.";
        }
        if (definition.key === "socials") {
          if (statusType === "complete") {
            return visibleSocialsCount > 0
              ? `${visibleSocialsCount} visible on your Qwirl.`
              : "Links saved and hidden for now.";
          }
          if (statusType === "loading") return "Checking your social links…";
          return "Add socials when you're ready.";
        }
        if (definition.key === "questions") {
          if (statusType === "complete")
            return `${pollCount} questions ready to go.`;
          if (statusType === "in-progress")
            return `Add ${remainingPolls} more to unlock sharing.`;
          if (statusType === "loading") return "Checking your question stack…";
          return "Add your first question to get rolling.";
        }
        return "";
      })();

      return {
        ...definition,
        statusType,
        statusLabel,
        statusDetail,
      } satisfies StepCardState;
    });
  }, [
    coverStatus,
    socialsStatus,
    questionsStatus,
    savedSocialsCount,
    visibleSocialsCount,
    pollCount,
    remainingPolls,
  ]);

  const handleRandomizeQuestions = useCallback(async () => {
    if (!polls || polls.length < 2 || isShuffling) {
      return;
    }
    setIsShuffling(true);
    try {
      const shuffledPolls = [...polls];
      for (let i = shuffledPolls.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledPolls[i];
        const swapItem = shuffledPolls[j];
        if (temp !== undefined && swapItem !== undefined) {
          shuffledPolls[i] = swapItem;
          shuffledPolls[j] = temp;
        }
      }
      await handleReorder(shuffledPolls);
      toast.success("Question order randomized", {
        id: "shuffle-qwirl",
      });
    } catch (error) {
      console.error("Failed to randomize questions", error);
      toast.error("Couldn't shuffle questions. Try again.");
    } finally {
      setIsShuffling(false);
    }
  }, [polls, isShuffling, handleReorder]);

  useEffect(() => {
    const handleAddAllFromCart = async (event: Event) => {
      const customEvent = event as CustomEvent<{ questions: typeof cartItems }>;
      const { questions } = customEvent.detail;
      if (questions && questions.length > 0) {
        for (const question of questions) {
          await handleAddPoll({
            question_text: question.question_text,
            options: question.options,
            owner_answer_index: question.owner_answer_index,
          });
        }
        toast.success(`Added ${questions.length} polls to Qwirl`, {
          description: "Questions added from cart",
        });
        clearCart();
        closeCart();
      }
    };

    window.addEventListener("add-all-from-cart", handleAddAllFromCart);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("addFromCart") === "true" && cartItems.length > 0) {
      const event = new CustomEvent("add-all-from-cart", {
        detail: { questions: cartItems },
      });
      handleAddAllFromCart(event);
      window.history.replaceState({}, "", window.location.pathname);
    }

    return () => {
      window.removeEventListener("add-all-from-cart", handleAddAllFromCart);
    };
  }, [cartItems, handleAddPoll, clearCart, closeCart]);

  const handleAddPollFromLibrary = useCallback(
    async (pollData: {
      question_text: string;
      options: string[];
      owner_answer_index: number;
    }) => {
      await handleAddPoll(pollData);
      setLastLibraryAdd(pollData.question_text);
      toast.success("Added to your Qwirl", {
        description: "Jump back to edit or personalize it.",
        id: "library-add-success",
      });
    },
    [handleAddPoll]
  );

  const contextValue: PrimaryQwirlEditContextValue = {
    polls,
    qwirlQuery,
    setShowAddDialog,
    showAddDialog,
    setShowLibrary,
    showLibrary,
    addPollToQwirlMutation,
    handleAddPoll,
    handleReorder,
    stepCards,
    coverStatus,
    socialsStatus,
    questionsStatus,
    savedSocialsCount,
    visibleSocialsCount,
    pollCount,
    pollCountLabel,
    remainingPolls,
    hasReachedTarget,
    progressValue,
    handleRandomizeQuestions,
    isShuffling,
    lastLibraryAdd,
    setLastLibraryAdd,
    handleAddPollFromLibrary,
    qwirlCoverQuery,
    socialsQuery,
  };

  return (
    <PrimaryQwirlEditContext.Provider value={contextValue}>
      {children}
    </PrimaryQwirlEditContext.Provider>
  );
};
