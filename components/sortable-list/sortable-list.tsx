"use client";
import React, { useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
} from "@dnd-kit/core";
import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { DragHandle, SortableItem } from "./sortable-item";
import { SortableOverlay } from "./sortable-overlay";

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T): ReactNode;
  className?: string;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  className,
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

  // Enhanced sensors with better touch/mouse support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Optimized measuring strategy for better performance
  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActive(event.active);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const overIndex = items.findIndex(({ id }) => id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          onChange(arrayMove(items, activeIndex, overIndex));
        }
      }

      setActive(null);
      setOverId(null);
    },
    [items, onChange]
  );

  const handleDragCancel = useCallback(() => {
    setActive(null);
    setOverId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={className} role="application">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              isActive={active?.id === item.id}
              isOver={overId === item.id}
            >
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
