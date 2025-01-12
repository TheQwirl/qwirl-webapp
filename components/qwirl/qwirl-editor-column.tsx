import React from "react";
import { Question } from "../../types/qwirl";
import QwirlEditorCard from "./qwirl-editor-card";
import clsx from "clsx";

const QwirlEditorColumn = ({
  questions,
  handleDelete,
  setQuestions,
}: {
  questions: Question[];
  handleDelete: (id: string) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const [active, setActive] = React.useState(false);
  console.log(active);
  const column = "1";
  const handleDragStart = (e: React.DragEvent | any, question: Question) => {
    e.dataTransfer.setData("questionId", question.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const questionId = e?.dataTransfer?.getData("questionId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset.before || "-1";

    if (before !== questionId) {
      let copy = [...questions];

      let questionToTransfer = copy.find((c) => c.id === questionId);
      if (!questionToTransfer) return;
      questionToTransfer = { ...questionToTransfer };

      copy = copy.filter((c) => c.id !== questionId);

      const moveToBack = before === "-1";

      if (questionToTransfer) {
        if (moveToBack) {
          copy.push(questionToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === undefined) return;

          copy.splice(insertAtIndex, 0, questionToTransfer);
        }
      }

      setQuestions(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    if (el?.element) {
      el.element.style.opacity = "1";
    }
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };
  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        "flex-1 overflow-y-auto",
        active && "bg-primary/5  bg-blur rounded-lg"
      )}
    >
      <div className=" pb-6">
        {questions.map((question) => (
          <>
            <DropIndicator beforeId={question.id} column="1" />
            <QwirlEditorCard
              onDragStart={(e) => handleDragStart(e, question)}
              key={question.id}
              handleDelete={() => handleDelete(question.id)}
              question={question}
            />
          </>
        ))}
        <DropIndicator beforeId="-1" column="1" />
      </div>
    </div>
  );
};

export const DropIndicator = ({
  beforeId,
  column,
}: {
  beforeId: string;
  column: string;
}) => {
  return (
    <div
      data-before={beforeId ?? "-1"}
      data-column={column}
      className="my-2 h-0.5 w-full bg-primary opacity-0"
    />
  );
};

export default QwirlEditorColumn;
