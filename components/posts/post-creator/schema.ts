import { z } from "zod";

export const PollOptionSchema = z.object({
  id: z.string().min(1), // Assuming ID is always present and non-empty
  text: z.string().min(1, { message: "Option text cannot be empty." }),
});

export const PostCreatorSchema = z.object({
  content: z.string().optional(),
  question: z.string().min(1, { message: "A poll question is required." }),
  duration: z.enum(["1h", "6h", "24h", "7d"], {
    required_error: "Poll duration is required.",
    invalid_type_error: "Please select a valid duration.",
  }),
  pollOptions: z
    .array(PollOptionSchema)
    .min(2, { message: "A poll must have at least two options." })
    .max(6, { message: "A poll can have a maximum of six options." }),
});

export type PostCreatorData = z.infer<typeof PostCreatorSchema>;
