import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CompactQuestionCard } from "@/components/qwirl/compact-question-card";

interface Question {
  id: string;
  text: string;
  options: string[];
  tags: string[];
  category: string;
  creator: {
    username: string;
    avatarUrl: string;
  };
  usageCount: number;
  upvotes: number;
}

interface QuestionBankDialogProps {
  showQuestionBank: boolean;
  setShowQuestionBank: (show: boolean) => void;
  selectQuestionFromBank: (question: Question) => void;
}

// Mock question bank data - replace with your API
const mockQuestions: Question[] = [
  {
    id: "1",
    text: "What's the best programming language for beginners?",
    options: ["Python", "JavaScript", "Java", "C++"],
    tags: ["programming", "beginner"],
    category: "Technology",
    creator: {
      username: "coder123",
      avatarUrl: "https://example.com/avatar1.png",
    },
    usageCount: 150,
    upvotes: 75,
  },
  {
    id: "2",
    text: "Which social media platform do you use most?",
    options: ["Instagram", "Twitter", "TikTok", "LinkedIn"],
    tags: ["social", "lifestyle"],
    category: "Social Media",
    creator: {
      username: "coder123",
      avatarUrl: "https://example.com/avatar1.png",
    },
    usageCount: 150,
    upvotes: 75,
  },
  {
    id: "3",
    text: "What's your preferred work style?",
    options: ["Remote", "Hybrid", "In-office", "Flexible"],
    tags: ["work", "lifestyle"],
    category: "Work",
    creator: {
      username: "coder123",
      avatarUrl: "https://example.com/avatar1.png",
    },
    usageCount: 150,
    upvotes: 75,
  },
];

export function QuestionBankDialog({
  showQuestionBank,
  setShowQuestionBank,
  selectQuestionFromBank,
}: QuestionBankDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [questionBankResults, setQuestionBankResults] =
    useState<Question[]>(mockQuestions);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "All",
    "Technology",
    "Social Media",
    "Work",
    "Entertainment",
  ];
  const availableTags = [
    "programming",
    "beginner",
    "social",
    "lifestyle",
    "work",
  ];

  const searchQuestionBank = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call with filtering
      let filtered = mockQuestions;

      if (searchQuery) {
        filtered = filtered.filter(
          (q) =>
            q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (q) => q.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (selectedTags.length > 0) {
        filtered = filtered.filter((q) =>
          selectedTags.some((tag) => q.tags.includes(tag))
        );
      }

      setQuestionBankResults(filtered);
    } catch (error) {
      console.error("Error searching question bank:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedTags]);
  // Search question bank
  useEffect(() => {
    if (showQuestionBank) {
      searchQuestionBank();
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedTags,
    showQuestionBank,
    searchQuestionBank,
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1 flex-wrap">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
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
              ) : questionBankResults.length > 0 ? (
                questionBankResults.map((question) => (
                  <CompactQuestionCard
                    key={question.id}
                    answers={question.options}
                    creator={question.creator}
                    question={question.text}
                    usageCount={question.usageCount || 0}
                    upvotes={question.upvotes || 0}
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
                  // <Card
                  //   key={question.id}
                  //   className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/50"
                  //   onClick={() => selectQuestionFromBank(question)}
                  // >
                  //   <CardContent className="p-3 sm:p-4">
                  //     <div className="space-y-2 sm:space-y-3">
                  //       <div className="flex justify-between items-start gap-2">
                  //         <p className="font-medium text-xs sm:text-sm leading-relaxed flex-1">
                  //           {question.text}
                  //         </p>
                  //         {/* <Badge
                  //           variant="outline"
                  //           className="text-xs flex-shrink-0"
                  //         >
                  //           {question.difficulty}
                  //         </Badge> */}
                  //       </div>

                  //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  //         {question.options.map((option, idx) => (
                  //           <div
                  //             key={idx}
                  //             className={`text-xs p-2 rounded border bg-gray-50 border-gray-200`}
                  //           >
                  //             {option}
                  //           </div>
                  //         ))}
                  //       </div>

                  //       <div className="flex justify-between items-center">
                  //         <div className="flex gap-1 flex-wrap">
                  //           {question.tags.slice(0, 3).map((tag) => (
                  //             <Badge
                  //               key={tag}
                  //               variant="secondary"
                  //               className="text-xs"
                  //             >
                  //               {tag}
                  //             </Badge>
                  //           ))}
                  //         </div>
                  //         <Button
                  //           size="sm"
                  //           variant="outline"
                  //           className="text-xs"
                  //         >
                  //           Use Question
                  //         </Button>
                  //       </div>
                  //     </div>
                  //   </CardContent>
                  // </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No questions found. Try adjusting your search.
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
