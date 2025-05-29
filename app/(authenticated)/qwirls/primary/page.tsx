"use client";
import ModalCustomQuestion, {
  QuestionForm,
} from "@/components/qwirl/modal-custom-question";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Question } from "@/types/qwirl";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

import QwirlEditorColumn from "@/components/qwirl/qwirl-editor-column";
import { RadialProgress } from "@/components/ui/radial-progress";
import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";
import PageHeader from "@/components/layout/page-header";
import $api from "@/lib/api/client";

const PrimaryQwirlEditor = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      isHidden: false,
      options: ["Yes", "No", "Maybe", "I don't know"],
      position: 0,
      text: "What is the capital of France? What is the capital of France?What is the capital of France?What is the capital of France?What is the capital of France?What is the capital of France?What is the capital of France?What is the capital of France?",
      userAnswer: 0,
      id: "1",
      category: "Sports",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isHidden: false,
      options: ["Love them", "Hate them", "I'm allergic"],
      position: 1,
      text: "Do you like cats",
      userAnswer: 0,
      id: "2",
      category: "Pets",
    },
  ]);

  const questionz = $api.useQuery("get", "/api/v1/users/primary-qwirl");
  console.log(questionz);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
  };
  const handleAddQuestion = (question: QuestionForm) => {
    const updatedQuestions = [
      ...questions,
      {
        ...question,
        id: Math.random().toString(),
        isHidden: questions.length >= 25,
        position: questions.length,
        category: "Sports",
      },
    ];
    setQuestions(updatedQuestions);
  };
  const isMobile = useIsMobile();
  return (
    <section className="grid grid-cols-12 pt-0 sm:pt-0 ">
      <div
        className={clsx(
          "col-span-full lg:col-span-9 flex flex-col h-full",
          isMobile ? "col-span-full px-3" : "px-6"
        )}
      >
        <PageHeader
          pageTitle="My Qwirl"
          pageSubTitle="View and Edit primary qwirl."
          extraContent={
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={questions.length >= 35}
                className="group rounded-full md:rounded"
                icon={PlusIcon}
                iconPlacement="left"
              >
                <span className="hidden md:block">Add Question</span>
              </Button>
            </div>
          }
        />

        <div className="relative grid grid-cols-12 gap-5 py-8">
          <QwirlEditorColumn
            setQuestions={setQuestions}
            questions={questions}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      <div className="hidden lg:block lg:sticky  lg:top-1 lg:col-span-3 py-7">
        <div className="col-span-full max-h-fit lg:col-span-4 lg:sticky lg:top-4 flex flex-col gap-6">
          <div className="flex p-4 rounded-2xl  border  border-gray-300 flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center">
              Qwirl Completed
            </div>
            <RadialProgress current={15} total={25} />
          </div>
          <div className=" flex p-4 rounded-2xl border  border-gray-300 flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center">Qwirl Split</div>
            <HorizontalBarGraph />
          </div>
        </div>
      </div>

      <ModalCustomQuestion
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAddQuestion={handleAddQuestion}
      />
    </section>
  );
};

export default PrimaryQwirlEditor;
