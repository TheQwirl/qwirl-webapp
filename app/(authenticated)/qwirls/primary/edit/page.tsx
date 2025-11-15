"use client";
import { PageLayout } from "@/components/layout/page-layout";
import React, { useState, useEffect, useMemo } from "react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import {
  PlusIcon,
  Library,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Circle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import EditableQwirlCover from "@/components/qwirl/editable-qwirl-cover";
import EditableUserSocials from "@/components/qwirl/editable-user-socials";
import { LibrarySlideOver } from "@/components/question-bank/library-slide-over";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";

type StepStatusType =
  | "complete"
  | "in-progress"
  | "not-started"
  | "optional"
  | "loading";

type StatusVisualConfig = {
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
  iconClass: string;
  spin?: boolean;
};

const STATUS_CONFIG: Record<StepStatusType, StatusVisualConfig> = {
  complete: {
    icon: CheckCircle2,
    badgeClass:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-600/60 dark:bg-emerald-500/10 dark:text-emerald-300",
    iconClass: "text-emerald-500 dark:text-emerald-300",
  },
  "in-progress": {
    icon: Clock3,
    badgeClass:
      "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700/60 dark:bg-amber-500/10 dark:text-amber-200",
    iconClass: "text-amber-500 dark:text-amber-200",
  },
  "not-started": {
    icon: Circle,
    badgeClass:
      "border border-border/50 bg-muted/10 text-muted-foreground dark:border-border/40 dark:bg-muted/20",
    iconClass: "text-muted-foreground",
  },
  optional: {
    icon: Sparkles,
    badgeClass:
      "border border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10",
    iconClass: "text-primary",
  },
  loading: {
    icon: Loader2,
    badgeClass:
      "border border-border/40 bg-muted/20 text-muted-foreground dark:border-border/30 dark:bg-muted/30",
    iconClass: "text-muted-foreground",
    spin: true,
  },
};

