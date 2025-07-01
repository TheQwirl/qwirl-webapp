import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { CompactQuestionCard } from "@/components/qwirl/compact-question-card";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionBankDialogProps {
  showQuestionBank: boolean;
  setShowQuestionBank: (show: boolean) => void;
  selectQuestionFromBank: (question: Question) => void;
}

export function QuestionBankDialog({
  showQuestionBank,
  setShowQuestionBank,
  selectQuestionFromBank,
}: QuestionBankDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/question-bank/search",
      {
        params: {
          query: {
            params: JSON.stringify({
              text: searchQuery || "",
              categories: selectedCategory === "all" ? [] : [selectedCategory],
              tags: [],
            }),

            limit: 10,
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
          if (lastPage?.length < 10) {
            return undefined;
          }
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

  return (
    <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestionBank(false)}
              className="p-1 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Browse Question Bank
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 h-[60vh] sm:h-[600px] flex flex-col">
          {/* Search and Filters */}
          <div className="space-y-3 sm:space-y-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                className="pl-10 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="flex-1">
            <div className="space-y-2 sm:space-y-3 pr-2 sm:pr-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    Searching...
                  </p>
                </div>
              ) : questions.length > 0 ? (
                questions.map((question, index) => {
                  const isLastElement = questions.length === index + 1;
                  return (
                    <CompactQuestionCard
                      ref={isLastElement ? lastQuestionElementRef : null}
                      key={question.id}
                      answers={question.options}
                      question={question.question_text}
                      customActions={
                        <Button
                          onClick={() => selectQuestionFromBank(question)}
                          size="sm"
                          variant="default"
                          className="text-xs"
                        >
                          Use Question
                        </Button>
                      }
                    />
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No questions found. Try adjusting your search.
                  </p>
                </div>
              )}

              {isFetchingNextPage && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Loading more...
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
