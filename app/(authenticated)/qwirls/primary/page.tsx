"use client";
import clsx from "clsx";
import { Edit3, Eye } from "lucide-react";
import React, { useState } from "react";
import { RadialProgress } from "@/components/ui/radial-progress";
import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";
import PageHeader from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import QwirlEditView from "@/components/qwirl/qwirl-edit-view";
import QwirlViewMode from "@/components/qwirl/qwirl-view-mode";
import { ViewToggle } from "@/components/icon-toggle";

type ViewMode = "edit" | "view";

const PrimaryQwirlEditor = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  return (
    <section className="grid grid-cols-12 pt-0 sm:pt-0 ">
      <div
        className={clsx(
          "col-span-full lg:col-span-9 px-0 lg:px-6 flex flex-col h-full"
        )}
      >
        <PageHeader
          pageTitle="My Profile Qwirl"
          pageSubTitle="View and Edit profile qwirl."
          extraContent={
            <div className="flex items-center space-x-3">
              <Label className="text-sm font-medium">
                {viewMode === "edit" ? "Edit Mode" : "View Mode"}
              </Label>
              <ViewToggle
                options={[
                  {
                    value: "edit",
                    label: "Edit Mode",
                    icon: <Edit3 className="h-4 w-4" />,
                  },
                  {
                    value: "view",
                    label: "View Mode",
                    icon: <Eye className="h-4 w-4" />,
                  },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
              />
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
