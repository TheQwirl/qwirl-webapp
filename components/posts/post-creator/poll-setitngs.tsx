import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { PostCreatorData } from "./schema";

const durationOptions = [
  { value: "null", label: "Forever" }, // New option
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

export function PollSettings() {
  const { control } = useFormContext<PostCreatorData>();
  return (
    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col space-y-1">
              <Select
                onValueChange={(val) =>
                  field.onChange(val === "null" ? null : val)
                }
                value={field.value === null ? "null" : field.value}
              >
                <SelectTrigger
                  id="poll-duration"
                  className="w-[120px] sm:w-[150px] text-xs sm:text-sm h-8 sm:h-9"
                >
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs sm:text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </div>
  );
}
