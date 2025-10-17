"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";
import { SortableList } from "../sortable-list/sortable-list";
import QwirlEditorCard, { QwirlEdiorCardLoading } from "./qwirl-editor-card";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { motion, AnimatePresence } from "framer-motion";

const VerticalEditView = () => {
  const { polls, qwirlQuery, handleReorder, handleDelete, isDeleting } =
    useQwirlEditor();

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
            <QwirlEdiorCardLoading />
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
      <AnimatePresence mode="popLayout">
        <SortableList
          items={polls || []}
          onChange={(reorderedItems) => handleReorder(reorderedItems)}
          className="space-y-4"
          renderItem={(qwirlPoll) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="w-full"
            >
              <QwirlEditorCard
                key={qwirlPoll.id}
                handleDelete={() => handleDelete(qwirlPoll.id)}
                poll={qwirlPoll}
                isDeleting={isDeleting}
              />
            </motion.div>
          )}
        />
      </AnimatePresence>
    </div>
  );
};

export default VerticalEditView;
