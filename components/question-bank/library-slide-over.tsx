"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCcw, Check } from "lucide-react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { QuestionCardSkeleton } from "@/components/question-bank/question-card";
import { useDebounce } from "@/hooks/useDebounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompactQuestionCardEditable } from "@/components/qwirl/compact-question-card-editable";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "@/components/qwirl/schema";
import { cn } from "@/lib/utils";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionFormCardProps {
  question: Question;
  onAddPoll: (pollData: QwirlPollData) => Promise<void>;
}

// Separate component to manage form for each question
function QuestionFormCard({ question, onAddPoll }: QuestionFormCardProps) {
  const questionCategory = question.category_name;
  const questionTags = (question as { tags?: string[] }).tags ?? [];
  const questionOwnerAnswerIndex =
    (
      question as {
        owner_answer_index?: number;
      }
    ).owner_answer_index ?? 0;

  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: question.question_text,
      options: question.options || [],
      owner_answer_index: questionOwnerAnswerIndex,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    clearErrors,
    setError,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = methods;

  const [hasJustAdded, setHasJustAdded] = useState(false);

  const options = methods.watch("options") ?? [];
  const ownerAnswerIndex = methods.watch("owner_answer_index") ?? 0;
  const selectedOwnerAnswer = options[ownerAnswerIndex];

  const onSubmit = handleSubmit(async (data: QwirlPollData) => {
    clearErrors("root");
    try {
      await onAddPoll(data);
      setHasJustAdded(true);
      reset({ ...data });
      window.setTimeout(() => setHasJustAdded(false), 3500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add poll. Please try again.";
      setError("root", {
        type: "server",
        message,
      });
      setHasJustAdded(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            {questionCategory && (
              <Badge
                variant="outline"
                className="text-xs font-medium uppercase tracking-wide"
              >
                {questionCategory}
              </Badge>
            )}
            {questionTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                {questionTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 font-semibold"
                  >
                    {tag}
                  </span>
                ))}
                {questionTags.length > 3 ? (
                  <span className="rounded-full bg-muted/40 px-2 py-0.5 font-semibold text-muted-foreground/70">
                    +{questionTags.length - 3}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          {hasJustAdded ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Check className="h-3.5 w-3.5" /> Added
            </div>
          ) : null}
        </div>

        <CompactQuestionCardEditable bare />

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <p>
              Tap the option that feels most like your answer. We&apos;ll save
              it as your default when you add this question.
            </p>
          </div>
          {selectedOwnerAnswer ? (
            <p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] font-semibold text-primary">
              Your current choice: {selectedOwnerAnswer}
            </p>
          ) : null}
        </div>

        {errors.root ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </div>
        ) : null}

        <Button
          type="submit"
          className={cn(
            "w-full rounded-full text-sm font-semibold",
            hasJustAdded ? "bg-primary/90" : ""
          )}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting
            ? "Adding..."
            : hasJustAdded
            ? "Added to your Qwirl"
            : "Add to your Qwirl"}
        </Button>
      </form>
    </FormProvider>
  );
}

const categories = [
  "Food and Beverages",
  "Future and Imagination",
  "Nature and Environment",
  "Personal Preferences",
  "Philosophy and Soul",
  "Pop Culture and Entertainment",
  "Relationships and Social Life",
  "Sports and Games",
  "Technology and Trends",
  "Travel and Exploration",
];

interface LibrarySlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoll: (pollData: {
    question_text: string;
    options: string[];
    owner_answer_index: number;
  }) => Promise<void>;
}

export function LibrarySlideOver({
  isOpen,
  onClose,
  onAddPoll,
}: LibrarySlideOverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/question-bank/search",
      {
        params: {
          query: {
            params: JSON.stringify({
              text: debouncedSearchQuery || "",
              categories: selectedCategory === "all" ? [] : [selectedCategory],
              tags: [],
            }),
            limit: 12,
            skip: 0,
          },
        },
      },
      {
        initialPageParam: 0,
        pageParamName: "skip",
        getNextPageParam: (
          lastPage: Question[],
          allPages: { data: Question[] }[]
        ) => {
          if (lastPage?.length < 12) return undefined;
          return allPages.flat().length;
        },
      }
    );

  const observer = useRef<IntersectionObserver>(null);
  const lastQuestionElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const categoryFilters = useMemo(
    () =>
      categories.map((label) => ({
        label,
        value: label.toLowerCase(),
      })),
    []
  );

  const questions = data?.pages.flatMap((page) => page?.flat()) ?? [];
  const topMarkerRef = useRef<HTMLDivElement | null>(null);
  const hasActiveFilters =
    selectedCategory !== "all" || searchQuery.trim().length > 0;

  const handleScrollToTop = useCallback(() => {
    if (topMarkerRef.current) {
      topMarkerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      window.requestAnimationFrame(() => {
        handleScrollToTop();
      });
    },
    [handleScrollToTop]
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    handleCategoryChange("all");
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal={true}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-border/60 p-0 sm:max-w-[520px]"
        overlayClassName=""
        // pointer-events-none bg-transparent
      >
        <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 px-6 pt-6 pb-5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <SheetTitle>Question Library</SheetTitle>
                <SheetDescription>
                  Find pre-built prompts, tweak the wording, then add them to
                  your Qwirl.
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                aria-label="Reset search and category filters"
                className={cn(
                  "h-9 w-9 rounded-full border border-border/60 text-muted-foreground transition",
                  hasActiveFilters
                    ? "hover:border-primary/40 hover:text-primary"
                    : "opacity-40"
                )}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by topic, vibe, or keyword..."
                className="h-11 rounded-full border-border/60 pl-11 pr-6 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Category
              </div>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-11 text-sm">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryFilters.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1" type="auto">
          <div className="space-y-6 px-6 pb-10">
            <div ref={topMarkerRef} data-library-scroll-top className="-mb-4" />
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))}
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-5">
                {questions.map((question, index) => {
                  const isLastElement = questions.length === index + 1;
                  const questionKey = `${question.id}-${index}`;

                  return (
                    <div
                      key={questionKey}
                      ref={isLastElement ? lastQuestionElementRef : null}
                    >
                      <QuestionFormCard
                        question={question}
                        onAddPoll={onAddPoll}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30" />
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    Nothing matches those filters yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try another keyword or explore a different category.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCategoryChange("all")}
                  >
                    Reset category
                  </Button>
                </div>
              </div>
            )}

            {isFetchingNextPage && (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isFetchingNextPage && questions.length > 0 && !hasNextPage ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                <span>You&apos;ve reached the end of the library results.</span>
                <Button
                  size="sm"
                  variant="link"
                  className="text-xs"
                  onClick={handleScrollToTop}
                >
                  Back to top
                </Button>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
