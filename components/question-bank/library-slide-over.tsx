"use client";

import React, { useState, useRef, useCallback } from "react";
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
import { Search } from "lucide-react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { QuestionCardSkeleton } from "@/components/question-bank/question-card";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompactQuestionCardEditable } from "@/components/qwirl/compact-question-card-editable";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "@/components/qwirl/schema";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionFormCardProps {
  question: Question;
  onAddPoll: (pollData: QwirlPollData) => Promise<void>;
}

// Separate component to manage form for each question
function QuestionFormCard({ question, onAddPoll }: QuestionFormCardProps) {
  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: question.question_text,
      options: question.options || [],
      owner_answer_index: 0,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: QwirlPollData) => {
    await onAddPoll(data);
    toast.success("Poll added to Qwirl", {
      id: `add-poll-success-${question.id}`,
      description: data.question_text.substring(0, 50) + "...",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <CompactQuestionCardEditable />
        <Button type="submit" className="w-full" disabled={!isValid}>
          Add Poll
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

  const questions = data?.pages.flatMap((page) => page?.flat()) ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Question Library</SheetTitle>
          <SheetDescription>
            Browse, edit, and add questions to your Qwirl
          </SheetDescription>
        </SheetHeader>

        {/* Search and Filters */}
        <div className="px-6 py-4 space-y-3 border-b bg-muted/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))}
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-6">
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
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg font-medium">No questions found</p>
                <p className="text-sm text-muted-foreground">
                  Try a different search or category
                </p>
              </div>
            )}

            {isFetchingNextPage && (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
