import React from "react";

interface PageHeaderProps {
  pageTitle: string;
  pageSubTitle: string;
  extraContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  pageTitle,
  pageSubTitle,
  extraContent,
}) => {
  return (
    <div className="py-2 px-5 glass-background rounded sticky top-4 z-10">
      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-y-3">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm">{pageSubTitle}</p>
        </div>
        {extraContent}
      </div>
    </div>
  );
};

export default PageHeader;
