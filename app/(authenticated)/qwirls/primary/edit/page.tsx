"use client";
import { PageLayout } from "@/components/layout/page-layout";
import React, { useState, useEffect } from "react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import { EditIcon, PlusIcon, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
            <div
              id="onboarding-welcome"
              className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 "
            >
              <EditIcon className="h-4 lg:h-5 w-4 lg:w-5" />
              Edit Mode
            </div>
          ),
          rightContent: (
            <div className="flex items-center gap-2">
              <Button
                id="add-from-library-button"
                onClick={() => setShowLibrary(true)}
                variant="secondary"
                className="hidden sm:flex group rounded-full md:rounded shadow-none"
                icon={Library}
                iconPlacement="left"
              >
                Add from Library
              </Button>
              <Button
                id="add-poll-button"
                onClick={() => setShowAddDialog(true)}
                className="group rounded-full md:rounded shadow-none"
                icon={PlusIcon}
                iconPlacement="left"
              >
                Add Question
              </Button>
            </div>
          ),
          subtitle: "Modify your primary qwirl",
          hideBackButton: true,
        }}
      >
        <div className="relative grid grid-cols-12 gap-5 ">
          <div className="overflow-hidden col-span-full px-4 pb-4">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-muted p-1">
                <TabsTrigger
                  value="profile"
                  className="rounded-full text-sm font-semibold"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="polls"
                  className="rounded-full text-sm font-semibold"
                >
                  Qwirl Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <EditableQwirlCover />
                  <EditableUserSocials />
                </div>
              </TabsContent>

              <TabsContent value="polls" className="space-y-8">
                <div id="qwirl-polls-container">
                  <VerticalEditView />
                </div>
              </TabsContent>
            </Tabs>
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
