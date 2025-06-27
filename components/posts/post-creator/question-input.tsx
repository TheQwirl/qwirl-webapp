import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostCreatorData } from "./schema";
import { motion } from "framer-motion";

export function QuestionInput() {
  const { control } = useFormContext<PostCreatorData>();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Question</Label>
      </div>
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Controller
          name="question"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="What's your question?"
              className="text-sm sm:text-base font-medium"
            />
          )}
        />
      </motion.div>
    </div>
  );
}
