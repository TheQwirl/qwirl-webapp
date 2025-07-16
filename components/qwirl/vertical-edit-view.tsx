import React from "react";
import { QwirlItem } from "./types";
import { Card, CardContent } from "../ui/card";
import { GripVertical } from "lucide-react";
import { SortableList } from "../sortable-list/sortable-list";

interface VerticalEditViewProps {
  qwirlPolls: QwirlItem[];
  isLoading: boolean;
}

const VerticalEditView = ({ qwirlPolls, isLoading }: VerticalEditViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if (qwirlPolls?.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
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
      items={qwirlPolls}
      onChange={() => {}}
      className="space-y-4 pb-6"
      renderItem={(qwirlPoll) => (
        <SortableList.Item className="w-full" id={qwirlPoll?.id}>
          {/* <QwirlEditorCard
            key={question.id}
            handleDelete={() => handleDelete(question.id)}
            question={question}
          /> */}
        </SortableList.Item>
      )}
    />
  );
};

export default VerticalEditView;
