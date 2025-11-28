"use client";

import EditableUserSocials from "@/components/qwirl/editable-user-socials";

export const SocialsStepSection = () => {
  return (
    <section
      id="qwirl-socials"
      aria-labelledby="qwirl-socials-heading"
      className="space-y-5 p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="qwirl-socials-heading" className="text-xl font-semibold">
            Add ways for people to follow up
          </h2>
          <p className="text-sm text-muted-foreground">
            Share a couple links, handles, or notes so people know how to stay
            in touch.
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-muted/70 bg-background shadow-sm">
        <EditableUserSocials />
      </div>
    </section>
  );
};
