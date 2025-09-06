import clsx from "clsx";
import React from "react";

const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={clsx(
        className,
        "min-h-screen sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4"
      )}
    >
      {children}
    </section>
  );
};

export default Wrapper;
