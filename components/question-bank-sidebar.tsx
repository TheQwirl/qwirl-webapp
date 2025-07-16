import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

/**
 * @deprecated This component is deprecated and will be removed in future versions.
 * Use the QuestionBankDialog component instead.
 */
const QuestionBankSidebar = () => {
  return (
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
  );
};

export default QuestionBankSidebar;
