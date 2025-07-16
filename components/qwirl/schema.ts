import { z } from "zod";

export const QwirlPollSchema = z
  .object({
    question_text: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(6),
    owner_answer_index: z.number().int().nonnegative(),
  })
  // refine to check that owner_answer_index is within the bounds of options array
  .refine((data) => {
    return data.owner_answer_index < data.options.length;
  }, "Owner answer index must be less than the number of options.");
export type QwirlPollData = z.infer<typeof QwirlPollSchema>;
