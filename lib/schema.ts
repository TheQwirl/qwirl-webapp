import { z } from "zod";

export const signUpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
  dob: z
    .date({
      required_error: "A date of birth is required.",
    })
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        const minAge = 13;
        const maxAge = 120;
        const minDate = new Date(
          today.getFullYear() - maxAge,
          today.getMonth(),
          today.getDate()
        );
        const maxDate = new Date(
          today.getFullYear() - minAge,
          today.getMonth(),
          today.getDate()
        );
        return parsedDate >= minDate && parsedDate <= maxDate;
      },
      { message: "You must be between 13 and 120 years old" }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const signInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, {
    message:
      "This isn't a valid password, you couldn't have created your account with this one.",
  }),
});
