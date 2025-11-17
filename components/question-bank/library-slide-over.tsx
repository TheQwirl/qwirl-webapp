"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw, X } from "lucide-react";
import $api from "@/lib/api/client";
import type { components } from "@/lib/api/v1-client-side";
import { QuestionCardSkeleton } from "@/components/question-bank/question-card";
import { useDebounce } from "@/hooks/useDebounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { QuestionFormCard } from "@/components/question-bank/question-form-card";

type Question = components["schemas"]["QuestionSearchResponse"];

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
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-border/60 p-0 sm:max-w-[520px]"
        overlayClassName=""
      >
        <div className="border-b border-border/50 bg-background/95 px-6 pt-6 pb-5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="">
                <SheetTitle className="text-start">Question Library</SheetTitle>
                <SheetDescription className="text-start">
                  Browse and add questions from our extensive library to your
                  Qwirl.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <X className="h-6 w-6" />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <InputGroup className="flex-1 rounded-full border-border/60">
                <InputGroupAddon className="pl-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search by topic, vibe, or keyword..."
                  className="h-10 rounded-full border-0 pl-2 text-sm"
                  value={searchQuery}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(event.target.value)
                  }
                />
                {searchQuery ? (
                  <InputGroupButton
                    type="button"
                    aria-label="Clear search"
                    size="icon-xs"
                    variant="ghost"
                    icon={X}
                    onClick={() => setSearchQuery("")}
                  />
                ) : null}
              </InputGroup>
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10 rounded-full border-border/60 text-sm">
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
          <div className="space-y-6 px-3 pb-10">
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
