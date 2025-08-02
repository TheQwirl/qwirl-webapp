"use client";
import clsx from "clsx";
import { Edit3, Eye, LayoutGrid, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { RadialProgress } from "@/components/ui/radial-progress";
import HorizontalBarGraph from "@/components/ui/horizontal-bar-graph";
import PageHeader from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import { ViewToggle } from "@/components/icon-toggle";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import SingleCardView from "@/components/qwirl/single-card-view";

type ViewMode = "edit" | "view";
const MAX_POLL_COUNT = 15;

const PrimaryQwirlEditor = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const {
    polls,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showAddDialog,
  } = useQwirlEditor();

  return (
    <>
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
            <div className="overflow-y-hidden col-span-full lg:col-span-full px-4 pb-4 space-y-4">
              <Card className="">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-between lg:flex-nowrap">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
                        <LayoutGrid className="h-4 lg:h-5 w-4 lg:w-5" />
                        {viewMode === "edit" ? "Edit Mode" : "View Mode"}
                      </CardTitle>
                      <div className=" items-center gap-2 text-sm text-gray-600 hidden md:flex">
                        <Badge
                          variant="default"
                          className="rounded-full whitespace-nowrap"
                        >
                          Total: {polls?.length || 0}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Add Poll Button */}
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => setShowAddDialog(true)}
                          //   disabled={questions.length >= 35}
                          className="group rounded-full md:rounded shadow-none"
                          icon={PlusIcon}
                          iconPlacement="left"
                        >
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              {viewMode === "edit" ? <VerticalEditView /> : <SingleCardView />}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:sticky  lg:top-1 lg:col-span-3 py-7">
          <div className="col-span-full max-h-fit lg:col-span-4 lg:sticky lg:top-4 flex flex-col gap-6">
            <div className="flex p-4 rounded-2xl  border  border-gray-300 flex-col items-center justify-center">
              <div className="text-lg font-semibold text-center">
                Qwirl Completed
              </div>
              <RadialProgress current={polls?.length} total={MAX_POLL_COUNT} />
            </div>
            <div className=" flex p-4 rounded-2xl border  border-gray-300 flex-col items-center justify-center">
              <div className="text-lg font-semibold text-center">
                Qwirl Split
              </div>
              <HorizontalBarGraph />
            </div>
          </div>
        </div>
      </section>
      <AddPollDialog
        isModalOpen={showAddDialog}
        setIsModalOpen={setShowAddDialog}
        handleAddPoll={handleAddPoll}
        isSubmitting={addPollToQwirlMutation.isPending}
      />
    </>
  );
};

export default PrimaryQwirlEditor;
