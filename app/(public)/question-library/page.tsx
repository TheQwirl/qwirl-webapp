"use client";
import { useState, useRef, useCallback } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { AdaptiveLayout } from "@/components/layout/adaptive-layout";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { toast } from "sonner";

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
  const { isAuthenticated } = authStore();
  const { addQuestion, canAddMore, isInCart } = useQuestionCart();

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

  const handleAddToCart = (question: Question) => {
    if (!canAddMore()) {
      toast.error("Cart is full", {
        description: "You can only add up to 30 questions to your cart.",
      });
      return;
    }

    addQuestion(question);
    toast.success("Added to cart", {
      description: `"${question.question_text}" added to your question cart.`,
    });
  };

  return (
    <AdaptiveLayout>
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
        onAddToCart={handleAddToCart}
        isInCart={isInCart}
      />
    </AdaptiveLayout>
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
  onAddToCart: (question: Question) => void;
  isInCart: (questionText: string) => boolean;
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
  onAddToCart,
  isInCart,
}: QuestionBankContentProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
            Discover Questions
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore a universe of questions to define who you are. Find the
            perfect ones for your next Qwirl.
          </p>
        </header>
      )}

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <InputGroup className="flex-1 bg-input">
            <InputGroupAddon>
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search for questions about life, the universe, and everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
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
            <Button variant="outline" size="icon" onClick={handleSurpriseMe}>
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <main>
        {isLoading ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              isAuthenticated
                ? "lg:grid-cols-3"
                : "lg:grid-cols-3 xl:grid-cols-4"
            } gap-6`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              isAuthenticated
                ? "lg:grid-cols-3"
                : "lg:grid-cols-3 xl:grid-cols-4"
            } gap-6`}
          >
            {questions.map((question, index) => {
              const isLastElement = questions.length === index + 1;
              return (
                <QuestionCard
                  ref={isLastElement ? lastQuestionElementRef : null}
                  key={`${question.id}-${index}`}
                  question={question}
                  showSelectButton={isAuthenticated}
                  onSelect={onAddToCart}
                  isSelected={isInCart(question.question_text)}
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
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              isAuthenticated
                ? "lg:grid-cols-3"
                : "lg:grid-cols-3 xl:grid-cols-4"
            } gap-6 mt-6`}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default QuestionBankPage;
