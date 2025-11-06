"use client";
import { PageLayout } from "@/components/layout/page-layout";
import React, { useState, useEffect } from "react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import { EditIcon, PlusIcon, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import EditableQwirlCover from "@/components/qwirl/editable-qwirl-cover";
import EditableUserSocials from "@/components/qwirl/editable-user-socials";
import { LibrarySlideOver } from "@/components/question-bank/library-slide-over";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { toast } from "sonner";

const PrimaryQwirlEditPage = () => {
  const {
    polls,
    qwirlQuery,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showAddDialog,
  } = useQwirlEditor();

  const [showLibrary, setShowLibrary] = useState(false);
  const { closeCart } = useCartUIStore();
  const { items: cartItems, clearCart } = useQuestionCart();

  useEffect(() => {
    const handleAddAllFromCart = async (event: Event) => {
      const customEvent = event as CustomEvent<{ questions: typeof cartItems }>;
      const { questions } = customEvent.detail;
      if (questions && questions.length > 0) {
        for (const question of questions) {
          await handleAddPoll({
            question_text: question.question_text,
            options: question.options,
            owner_answer_index: question.owner_answer_index,
          });
        }
        toast.success(`Added ${questions.length} polls to Qwirl`, {
          description: "Questions added from cart",
        });
        clearCart();
        closeCart();
      }
    };

    window.addEventListener("add-all-from-cart", handleAddAllFromCart);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("addFromCart") === "true" && cartItems.length > 0) {
      const event = new CustomEvent("add-all-from-cart", {
        detail: { questions: cartItems },
      });
      handleAddAllFromCart(event);
      window.history.replaceState({}, "", window.location.pathname);
    }

    return () => {
      window.removeEventListener("add-all-from-cart", handleAddAllFromCart);
    };
  }, [cartItems, handleAddPoll, clearCart, closeCart]);

  const handleAddPollFromLibrary = async (pollData: {
    question_text: string;
    options: string[];
    owner_answer_index: number;
  }) => {
    await handleAddPoll(pollData);
    toast.success("Poll added to Qwirl", {
      description: pollData.question_text.substring(0, 50) + "...",
    });
  };

  return (
    <>
      <PageLayout
        rightSidebar={
          <PrimaryQwirlRightSidebar
            isLoading={qwirlQuery.isLoading}
            polls={polls}
          />
        }
        backNavigation={{
          title: (
            <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
              <EditIcon className="h-4 lg:h-5 w-4 lg:w-5" />
              Edit Mode
            </div>
          ),
          rightContent: (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowLibrary(true)}
                variant="secondary"
                className="hidden sm:flex group rounded-full md:rounded shadow-none"
                icon={Library}
                iconPlacement="left"
              >
                Add from Library
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="group rounded-full md:rounded shadow-none"
                icon={PlusIcon}
                iconPlacement="left"
              >
                Add Poll
              </Button>
            </div>
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
                  Qwirl Profile
                </span>
              </div>
            </div>

            {/* Grid for Qwirl Cover and Social Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EditableQwirlCover />
              <EditableUserSocials />
            </div>

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

      {/* Dialogs and Slide-overs */}
      <AddPollDialog
        isModalOpen={showAddDialog}
        setIsModalOpen={setShowAddDialog}
        handleAddPoll={handleAddPoll}
        isSubmitting={addPollToQwirlMutation.isPending}
      />

      <LibrarySlideOver
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onAddPoll={handleAddPollFromLibrary}
      />
    </>
  );
};

export default PrimaryQwirlEditPage;
