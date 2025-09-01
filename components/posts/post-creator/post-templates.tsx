import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Edit3 } from "lucide-react";
import { UseFieldArrayAppend, useFormContext } from "react-hook-form";
import { PostCreatorData } from "./schema";
import { Card, CardContent } from "@/components/ui/card";

interface PollTemplatesProps {
  onShowQuestionBank: () => void;
  append: UseFieldArrayAppend<PostCreatorData, "pollOptions">;
}

export function PollTemplates({
  onShowQuestionBank,
  append,
}: PollTemplatesProps) {
  const { setValue } = useFormContext<PostCreatorData>();

  const onStartFromScratch = () => {
    const firstOptionId = 1;
    const secondOptionId = 2;
    setValue("selected_option_index", firstOptionId);
    append([
      {
        id: firstOptionId,
        text: "Option 1",
      },
      {
        id: secondOptionId,
        text: "Option 2",
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
          onClick={onShowQuestionBank}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Question Bank</h3>
              <p className="text-sm text-muted-foreground">
                Choose from thousands of pre-made questions
              </p>
            </div>
            <Button
              icon={ChevronRight}
              iconPlacement="right"
              variant="outline"
              className="w-full"
            >
              Browse Questions
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
          onClick={onStartFromScratch}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Edit3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Custom Question</h3>
              <p className="text-sm text-muted-foreground">
                Create your own question from scratch
              </p>
            </div>
            <Button
              icon={ChevronRight}
              iconPlacement="right"
              variant="outline"
              className="w-full"
            >
              Create Question
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
