import { Badge } from "../ui/badge";

const statements = [
  "Every person is a set of questions and their answers.",
  "Qwirl turns this idea into a simple tool: choose the questions that define you, answer them, and let others do the same.",
  "A single interaction reveals more than bios, feeds, or small talk ever can.",
];

export function PhilosophySection() {
  return (
    <section className="bg-gradient-to-b from-background via-background to-muted/30 py-24 px-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 text-center">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="mx-auto rounded-full px-6 py-1 text-xs tracking-wide"
          >
            Philosophy
          </Badge>
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A Qwirl distills a person into the questions that matter most.
          </p>
        </div>
        <div className="space-y-6 text-lg text-muted-foreground">
          {statements.map((statement) => (
            <p key={statement}>{statement}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
