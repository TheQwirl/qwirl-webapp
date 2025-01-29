"use client";
import ModalCustomQuestion, {
  QuestionForm,
} from "@/components/qwirl/modal-custom-question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Question } from "@/types/qwirl";
import clsx from "clsx";
// import { Reorder } from "framer-motion";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { TbMessageCircleQuestion } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QwirlEditorColumn from "@/components/qwirl/qwirl-editor-column";
import { RadialProgress } from "@/components/ui/radial-progress";
import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";

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
    <section className="grid grid-cols-12 max-h-screen pt-0 sm:pt-0 overflow-auto relative">
      <div
        className={clsx(
          "col-span-full lg:col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full px-3" : "px-5"
        )}
      >
        <div className="py-6 bg-background sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Qwirl Editor</h1>
              <p className="text-muted-foreground text-sm">
                Edit your primary qwirl here
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={questions.length >= 35}
                className="group rounded-full md:rounded"
              >
                <PlusIcon className="md:h-4 md:w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden md:block">Add Question</span>
              </Button>
              {isMobile && (
                <Button variant="outline" className="rounded-full">
                  <TbMessageCircleQuestion />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-12 gap-5">
          <div className="col-span-full gap-4 mb-8 max-h-fit lg:col-span-4 lg:sticky lg:top-[105px] flex-col sm:flex-row flex lg:flex-col items-center justify-center">
            <div className="flex p-4 rounded-2xl border border-dashed border-gray-300 flex-col items-center justify-center">
              <div className="text-lg font-semibold text-center">
                Qwirl Completed
              </div>
              <RadialProgress current={15} total={25} />
            </div>
            <div className=" flex p-4 rounded-2xl border border-dashed border-gray-300 flex-col items-center justify-center">
              <div className="text-lg font-semibold text-center">
                Qwirl Split
              </div>
              <HorizontalBarGraph />
            </div>
          </div>
          <QwirlEditorColumn
            setQuestions={setQuestions}
            questions={questions}
            handleDelete={handleDelete}
          />
        </div>
      </div>
      <div className="hidden lg:block lg:sticky max-h-screen  lg:top-0 lg:col-span-4 py-7">
        {/* bg-peachy-horizon */}
        <div className="relative rounded-l-3xl py-10 px-5  border-dashed border-primary shadow-sm h-full bg-peachy-horizon">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-accent-foreground">
              Question Bank
            </h2>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Search a question..."
                className="w-full  bg-white"
              />
              <div className="grid grid-cols-2 gap-4 mt-3">
                <Select>
                  <SelectTrigger className="col-span-1 border-primary bg-white">
                    <SelectValue placeholder="Question Category" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="col-span-1  border-primary bg-white">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {!isMobile && (
        
      )} */}
      <ModalCustomQuestion
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAddQuestion={handleAddQuestion}
      />
    </section>
  );
};

export default PrimaryQwirlEditor;
