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

const PrimaryQwirlEditor = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      isHidden: false,
      options: ["Yes", "No", "Maybe", "I don't know"],
      position: 0,
      text: "What is the capital of France?",
      userAnswer: 0,
      id: "1",
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
      },
    ];
    setQuestions(updatedQuestions);
  };
  const isMobile = useIsMobile();
  return (
    <section className="grid grid-cols-12 max-h-screen mt-4 sm:mt-0 overflow-auto relative">
      <div
        className={clsx(
          "col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full px-3" : "px-5"
        )}
      >
        {/* Header - Fixed */}
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

        {/* Scrollable Content */}
        <QwirlEditorColumn
          setQuestions={setQuestions}
          questions={questions}
          handleDelete={handleDelete}
        />
      </div>
      {!isMobile && (
        <div className="sticky  max-h-screen top-0 col-span-4 py-10 px-5 border-l border-primary shadow-sm h-full bg-primary/20 text-primary-foreground">
          <h2 className="text-xl font-semibold">Question Bank</h2>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full border border-primary bg-white"
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
      )}
      <ModalCustomQuestion
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAddQuestion={handleAddQuestion}
      />
    </section>
  );
};

export default PrimaryQwirlEditor;
