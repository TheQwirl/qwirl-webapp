"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Sheet,
  SheetContent,
  // SheetDescription,
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
import { LibraryQuestionCardSkeleton } from "@/components/question-bank/library-question-card";
import { useDebounce } from "@/hooks/useDebounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { authStore } from "@/stores/useAuthStore";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { CATEGORY_LIST, categoryMeta } from "@/constants/categories";
import { LibraryQuestionCard } from "@/components/question-bank/library-question-card";

type Question = components["schemas"]["QuestionSearchResponse"];

interface LibrarySlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoll: (pollData: {
    question_text: string;
    options: string[];
    owner_answer_index: number;
    category_id: number;
  }) => Promise<void>;
}

export function LibrarySlideOver({
  isOpen,
  onClose,
  onAddPoll,
}: LibrarySlideOverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const { user } = authStore();

  // Initialize selected categories from the user's saved categories (if any)
  useEffect(() => {
    const initial = (user?.categories ?? []).map((c: string) =>
      c.toLowerCase()
    );
    setSelectedCategories(initial);
  }, [user]);

  // When sheet closes, reset active state so next open starts in browse mode
  useEffect(() => {
    if (!isOpen) {
      setActiveQuestionId(null);
    }
  }, [isOpen]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/question-bank/search",
      {
        params: {
          query: {
            params: JSON.stringify({
              text: debouncedSearchQuery || "",
              categories:
                selectedCategories.length === 0 ? [] : selectedCategories,
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
      CATEGORY_LIST.map((label) => ({
        label,
        value: label.toLowerCase(),
      })),
    []
  );

  const questions = data?.pages.flatMap((page) => page?.flat()) ?? [];
  const topMarkerRef = useRef<HTMLDivElement | null>(null);
  const hasActiveFilters =
    selectedCategories.length > 0 || searchQuery.trim().length > 0;

  const handleScrollToTop = useCallback(() => {
    if (topMarkerRef.current) {
      topMarkerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const normalizeCategory = (value: string) => value.toLowerCase();

  const handleAddCategory = useCallback(
    (value: string) => {
      if (!value || value === "all") return;
      const norm = normalizeCategory(value);
      setSelectedCategories((prev) =>
        prev.includes(norm) ? prev : [...prev, norm]
      );
      // scroll to top after adding
      window.requestAnimationFrame(() => handleScrollToTop());
    },
    [handleScrollToTop]
  );

  const handleRemoveCategory = useCallback((value: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== value));
  }, []);

  const handleCategoryChange = useCallback(
    (value: string) => {
      // The select acts as a picker only — add the category as a badge
      if (value === "all") {
        setSelectedCategories([]);
      } else {
        handleAddCategory(value);
      }
    },
    [handleAddCategory]
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
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
        <div className="relative px-6 pt-6 pb-5">
          {/* Distinct header background to separate controls from results */}
          <div className="pointer-events-none absolute inset-0 rounded-b-xl bg-card/95 shadow-sm border-b border-border/50 blur-none" />
          <div className="relative z-10">
            <SheetHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-start">
                      Question Library
                    </SheetTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          aria-label="About question library"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="max-w-xs p-1">
                          <p className="font-semibold">Question Library</p>
                          <p className="text-sm">
                            Browse and add questions from our extensive library
                            to your Qwirl.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {/* <SheetDescription className="text-start">
                    Browse and add questions from our extensive library to your
                    Qwirl.
                  </SheetDescription> */}
                </div>
                <SheetClose asChild>
                  <X className="h-4 w-4" />
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <InputGroup className="flex-1 border-border/60 rounded-md">
                  <InputGroupAddon className="pl-3 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search by topic, vibe, or keyword..."
                    className="h-9 border-0 pl-2 text-sm rounded-md"
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
                    "h-9 w-9 rounded-md border border-border/60 text-muted-foreground transition",
                    hasActiveFilters
                      ? "hover:border-primary/40 hover:text-primary"
                      : "opacity-40"
                  )}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>

                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-9 w-40 rounded-md text-sm">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryFilters.map((category) => {
                      const meta =
                        categoryMeta[
                          category.label as keyof typeof categoryMeta
                        ];
                      const Icon = meta?.icon;

                      return (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          disabled={selectedCategories.includes(category.value)}
                        >
                          <div className="flex items-center gap-2">
                            {Icon ? (
                              <Icon
                                className="h-4 w-4"
                                style={{ color: meta?.fg }}
                              />
                            ) : null}
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Selected categories badges — single-line horizontally scrollable with hidden scrollbar */}
                <div className="w-full mt-2 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {selectedCategories.length === 0
                    ? null
                    : selectedCategories.map((cat) => {
                        const label =
                          categoryFilters.find((c) => c.value === cat)?.label ??
                          cat;
                        const meta =
                          categoryMeta[label as keyof typeof categoryMeta];

                        if (!meta) {
                          return (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="inline-flex whitespace-nowrap text-nowrap items-center gap-2 rounded-full font-normal px-3 py-1 text-[10px]"
                            >
                              <span>{label}</span>
                              <button
                                aria-label={`Remove category ${label}`}
                                className="-mr-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveCategory(cat)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        }

                        const Icon = meta.icon;

                        return (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="inline-flex whitespace-nowrap items-center gap-2 rounded-full font-normal px-3 py-1 text-[10px]"
                            style={{ backgroundColor: meta.bg, color: meta.fg }}
                          >
                            <Icon className="h-3 w-3" />
                            <span>{label}</span>
                            <button
                              aria-label={`Remove category ${label}`}
                              className="-mr-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveCategory(cat)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1" type="auto">
          <div className="space-y-6 px-3 pb-10">
            <div ref={topMarkerRef} data-library-scroll-top className="-mb-4" />
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LibraryQuestionCardSkeleton key={i} />
                ))}
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-5">
                {questions.map((question, index) => {
                  const isLastElement = questions.length === index + 1;
                  const questionKey = `${question.id}-${index}`;
                  const isActive = activeQuestionId === String(question.id);
                  const dimmed = activeQuestionId !== null && !isActive;

                  return (
                    <div
                      key={questionKey}
                      ref={isLastElement ? lastQuestionElementRef : null}
                    >
                      <LibraryQuestionCard
                        question={question}
                        isActive={isActive}
                        dimmed={dimmed}
                        onRequestActive={() => {
                          setActiveQuestionId(String(question.id));
                        }}
                        onRequestClose={() => setActiveQuestionId(null)}
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
                  <LibraryQuestionCardSkeleton key={i} />
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
