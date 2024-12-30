import SignInForm from "@/components/forms/sign-in-form";
import GoogleAuthBtn from "@/components/google-auth-btn";
import { Separator } from "@/components/ui/separator";
import React from "react";

const SignIn = () => {
  return (
    <main className="min-h-screen relative bg-background overflow-hidden grid grid-cols-2">
      <div className="absolute -bottom-10 -right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob" />
      <div className="relative hidden lg:block lg:col-span-1 bg-primary rounded-r-2xl"></div>
      <div className="flex flex-col p-4 md:p-10 justify-center items-center col-span-full lg:col-span-1 relative">
        <div className="relative w-full">
          <div className="absolute inset-0.5 bg-primary rounded-2xl blur animate-pulse"></div>
          <div className="bg-white shadow rounded-2xl p-10 w-full relative">
            <h1 className="text-5xl font-bold text-center">Login</h1>
            <div className=" text-gray-400 text-center">
              To find yourself and others like you.
            </div>
            <div className="mt-6 ">
              <GoogleAuthBtn />
              <Separator className="my-4" />
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
