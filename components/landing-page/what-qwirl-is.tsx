import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const descriptors = [
  {
    title: "Compact identity card",
    description:
      "Build a Qwirl from 10–15 multiple-choice questions you choose yourself. Every answer is intentional, never random.",
  },
  {
    title: "Fast, honest context",
    description:
      "Your Qwirl reflects your values, priorities, and ways of thinking. Their answers show you who they are through your chosen lens.",
  },
  {
    title: "Shared wavelength",
    description:
      "When someone answers your Qwirl, you both receive a Wavelength — a transparent alignment score based on real choices.",
  },
];

export function WhatQwirlIsSection() {
  return (
    <section className="bg-background py-24 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <Badge
            className="mx-auto rounded-full px-6 py-1 text-xs tracking-wide"
            variant="outline"
          >
            What Qwirl Is
          </Badge>
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A living snapshot of how you think, built by you — not an algorithm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {descriptors.map((descriptor) => (
            <div
              key={descriptor.title}
              className="rounded-3xl border border-border/60 bg-card/30 p-6 shadow-sm backdrop-blur"
            >
              <h3 className="text-lg font-semibold">{descriptor.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {descriptor.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/auth" className="flex items-center gap-2">
              Build your Qwirl
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
