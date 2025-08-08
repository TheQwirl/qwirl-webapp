import React from "react";
import { Card, CardContent } from "../ui/card";
import { GripVertical } from "lucide-react";
import { SortableList } from "../sortable-list/sortable-list";
import QwirlEditorCard, { QwirlEdiorCardLoading } from "./qwirl-editor-card";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";

const VerticalEditView = () => {
  const { polls, qwirlQuery, handleReorder, handleDelete, isDeleting } =
    useQwirlEditor();

  if (qwirlQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <QwirlEdiorCardLoading key={index} />
        ))}
      </div>
    );
  }

  if (qwirlQuery?.data?.items?.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white overflow-none">
        <CardContent className="p-12 text-center">
          <div className="text-gray-500">
            <GripVertical className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No polls yet</h3>
            <p>Add your first poll to get started with your Qwirl!</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <SortableList
      items={polls || []}
      onChange={(reorderedItems) => handleReorder(reorderedItems)}
      className="space-y-4 pb-6"
      renderItem={(qwirlPoll) => (
        <SortableList.Item className="w-full" id={qwirlPoll?.id}>
          <QwirlEditorCard
            key={qwirlPoll.id}
            handleDelete={() => handleDelete(qwirlPoll.id)}
            poll={qwirlPoll}
            isDeleting={isDeleting}
          />
        </SortableList.Item>
      )}
    />
  );
};

export default VerticalEditView;
