import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <div className="h-full px-20 py-20 w-full flex items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/assets/error-user.svg"
          alt="error user"
          width={200}
          height={200}
        />
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
        <p className="text-gray-500">
          The user you are looking for does not exist or has been deleted.
        </p>
        <a href="/feed" className="mt-4 text-blue-500 hover:underline">
          Go back to feed
        </a>
      </div>
    </div>
  );
};

export default NotFound;
