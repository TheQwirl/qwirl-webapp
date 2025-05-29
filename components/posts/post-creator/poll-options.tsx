import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { PostCreatorData } from "./schema";

interface PollOptionsProps {
  options: PostCreatorData["pollOptions"];
  onUpdateOption: (id: string, text: string) => void;
  onRemoveOption: (index: number) => void;
  onAddOption: () => void;
}

export function PollOptions({
  options,
  onUpdateOption,
  onRemoveOption,
  onAddOption,
}: PollOptionsProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">Options</Label>
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 group"
        >
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={option.text}
              onChange={(e) => onUpdateOption(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveOption(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </motion.div>
      ))}
      {options.length < 6 && (
        <Button
          type="button"
          variant="outline"
          icon={Plus}
          iconPlacement="left"
          className="w-full border-dashed text-xs sm:text-sm"
          onClick={onAddOption}
        >
          Add option
        </Button>
      )}
    </div>
  );
}
