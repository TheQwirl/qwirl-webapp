// components/ComingSoon.tsx
import { FC } from "react";
import { FaBeerMugEmpty } from "react-icons/fa6";
const ComingSoon: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center space-y-4">
      <FaBeerMugEmpty className="text-8xl text-gray-500 animate-in" />
      <h1 className="text-2xl font-bold text-gray-800">Coming Soon</h1>
      <p className="text-gray-600">
        We&apos;re working hard to bring this feature to you. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
