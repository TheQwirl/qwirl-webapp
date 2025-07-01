import Image from "next/image";
import React from "react";

const Loader = ({ description }: { description?: string }) => {
  return (
    <div className="flex flex-col items-center gap-4 justify-center w-full h-full">
      <Image src="/assets/loader.svg" alt="Loading" width={50} height={50} />
      {description && (
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      )}
    </div>
  );
};

export default Loader;
