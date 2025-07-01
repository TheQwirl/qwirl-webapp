import React from "react";
import { Question } from "../../types/qwirl";
import QwirlEditorCard from "./qwirl-editor-card";
import clsx from "clsx";
import { SortableList } from "../sortable-list/sortable-list";

const QwirlEditorColumn = ({
  questions,
  handleDelete,
  setQuestions,
}: {
  questions: Question[];
  handleDelete: (id: string) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  return (
    <div
      className={clsx(
        "overflow-y-hidden col-span-full lg:col-span-full",
        false && "bg-primary/5  bg-blur rounded-lg  "
      )}
    >
      <SortableList
        items={questions}
        onChange={setQuestions}
        className="space-y-4 pb-6"
        renderItem={(question) => (
          <SortableList.Item className="w-full" id={question?.id}>
            <QwirlEditorCard
              key={question.id}
              handleDelete={() => handleDelete(question.id)}
              question={question}
            />
          </SortableList.Item>
        )}
      />
    </div>
  );
};

export default QwirlEditorColumn;
