import { z } from "zod";

export const QwirlPollSchema = z
  .object({
    question_text: z
      .string()
      .min(1, "Question text is required and cannot be empty"),
    options: z
      .array(z.string().min(1, "Each option must have at least 1 character"))
      .min(2, "At least 2 options are required")
      .max(6, "Maximum 6 options allowed"),
    owner_answer_index: z
      .number()
      .int("Answer index must be a whole number")
      .nonnegative("Answer index cannot be negative"),
    category_id: z
      .number()
      .int("Category id must be a whole number")
      .positive("Category id is required"),
  })
  // refine to check that owner_answer_index is within the bounds of options array
  .refine((data) => {
    return data.owner_answer_index < data.options.length;
  }, "Selected answer must be one of the available options");
export type QwirlPollData = z.infer<typeof QwirlPollSchema>;
