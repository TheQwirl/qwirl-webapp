"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";

type InfoAlertData = {
  title: React.ReactNode;
  description: React.ReactNode;
};

type InfoAlertContextType = {
  showInfoAlert: (data: InfoAlertData) => void;
};

const InfoAlertContext = React.createContext<InfoAlertContextType | undefined>(
  undefined
);

export const InfoAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState<InfoAlertData | null>(null);

  const showInfoAlert = (newData: InfoAlertData) => {
    setData(newData);
    setIsOpen(true);
  };

  return (
    <InfoAlertContext.Provider value={{ showInfoAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex items-center justify-center">
            <Info className="h-6 w-6" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{data?.title}</AlertDialogTitle>
            <AlertDialogDescription>{data?.description}</AlertDialogDescription>
            <p className="italic text-xs text-muted-foreground">
              Tip: You can stop seeing tooltips by going into settings.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </InfoAlertContext.Provider>
  );
};

export const useInfoAlert = () => {
  const context = React.useContext(InfoAlertContext);
  if (context === undefined) {
    throw new Error("useInfoAlert must be used within an InfoAlertProvider");
  }
  return context;
};
