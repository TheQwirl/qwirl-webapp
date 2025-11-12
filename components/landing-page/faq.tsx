"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function FAQ() {
  return (
    <div id="faq" className="py-20 border-t">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl sm:text-4xl font-black tracking-tight">FAQ</h3>
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How is the wavelength calculated?
            </AccordionTrigger>
            <AccordionContent>
              By default, each answered poll contributes equally to your match
              percentage. Creators can optionally mark certain polls as higher
              importance, which adjusts weighting. No complex personality
              profiling—just transparent math.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I hide or edit polls after publishing?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can toggle visibility per poll or for the whole Qwirl.
              Editing a poll creates a new version so past responses stay
              intact.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Do people see my answers before they answer?
            </AccordionTrigger>
            <AccordionContent>
              No. Answers reveal after someone submits their own choice for that
              poll. This keeps responses honest and fun.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Is this for dating, hiring, or friends?
            </AccordionTrigger>
            <AccordionContent>
              All of the above—or none. Qwirl is a conversation accelerant. Use
              it with classmates, teams, communities, or matches.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
