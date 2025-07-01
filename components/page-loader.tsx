import Image from "next/image";
import React from "react";

const PageLoader = ({ description }: { description?: string }) => {
  return (
    <div className="flex items-center gap-4 justify-center w-screen h-screen">
      <Image src="/assets/loader.svg" alt="Loading" width={50} height={50} />
      {description && (
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      )}
    </div>
  );
};

export default PageLoader;
