import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { PostCreatorData } from "./schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Controller,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";

interface PollOptionsProps {
  options: PostCreatorData["pollOptions"];
  append: UseFieldArrayAppend<PostCreatorData, "pollOptions">;
  remove: UseFieldArrayRemove;
}

export function PollOptions({ options, append, remove }: PollOptionsProps) {
  const { control, watch, setValue } = useFormContext<PostCreatorData>();
  const selectedOptionIndex = watch("selected_option_index");

  const removeOptionByIndex = (index: number) => {
    if (options.length > 2) {
      remove(index);

      if (selectedOptionIndex === index) {
        const newIndex = index < options.length - 1 ? index : index - 1;
        setValue("selected_option_index", newIndex);
      } else if (selectedOptionIndex > index) {
        setValue("selected_option_index", selectedOptionIndex - 1);
      }
    } else {
      console.warn(
        "Cannot remove option. A poll requires at least two options."
      );
    }
  };

  const addOption = () => {
    const newOptionData = {
      id: options.length + 1,
      text: `Option ${options.length + 1}`,
    };
    append(newOptionData);
  };

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
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Checkbox
              checked={index === selectedOptionIndex}
              onCheckedChange={() => {
                if (index !== selectedOptionIndex) {
                  setValue("selected_option_index", index);
                }
              }}
            />
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2 flex-1"
          >
            <Controller
              control={control}
              name={`pollOptions.${index}.text` as const}
              defaultValue={option.text}
              render={({ field }) => (
                <Input
                  {...field}
                  autoComplete="off"
                  maxLength={60}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 text-sm sm:text-base"
                />
              )}
            />
          </motion.div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeOptionByIndex(index)}
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
          onClick={addOption}
        >
          Add option
        </Button>
      )}
    </div>
  );
}
