import { ReactNode } from "react";
import { PrimaryQwirlEditShell } from "./_components/primary-qwirl-edit-shell";

export default function PrimaryQwirlEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PrimaryQwirlEditShell>{children}</PrimaryQwirlEditShell>;
}
