import { Button } from "@/components/ui/button";
import { Plus, ThumbsUp, BookOpenCheck, BarChart2, Scale } from "lucide-react";
import { PollTemplate } from "./types";

const templates = [
  {
    id: "yesno",
    name: "Yes/No",
    icon: ThumbsUp, // 👍
    options: [
      { id: "1", text: "Yes" },
      { id: "2", text: "No" },
    ],
  },
  {
    id: "questionbank",
    name: "Question Bank",
    icon: BookOpenCheck, // 📚
    options: [],
  },
  {
    id: "choice",
    name: "Multiple Choice",
    icon: BarChart2, // 📊
    options: [
      { id: "1", text: "Option A" },
      { id: "2", text: "Option B" },
    ],
  },
  {
    id: "thisorthat",
    name: "This or That",
    icon: Scale, // ⚖️
    options: [
      { id: "1", text: "This" },
      { id: "2", text: "That" },
    ],
  },
];

interface PollTemplatesProps {
  onSelectTemplate: (template: PollTemplate) => void;
  onStartFromScratch: () => void;
}

export function PollTemplates({
  onSelectTemplate,
  onStartFromScratch,
}: PollTemplatesProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm ">Quick templates:</p>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => {
          return (
            <Button
              key={template.id}
              type="button"
              icon={template.icon}
              iconPlacement="left"
              variant="ghost"
              className="h-auto border p-2 sm:p-3  sm:gap-2"
              onClick={() => onSelectTemplate(template)}
            >
              <span className="text-xs">{template.name}</span>
            </Button>
          );
        })}
      </div>
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          icon={Plus}
          iconPlacement="left"
          onClick={onStartFromScratch}
          className="text-xs sm:text-sm"
        >
          Start from scratch
        </Button>
      </div>
    </div>
  );
}
