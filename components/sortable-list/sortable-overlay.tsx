import type { PropsWithChildren } from "react";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";

const dropAnimationConfig: DropAnimation = {
  duration: 700,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "1",
      },
    },
  }),
};

export function SortableOverlay({ children }: PropsWithChildren<object>) {
  return (
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      className="cursor-grabbing"
      style={{
        transformOrigin: "0 0",
      }}
    >
      <div className="transform rotate-3 scale-105 shadow-2xl ring-1 ring-black/10">
        {children}
      </div>
    </DragOverlay>
  );
}
