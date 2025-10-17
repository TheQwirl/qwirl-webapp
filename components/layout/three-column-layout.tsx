import { ReactNode } from "react";
import clsx from "clsx";
import { BackNavigation, BackNavigationConfig } from "../back-navigation";

interface ThreeColumnLayoutProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  backNavigation?: BackNavigationConfig;
  className?: string;
  middleColumnClassName?: string;
  rightColumnClassName?: string;
}

export const ThreeColumnLayout = ({
  children,
  rightSidebar,
  backNavigation,
  className,
  middleColumnClassName,
  rightColumnClassName,
}: ThreeColumnLayoutProps) => {
  const hasRightSidebar = !!rightSidebar;

  return (
    <div
      className={clsx(
        "min-h-screen grid grid-cols-12 gap-6 sm:mt-0",
        className
      )}
    >
      <div
        className={clsx(
          "col-span-full flex flex-col h-full",
          hasRightSidebar ? "lg:col-span-8" : "lg:col-span-12",
          middleColumnClassName
        )}
      >
        {backNavigation && <BackNavigation {...backNavigation} />}
        <div
          className={clsx(
            "p-4 border-r border-l",
            backNavigation && "flex-1 overflow-auto "
          )}
        >
          {children}
        </div>
      </div>
      {hasRightSidebar && (
        <div
          className={clsx(
            "hidden lg:block lg:col-span-4 pt-4",
            rightColumnClassName
          )}
        >
          {rightSidebar}
        </div>
      )}
    </div>
  );
};
