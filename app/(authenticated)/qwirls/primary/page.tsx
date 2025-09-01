"use client";
import { Edit3, Eye, LayoutGrid, PlusIcon } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { ViewToggle } from "@/components/icon-toggle";
import { useQwirlEditor, ViewMode } from "@/hooks/qwirl/useQwirlEditor";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import SingleCardView from "@/components/qwirl/single-card-view";
import { PageLayout } from "@/components/layout/page-layout";
import PrimaryQwirlRightSidebar from "../_components/primary-qwirl-right-sidebar";

const PrimaryQwirlEditor = () => {
  const {
    polls,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showAddDialog,
    viewMode,
    setViewMode,
  } = useQwirlEditor();

  return (
    <>
      <PageLayout
        rightSidebar={<PrimaryQwirlRightSidebar polls={polls} />}
        backNavigation={{
          title: "My Qwirl",
          rightContent: (
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
          ),
        }}
      >
        <div className="relative grid grid-cols-12 gap-5 ">
          <div className="overflow-hidden col-span-full lg:col-span-full px-4 pb-4 space-y-4">
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
      </PageLayout>

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
