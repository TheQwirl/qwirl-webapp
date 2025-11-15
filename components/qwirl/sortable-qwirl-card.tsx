"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { QwirlItem } from "./types";
import QwirlEditorCard from "./qwirl-editor-card";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

interface SortableQwirlCardProps {
  poll: QwirlItem;
  onDelete: () => void;
  isDeleting: boolean;
  id?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
  isDragging: boolean;
}

const SortableItemContext = createContext<Context | null>(null);

export function useSortableItemContext() {
  return useContext(SortableItemContext);
}

export function SortableQwirlCard({
  poll,
  onDelete,
  isDeleting,
  id,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}: SortableQwirlCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: poll.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <div
        ref={setNodeRef}
        style={style}
        data-poll-card
        data-poll-card-id={poll.id}
        id={id}
        className={cn(isDragging && "opacity-50")}
      >
        <QwirlEditorCard
          poll={poll}
          handleDelete={onDelete}
          isDeleting={isDeleting}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          disableMoveUp={disableMoveUp}
          disableMoveDown={disableMoveDown}
        />
      </div>
    </SortableItemContext.Provider>
  );
}
