import { Question } from "@/types/qwirl";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { motion, PanInfo } from "framer-motion";

type Props = {
  handleDelete: () => void;
  question: Question;
  onDragStart: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
};

const QwirlEditorCard: React.FC<Props> = ({ question, onDragStart }) => {
  return (
    <motion.div
      layout
      layoutId={question?.id}
      onDragStart={onDragStart}
      draggable
      className={clsx(
        "grid grid-cols-12 gap-5 col-span-1",
        question?.isHidden ? "text-muted" : ""
      )}
    >
      <div className="col-span-4 border-b border-r border-dashed border-gray-300 relative">
        <div className="absolute bottom-4 right-4 rounded-full bg-black/80 text-white h-9 w-9 flex items-center justify-center text-lg">
          {question?.position}
        </div>
      </div>
      <div className="col-span-8 grid grid-cols-12 rounded-lg border gap-2 p-4 bg-secondary text-secondary-foreground">
        <div className="col-span-full md:col-span-1 flex md:flex-col justify-between items-center">
          <div className="group w-fit cursor-grab rotate-180 active:cursor-grabbing hover:bg-gray-400 hover:text-white rounded py-1 transition-all duration-300">
            <RxDragHandleDots2 className="h-5 w-5 " />
          </div>
          <MdDeleteOutline className="block md:hidden hover:swing h-5 w-5 cursor-pointer text-destructive" />
        </div>
        <div className="col-span-full md:col-span-11 flex flex-col justify-center gap-4">
          {question?.imageUrl && (
            <Image
              src={question?.imageUrl}
              className={clsx(
                question?.isHidden && "grayscale",
                "rounded w-full h-[200px] object-cover"
              )}
              width={200}
              height={200}
              alt="question-image"
            />
          )}
          <div className="">
            <div className="text-xl font-semibold">{question?.text}</div>
            <div className="mt-4 space-y-2">
              {question?.options.map((option, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "gap-2 px-4 py-2 rounded flex items-center justify-between",
                    "bg-black/50 text-white rounded-lg font-medium"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{idx + 1}.</div>
                    <div className="relative uppercase ">
                      {option}
                      {question?.userAnswer === idx && (
                        <div className="absolute -inset-2 rounded-lg -z-10 bg-gradient-to-r bg-primary opacity-75 blur"></div>
                      )}
                    </div>
                  </div>
                  {question?.userAnswer === idx && (
                    <div className="flex items-center justify-center flex-col gap-2">
                      <div className="flex items-center gap-1 text-xs bg-foreground text-primary rounded-full px-2 py-1">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span>You</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QwirlEditorCard;
