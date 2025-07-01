import { Button } from "@/components/ui/button";
import { Plus, BookOpenCheck } from "lucide-react";
import { PollTemplate } from "./types";
import { UseFieldArrayAppend, useFormContext } from "react-hook-form";
import { PostCreatorData } from "./schema";

const templates = [
  {
    id: "questionbank",
    name: "Question Bank",
    icon: BookOpenCheck,
    options: [],
  },
];

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

  const onSelectTemplate = (template: PollTemplate) => {
    if (template.id === "questionbank") {
      onShowQuestionBank();
      return;
    }

    setValue("pollOptions", template.options);
    setValue("question_text", `What's your choice?`);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => {
          return (
            <Button
              key={template.id}
              type="button"
              icon={template.icon}
              iconPlacement="left"
              variant="ghost"
              className=" border p-2 sm:p-3  sm:gap-2"
              onClick={() => onSelectTemplate(template)}
            >
              {template.name}
            </Button>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          icon={Plus}
          iconPlacement="left"
          onClick={onStartFromScratch}
          className=" border p-2 sm:p-3  sm:gap-2"
        >
          Start from scratch
        </Button>
      </div>
    </div>
  );
}
