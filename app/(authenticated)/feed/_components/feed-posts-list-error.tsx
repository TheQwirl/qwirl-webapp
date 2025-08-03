"use client";
import React from "react";

const FeedPostsListError = () => {
  return (
    <div className="min-h-[200px] flex flex-col justify-center items-center">
      <p className="text-red-500 mb-4">
        Something went wrong while loading the feed.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
};

export default FeedPostsListError;
