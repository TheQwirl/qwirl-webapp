"use client";
import { PageLayout } from "@/components/layout/page-layout";
import React from "react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import { EditIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import EditableQwirlCover from "@/components/qwirl/editable-qwirl-cover";

const PrimaryQwirlEditPage = () => {
  const {
    polls,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showAddDialog,
  } = useQwirlEditor();

  return (
    <>
      <PageLayout
        rightSidebar={<PrimaryQwirlRightSidebar polls={polls} />}
        backNavigation={{
          title: (
            <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
              <EditIcon className="h-4 lg:h-5 w-4 lg:w-5" />
              Edit Mode
            </div>
          ),
          rightContent: (
            <Button
              onClick={() => setShowAddDialog(true)}
              //   disabled={questions.length >= 35}
              className="group rounded-full md:rounded shadow-none"
              icon={PlusIcon}
              iconPlacement="left"
            >
              Add Poll
            </Button>
          ),
          subtitle: "Modify your primary qwirl",
          hideBackButton: true,
        }}
      >
        <div className="relative grid grid-cols-12 gap-5 ">
          <div className="overflow-hidden col-span-full lg:col-span-full px-4 pb-4 space-y-8">
            {/* Qwirl Cover Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Qwirl Cover
                </span>
              </div>
            </div>

            <EditableQwirlCover />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Polls
                </span>
              </div>
            </div>

            {/* Poll Cards */}
            <VerticalEditView />
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

export default PrimaryQwirlEditPage;
