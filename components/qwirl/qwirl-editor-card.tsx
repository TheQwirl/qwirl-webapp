import { Question } from "@/types/qwirl";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { SortableList } from "../sortable-list/sortable-list";
import { CiMenuKebab } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";

type Props = {
  handleDelete: () => void;
  question: Question;
  className?: string;
};

const QwirlEditorCard: React.FC<Props> = ({ question, className }) => {
  return (
    <div className={clsx(className, question?.isHidden ? "text-muted" : "")}>
      <div className="rounded-lg border gap-2 p-4 bg-card text-card-foreground">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <SortableList.DragHandle />
            <Badge className="bg-foreground text-primary rounded-full">
              {question?.category}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <CiMenuKebab className=" h-5 w-5 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem className="group/btn cursor-pointer">
                <IoIosArrowRoundUp className="h-4 w-4" />
                <span>Up</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group/btn cursor-pointer">
                <IoIosArrowRoundDown className="h-4 w-4" />
                <span>Down</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group/btn text-destructive  cursor-pointer">
                <MdDeleteOutline className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className=" flex flex-col justify-center gap-4">
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
                    "gap-2 px-5 py-2 rounded flex items-center justify-between",
                    "bg-secondary/60  rounded-[14px] font-medium"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* <div className="text-lg">{idx + 1}.</div> */}
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
    </div>
  );
};

export default QwirlEditorCard;
