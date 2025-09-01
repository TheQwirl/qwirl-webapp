import { ReactNode } from "react";
import { ThreeColumnLayout } from "./three-column-layout";
import { BackNavigationConfig } from "../back-navigation";

interface PageLayoutProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
  middleColumnClassName?: string;
  rightColumnClassName?: string;
  backNavigation?: BackNavigationConfig;
}

export const PageLayout = (props: PageLayoutProps) => {
  return <ThreeColumnLayout {...props} />;
};
