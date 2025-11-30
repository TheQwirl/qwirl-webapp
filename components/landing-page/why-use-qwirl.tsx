import { Activity, Compass, Share2, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

const reasons = [
  {
    title: "Depth in minutes",
    description: "Get meaningful insight from one quick interaction.",
    icon: Sparkles,
  },
  {
    title: "Instant alignment",
    description: "See alignment instantly through Wavelength.",
    icon: Activity,
  },
  {
    title: "Confident connections",
    description: "Remove guesswork in forming connections and collaborations.",
    icon: Compass,
  },
  {
    title: "Portable introduction",
    description: "Share a portable introduction anywhere you already interact.",
    icon: Share2,
  },
];

export function WhyUseQwirlSection() {
  return (
    <section className="bg-muted/30 py-24 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <Badge
            className="mx-auto rounded-full px-6 py-1 text-xs tracking-wide"
            variant="secondary"
          >
            Why use Qwirl
          </Badge>
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
            One link answers the question: &ldquo;Who am I connecting
            with?&rdquo;
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm transition hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
