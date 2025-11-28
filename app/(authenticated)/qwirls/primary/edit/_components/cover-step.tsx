"use client";

import EditableQwirlCover from "@/components/qwirl/editable-qwirl-cover";

export const CoverStepSection = () => {
  return (
    <section
      id="qwirl-cover"
      aria-labelledby="qwirl-cover-heading"
      className="space-y-5 p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <EditableQwirlCover className="w-full" isProfile />
        <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">What people see</p>
            <p>
              This cover is the first thing people see before answering and on
              the Discover page—use it to set the right tone and make your Qwirl
              stand out.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">Make a clear invite</p>
            <p>
              Use a short hook or prompt that invites a response—one short
              sentence or tagline works best. Keep it concise and action-leaning
              so people instantly know what to do.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-muted/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">
              Readable & recognisable
            </p>
            <p>
              Pick a background image or simple gradient with good contrast. On
              thumbnails (mobile/Discover) text can be cropped—ensure the focal
              area and contrast remain readable at small sizes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
