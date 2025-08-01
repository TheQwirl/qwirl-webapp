"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { Edit3, Eye } from "lucide-react";
import React, { useState } from "react";
import { RadialProgress } from "@/components/ui/radial-progress";
import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";
import PageHeader from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import QwirlEditView from "@/components/qwirl/qwirl-edit-view";
import QwirlViewMode from "@/components/qwirl/qwirl-view-mode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewMode = "edit" | "view";

const PrimaryQwirlEditor = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const isMobile = useIsMobile();
  return (
    <section className="grid grid-cols-12 pt-0 sm:pt-0 ">
      <div
        className={clsx(
          "col-span-full lg:col-span-9 flex flex-col h-full",
          isMobile ? "col-span-full px-0" : "px-6"
        )}
      >
        <PageHeader
          pageTitle="My Profile Qwirl"
          pageSubTitle="View and Edit profile qwirl."
          extraContent={
            <div className="flex items-center space-x-3">
              <Label htmlFor="view-mode" className="text-sm font-medium">
                View Mode
              </Label>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="view-mode"
                  checked={viewMode === "edit"}
                  className="shadow-none outline outline-[1px] outline-gray-400"
                  onCheckedChange={(checked) =>
                    setViewMode(checked ? "edit" : "view")
                  }
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Edit3 className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label htmlFor="view-mode" className="text-sm font-medium">
                Edit Mode
              </Label>
            </div>
          }
        />

        <div className="relative grid grid-cols-12 gap-5 py-8">
          {viewMode === "edit" ? <QwirlEditView /> : <QwirlViewMode />}
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
    </section>
  );
};

export default PrimaryQwirlEditor;
