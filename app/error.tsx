"use client";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1>Something went wrong</h1>
      <Link href="/feed" className="text-blue-500 hover:underline">
        Go back to home
      </Link>
    </div>
  );
};

export default Error;
