"use client";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableQwirlCard } from "./sortable-qwirl-card";

const VerticalEditView = () => {
  const { polls, qwirlQuery, handleReorder, handleDelete, isDeleting } =
    useQwirlEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = polls?.findIndex((item) => item.id === active.id) ?? -1;
      const newIndex = polls?.findIndex((item) => item.id === over.id) ?? -1;

      if (oldIndex !== -1 && newIndex !== -1 && polls) {
        const reorderedItems = [...polls];
        const [removed] = reorderedItems.splice(oldIndex, 1);
        if (removed) {
          reorderedItems.splice(newIndex, 0, removed);
          handleReorder(reorderedItems);
        }
      }
    }
  };

  if (qwirlQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-0 bg-white shadow-sm animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (qwirlQuery?.data?.items?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No polls yet</h3>
              <p className="text-gray-600">
                Add your first poll to get started with your Qwirl!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={polls?.map((item) => item.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {polls?.map((qwirlPoll, index) => (
            <SortableQwirlCard
              key={qwirlPoll.id}
              poll={qwirlPoll}
              onDelete={() => handleDelete(qwirlPoll.id)}
              isDeleting={isDeleting}
              id={`qwirl-poll-card-${index}`}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default VerticalEditView;