const PrimaryQwirlEditPage = () => {
  const {
    polls,
    qwirlQuery,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
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
  const { closeCart } = useCartUIStore();
  const { items: cartItems, clearCart } = useQuestionCart();

  const pollCount = polls?.length ?? 0;
  const POLL_TARGET = 15;
  const hasReachedTarget = pollCount >= POLL_TARGET;
  const progressValue = Math.min((pollCount / POLL_TARGET) * 100, 100);
  const remainingPolls = Math.max(POLL_TARGET - pollCount, 0);
  const pollCountLabel = hasReachedTarget
    ? `${pollCount} questions`
    : `${pollCount} / ${POLL_TARGET} questions`;

  const coverData = qwirlCoverQuery.data;
  const socials = socialsQuery.data?.data?.socials ?? [];
  const savedSocialsCount = socials.filter((social) =>
    social?.url?.trim()
  ).length;
  const visibleSocialsCount = socials.filter(
    (social) => social?.is_visible && social?.url?.trim()
  ).length;

  const coverStatus: StepStatusType = useMemo(() => {
    if (qwirlCoverQuery.isLoading || qwirlQuery.isLoading) {
      return "loading";
    }
    const name = coverData?.name ?? coverData?.title ?? "";
    const description = coverData?.description ?? "";
    const hasBackground = Boolean(coverData?.background_image);

    if (name.trim() && description.trim()) {
      return "complete";
    }

    if (name.trim() || description.trim() || hasBackground) {
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

  const stepCards = useMemo(
    () => [
      {
        id: "qwirl-cover",
        href: "#qwirl-cover",
        step: "Step 1",
        title: "Set up your cover",
        description:
          "Pair a photo with a short intro that sounds like you.",
        statusType: coverStatus,
        statusLabel:
          coverStatus === "complete"
            ? "Completed"
            : coverStatus === "in-progress"
            ? "In progress"
            : coverStatus === "loading"
            ? "Loading…"
            : "Not started",
        statusDetail:
          coverStatus === "complete"
            ? "Cover is ready to share."
            : coverStatus === "in-progress"
            ? "Finish your intro to help people connect."
            : coverStatus === "loading"
            ? "Checking your cover details…"
            : "Add a title and intro to kick things off.",
      },
      {
        id: "qwirl-socials",
        href: "#qwirl-socials",
        step: "Step 2",
        title: "Add extras (optional)",
        description:
          "Share a couple links or details friends usually ask for.",
        statusType: socialsStatus,
        statusLabel:
          socialsStatus === "complete"
            ? `${savedSocialsCount} link${savedSocialsCount === 1 ? "" : "s"} saved`
            : socialsStatus === "loading"
            ? "Loading…"
            : "Optional",
        statusDetail:
          socialsStatus === "complete"
            ? visibleSocialsCount > 0
              ? `${visibleSocialsCount} visible on your Qwirl.`
              : "Links saved and hidden for now."
            : socialsStatus === "loading"
            ? "Checking your social links…"
            : "Add socials when you're ready.",
      },
      {
        id: "qwirl-questions",
        href: "#qwirl-questions",
        step: "Step 3",
        title: "Build your question set",
        description: `Aim for ${POLL_TARGET} questions to unlock sharing.`,
        statusType: questionsStatus,
        statusLabel:
          questionsStatus === "complete"
            ? "Completed"
            : questionsStatus === "in-progress"
            ? `${remainingPolls} left`
            : questionsStatus === "loading"
            ? "Loading…"
            : "Not started",
        statusDetail:
          questionsStatus === "complete"
            ? `${pollCount} questions ready to go.`
            : questionsStatus === "in-progress"
            ? `Add ${remainingPolls} more to unlock sharing.`
            : questionsStatus === "loading"
            ? "Checking your question stack…"
            : "Add your first question to get rolling.",
      },
    ],
    [
      coverStatus,
      socialsStatus,
      questionsStatus,
      savedSocialsCount,
      visibleSocialsCount,
      POLL_TARGET,
      remainingPolls,
      pollCount,
    ]
  );

  const questionGuidance = useMemo(() => {
    if (pollCount === 0) {
      return {
        badge: "Start here",
        title: "Kick things off with an easy opener",
        tips: [
          "Begin with the question you ask when you first meet someone.",
          "Follow with something light so people feel comfortable answering.",
        ],
      } as const;
    }

    if (pollCount > 0 && pollCount < 5) {
      return {
        badge: "Build your core",
        title: "Build a mix of starters",
        tips: [
          "Mix thoughtful, playful, and everyday prompts.",
          "Borrow from the library, then tweak the wording to sound like you.",
        ],
      } as const;
    }

    if (!hasReachedTarget) {
      return {
        badge: "Almost there",
        title: "Layer in depth and surprises",
        tips: [
          "Add one curveball about what lights you up outside of work.",
          "Try a values question to spark meaningful replies.",
        ],
      } as const;
    }

    return null;
  }, [pollCount, hasReachedTarget]);

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

  useEffect(() => {
    if (!lastLibraryAdd) return;
    const timeout = window.setTimeout(() => setLastLibraryAdd(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [lastLibraryAdd]);

  const handleAddPollFromLibrary = async (pollData: {
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
  };

  return (
    <>
      <PageLayout
        rightSidebar={
          <PrimaryQwirlRightSidebar
            isLoading={qwirlQuery.isLoading}
            polls={polls}
          />
        }
        backNavigation={{
          title: "Edit Mode",
          subtitle: "Shape the qwirl that feels most like you",
          hideBackButton: true,
          rightContent: (
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {pollCountLabel}
            </Badge>
          ),
        }}
      >
        <div className="relative grid grid-cols-12 gap-5">
          <div className="col-span-full px-4 pb-24 space-y-12">
            <section aria-labelledby="qwirl-editor-intro" className="pt-2">
              <Card className="border-muted/50 bg-gradient-to-br from-primary/10 via-background to-background shadow-sm">
                <CardHeader className="gap-3">
                  <div className="inline-flex items-center gap-2 text-primary">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Primary qwirl
                    </span>
                  </div>
                  <CardTitle
                    id="qwirl-editor-intro"
                    className="text-2xl font-semibold"
                  >
                    Build a qwirl for people on your wavelength
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Set up your cover, share a few helpful details, then pick
                    the questions that help someone get to know you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {stepCards.map((step) => {
                      const statusVisual = STATUS_CONFIG[step.statusType];
                      const StatusIcon = statusVisual.icon;
                      const statusBadgeClass = `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none transition ${statusVisual.badgeClass}`;
                      const statusIconClass = `h-3.5 w-3.5 ${statusVisual.iconClass} ${statusVisual.spin ? "animate-spin" : ""}`;

                      return (
                        <a
                          key={step.id}
                          href={step.href}
                          className="group relative flex h-full flex-col rounded-xl border bg-background p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] cursor-pointer"
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            >
                              {step.step}
                            </Badge>
                            <span className={statusBadgeClass}>
                              <StatusIcon className={statusIconClass} />
                              {step.statusLabel}
                            </span>
                          </div>
                          <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {step.description}
                          </p>
                          <p className="mt-3 text-xs text-muted-foreground">
                            {step.statusDetail}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:translate-x-0.5">
                            Jump to section
                            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section
              id="qwirl-cover"
              aria-labelledby="qwirl-cover-heading"
              className="space-y-5 scroll-mt-24"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    Step 1
                  </Badge>
                  <h2
                    id="qwirl-cover-heading"
                    className="mt-3 text-xl font-semibold"
                  >
                    Set up your Qwirl cover
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a photo or gradient and a short intro that feels like
                    the start of a real conversation.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <EditableQwirlCover className="w-full" />
                <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
                    <p className="font-semibold text-foreground">
                      Title & tagline
                    </p>
                    <p>Start with how you usually introduce yourself.</p>
                  </div>
                  <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
                    <p className="font-semibold text-foreground">
                      Visual anchor
                    </p>
                    <p>Pick a cover image or color that matches your vibe.</p>
                  </div>
                  <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
                    <p className="font-semibold text-foreground">
                      What to expect
                    </p>
                    <p>Let people know what they&apos;ll learn by answering.</p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="qwirl-socials"
              aria-labelledby="qwirl-socials-heading"
              className="space-y-5 scroll-mt-24"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    Step 2 • Optional
                  </Badge>
                  <h2
                    id="qwirl-socials-heading"
                    className="mt-3 text-xl font-semibold"
                  >
                    Add ways for people to follow up
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Share a couple links, handles, or notes so people know how
                    to stay in touch.
                  </p>
                </div>
              </div>
              <Card className="border-muted/70">
                <CardContent className="p-0">
                  <EditableUserSocials />
                </CardContent>
              </Card>
            </section>

            <section
              id="qwirl-questions"
              aria-labelledby="qwirl-questions-heading"
              className="space-y-6 scroll-mt-24"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    Step 3
                  </Badge>
                  <h2
                    id="qwirl-questions-heading"
                    className="mt-3 text-xl font-semibold"
                  >
                    Choose the questions that feel most like you
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Mix grounding questions with a few surprises. Aim for{" "}
                    {POLL_TARGET} to unlock sharing.
                  </p>
                </div>
              </div>

              {questionGuidance ? (
                <Card className="border border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-primary/10 text-primary"
                      >
                        {questionGuidance.badge}
                      </Badge>
                      <span>{questionGuidance.title}</span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-xs text-muted-foreground">
                      {questionGuidance.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              <div className="space-y-5">
                <div className="sticky top-0 z-30 space-y-3">
                  <div className="rounded-2xl border border-border/60 bg-background/95 px-3 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-5 sm:py-5">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-4">
                        <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(hsl(var(--primary)) ${
                                progressValue * 3.6
                              }deg, hsl(var(--muted)) ${
                                progressValue * 3.6
                              }deg)`,
                            }}
                          />
                          <div className="absolute inset-[5px] rounded-full border border-muted/40 bg-background" />
                          <span className="relative text-xs font-semibold text-foreground">
                            {hasReachedTarget
                              ? "Ready"
                              : `${pollCount}/${POLL_TARGET}`}
                          </span>
                        </div>
                        <div className="flex w-full max-w-[420px] flex-col items-center gap-2 text-center sm:max-w-none sm:items-start sm:text-left">
                          <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-muted-foreground sm:justify-start">
                            <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                              Step 3 of 3
                            </span>
                            <span className="font-medium">Question stack</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground sm:text-base">
                            Make the flow feel natural for someone getting to
                            know you.
                          </p>
                          {hasReachedTarget ? (
                            <p className="text-xs text-muted-foreground">
                              You&apos;ve got {pollCount} questions lined up.
                              Tidy wording or reorder them if you want things to
                              land better.
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              You&apos;re {remainingPolls} away from the
                              suggested {POLL_TARGET}. Mix in something light
                              and something unexpected.
                            </p>
                          )}
                          <Progress value={progressValue} className="h-2" />
                        </div>
                      </div>
                      <div className="flex w-full flex-col gap-2 md:w-auto md:items-end md:gap-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <Button
                            id="primary-add-question"
                            onClick={() => setShowAddDialog(true)}
                            className="h-11 w-full rounded-full px-4 text-sm font-semibold shadow-none sm:h-10 sm:w-auto md:h-11 md:px-5"
                            icon={PlusIcon}
                            iconPlacement="left"
                          >
                            Add Question
                          </Button>
                          <Button
                            id="primary-add-from-library"
                            onClick={() => setShowLibrary(true)}
                            variant="outline"
                            className="h-11 w-full rounded-full px-4 text-sm font-semibold shadow-none sm:h-10 sm:w-auto md:h-11 md:px-5"
                            icon={Library}
                            iconPlacement="left"
                          >
                            Add from Library
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {lastLibraryAdd ? (
                    <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary">
                      <div className="flex items-center gap-2">
                        <span>
                          Added{" "}
                          <span className="font-semibold">
                            &quot;{lastLibraryAdd}&quot;
                          </span>{" "}
                          to your qwirl.
                        </span>
                      </div>
                      <Button
                        onClick={() => setLastLibraryAdd(null)}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-primary hover:text-primary"
                      >
                        Dismiss
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div id="qwirl-polls-container">
                  <VerticalEditView
                    onAddQuestion={() => setShowAddDialog(true)}
                    onOpenLibrary={() => setShowLibrary(true)}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </PageLayout>

      {/* Dialogs and Slide-overs */}
      <AddPollDialog
        isModalOpen={showAddDialog}
        setIsModalOpen={setShowAddDialog}
        handleAddPoll={handleAddPoll}
        isSubmitting={addPollToQwirlMutation.isPending}
      />

      <LibrarySlideOver
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onAddPoll={handleAddPollFromLibrary}
      />
    </>
  );
};

export default PrimaryQwirlEditPage;
