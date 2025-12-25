import React from "react";

// Control the onboarding steps exported to the app using an environment
// variable. This prevents the tour from running in production accidentally
// while allowing easy testing during development.
// - NEXT_PUBLIC_ONBOARDING_MODE=off     -> [] (default)
// - NEXT_PUBLIC_ONBOARDING_MODE=partial -> only first two steps
// - NEXT_PUBLIC_ONBOARDING_MODE=full    -> all steps
const MODE = process.env.NEXT_PUBLIC_ONBOARDING_MODE ?? "off";

const FULL_STEPS = [
  {
    tour: "qwirl-editor-tour",
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to Your Qwirl!",
        content: (
          <div className="space-y-2">
            <p>
              Let&apos;s get you started with building your Qwirl! A Qwirl is a
              collection of polls that help others discover who you are.
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll show you how to add and manage questions.
            </p>
          </div>
        ),
        selector: "#onboarding-welcome",
        side: "bottom" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>➕</>,
        title: "Add Your First Poll",
        content: (
          <div className="space-y-2">
            <p>
              Click the <strong>&quot;Add Poll&quot;</strong> button to create a
              custom question or browse from our question bank.
            </p>
            <p className="text-sm text-muted-foreground">
              Try creating a custom question first!
            </p>
          </div>
        ),
        selector: "#add-poll-button",
        side: "left" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>📚</>,
        title: "Browse Question Library",
        content: (
          <div className="space-y-2">
            <p>
              The <strong>&quot;Add from Library&quot;</strong> button gives you
              access to thousands of pre-made questions.
            </p>
            <p className="text-sm text-muted-foreground">
              This is the fastest way to build your Qwirl!
            </p>
          </div>
        ),
        selector: "#add-from-library-button",
        side: "left" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>✏️</>,
        title: "View Your Qwirl",
        content: (
          <div className="space-y-2">
            <p>
              Once you add questions, they&apos;ll appear here in your Qwirl.
              You can reorder, edit, or delete them anytime.
            </p>
            <p className="text-sm text-muted-foreground">
              Go ahead and add at least one question to continue!
            </p>
          </div>
        ),
        selector: "#qwirl-polls-container",
        side: "top" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>🗑️</>,
        title: "Managing Your Polls",
        content: (
          <div className="space-y-2">
            <p>
              Each poll card has controls to edit or delete. You can also drag
              to reorder them.
            </p>
            <p className="text-sm text-muted-foreground">
              Try deleting a poll by clicking the delete button on any card!
            </p>
          </div>
        ),
        selector: "#qwirl-poll-card-0",
        side: "right" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>🎉</>,
        title: "You're All Set!",
        content: (
          <div className="space-y-2">
            <p>Great job! You now know how to create and manage your Qwirl.</p>
            <p className="text-sm text-muted-foreground">
              Build a Qwirl with 15 questions that truly represent you, then
              share it with the world!
            </p>
          </div>
        ),
        selector: "#onboarding-welcome",
        side: "bottom" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
    ],
  },
];

const PARTIAL_STEPS = [
  {
    tour: "qwirl-editor-tour",
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to Your Qwirl!",
        content: (
          <div className="space-y-2">
            <p>
              Let&apos;s get you started with building your Qwirl! A Qwirl is a
              collection of polls that help others discover who you are.
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll show you how to add and manage questions.
            </p>
          </div>
        ),
        selector: "#onboarding-welcome",
        side: "bottom" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
      {
        icon: <>➕</>,
        title: "Add Your First Poll",
        content: (
          <div className="space-y-2">
            <p>
              Click the <strong>&quot;Add Poll&quot;</strong> button to create a
              custom question or browse from our question bank.
            </p>
            <p className="text-sm text-muted-foreground">
              Try creating a custom question first!
            </p>
          </div>
        ),
        selector: "#add-poll-button",
        side: "left" as const,
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 12,
      },
    ],
  },
];

export const onboardingSteps =
  MODE === "full" ? FULL_STEPS : MODE === "partial" ? PARTIAL_STEPS : [];

export const ONBOARDING_MODE = MODE;
