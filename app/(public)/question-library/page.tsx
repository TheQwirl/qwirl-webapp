"use client";
import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shuffle } from "lucide-react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import {
  QuestionCard,
  QuestionCardSkeleton,
} from "@/components/question-bank/question-card";
import { useDebounce } from "@/hooks/useDebounce";
import { authStore } from "@/stores/useAuthStore";
import { QwirlSelectionProvider } from "@/contexts/qwirl-selection-context";
import { QwirlCartButton } from "@/components/question-bank/qwirl-cart-button";
import { QwirlSelectionModal } from "@/components/question-bank/qwirl-selection-modal";

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

const QuestionBankPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = authStore();
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

  const handleSurpriseMe = () => {
    // This would ideally fetch a single random question from the API
    // For now, we can pick a random category to simulate discovery
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(randomCategory?.toLowerCase() || "all");
    setSearchQuery("");
  };

  return (
    <QwirlSelectionProvider>
      <QuestionBankContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        debouncedSearchQuery={debouncedSearchQuery}
        questions={questions}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        lastQuestionElementRef={lastQuestionElementRef}
        handleSurpriseMe={handleSurpriseMe}
        isAuthenticated={isAuthenticated}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </QwirlSelectionProvider>
  );
};

interface QuestionBankContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  debouncedSearchQuery: string;
  questions: Question[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  lastQuestionElementRef: (node: HTMLDivElement) => void;
  handleSurpriseMe: () => void;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

function QuestionBankContent({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  questions,
  isLoading,
  isFetchingNextPage,
  lastQuestionElementRef,
  handleSurpriseMe,
  isAuthenticated,
  isModalOpen,
  setIsModalOpen,
}: QuestionBankContentProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-8 relative">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
          Discover Questions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a universe of questions to define who you are. Find the
          perfect ones for your next Qwirl.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for questions about life, the universe, and everything..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 text-base w-full md:w-64">
                <SelectValue placeholder="Filter by Category" />
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
            <Button
              variant="outline"
              size="lg"
              className="h-12"
              onClick={handleSurpriseMe}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            {isAuthenticated && (
              <div className="">
                <QwirlCartButton onClick={() => setIsModalOpen(true)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {questions.map((question, index) => {
              const isLastElement = questions.length === index + 1;
              return (
                <QuestionCard
                  ref={isLastElement ? lastQuestionElementRef : null}
                  key={`${question.id}-${index}`}
                  question={question}
                  showSelectButton={isAuthenticated}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No questions found.</p>
            <p className="mt-2 text-base text-muted-foreground">
              Try a different search or category.
            </p>
            <Button onClick={() => setSearchQuery("")} className="mt-4">
              Clear Search
            </Button>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        )}
      </main>

      <QwirlSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default QuestionBankPage;
