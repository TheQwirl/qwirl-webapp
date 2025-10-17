"use client";
import React, { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import clsx from "clsx";

interface Props {
  id: UniqueIdentifier;
  className?: string;
  isActive?: boolean;
  isOver?: boolean;
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
  isDragging: boolean;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
  isDragging: false,
});

export function SortableItem({
  children,
  id,
  className,
  isActive,
  isOver,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    transition: {
      duration: 150, // Smooth transition duration
      easing: "cubic-bezier(0.25, 1, 0.5, 1)", // Smooth easing
    },
  });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
      isDragging,
    }),
    [attributes, listeners, setActivatorNodeRef, isDragging]
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0 : undefined, // Completely hide the original when dragging
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <div
        className={clsx(
          "relative transition-all duration-150 ease-out",
          {
            "scale-105 shadow-lg": isActive,
            "scale-[1.02] shadow-md": isOver && !isActive,
            "opacity-0": isDragging,
          },
          className
        )}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref, isDragging } =
    useContext(SortableItemContext);

  return (
    <button
      className={clsx(
        "group flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 touch-none select-none",
        "hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "cursor-grab active:cursor-grabbing",
        {
          "opacity-50": isDragging,
          "bg-gray-100": isDragging,
        }
      )}
      {...attributes}
      {...listeners}
      ref={ref}
      aria-label="Drag to reorder"
    >
      <GripVertical
        className={clsx(
          "h-5 w-5 text-gray-400 transition-colors duration-200",
          "group-hover:text-gray-600 group-active:text-gray-700"
        )}
      />
    </button>
  );
}
