import { Globe, HeartOff, Puzzle } from "lucide-react";
import { Badge } from "../ui/badge";

const clarifications = [
  {
    title: "Not a social network",
    description:
      "Qwirl enhances the profiles, communities, and spaces you already use instead of becoming yet another feed.",
    icon: Globe,
  },
  {
    title: "Not a personality test",
    description:
      "There are no labels, types, or predefined models — only the questions you choose and the answers you give.",
    icon: Puzzle,
  },
  {
    title: "Not a matchmaking app",
    description:
      "Alignment appears only when people engage with your Qwirl. No recommendations, no swiping, no algorithms forcing matches.",
    icon: HeartOff,
  },
];

export function WhatQwirlIsNotSection() {
  return (
    <section className="bg-background py-24 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <Badge
            className="mx-auto rounded-full px-6 py-1 text-xs tracking-wide"
            variant="outline"
          >
            What Qwirl Is Not
          </Badge>
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What Qwirl is not designed to be.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {clarifications.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-border/60 bg-muted/10 p-6 shadow-sm"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
