"use client";
import { GrGoogle } from "react-icons/gr";
export function GoogleAuthBtn() {
  const handleGoogleSignIn = () => {
    // Your Google sign-in logic goes here
    console.log("Google sign-in clicked!");
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg "
    >
      <GrGoogle size={24} className="mr-3" />
      <span className="text-gray-700 font-medium">Continue with Google</span>
    </button>
  );
}

export default GoogleAuthBtn;
