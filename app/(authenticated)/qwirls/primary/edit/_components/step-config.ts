export type StepStatusType =
  | "complete"
  | "in-progress"
  | "not-started"
  | "optional"
  | "loading";

export type StepKey = "cover" | "socials" | "questions";

export type StepDefinition = {
  key: StepKey;
  stepLabel: string;
  title: string;
  description: string;
  href: string;
};

export const POLL_TARGET = 15;

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    key: "cover",
    stepLabel: "Step 1",
    title: "Set up your cover",
    description: "Pair a photo with a short intro that sounds like you.",
    href: "/qwirls/primary/edit/cover",
  },
  {
    key: "socials",
    stepLabel: "Step 2",
    title: "Add socials (optional)",
    description: "Share a couple links or details friends usually ask for.",
    href: "/qwirls/primary/edit/socials",
  },
  {
    key: "questions",
    stepLabel: "Step 3",
    title: "Build your question set",
    description: "Aim for 15 questions to unlock sharing.",
    href: "/qwirls/primary/edit/questions",
  },
];

export const STEP_DEFINITION_MAP = STEP_DEFINITIONS.reduce((acc, step) => {
  acc[step.key] = step;
  return acc;
}, {} as Record<StepKey, StepDefinition>);
