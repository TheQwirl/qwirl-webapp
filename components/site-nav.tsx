"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function SiteNav() {
  return (
    <header className="fixed left-[50%] top-8 flex w-fit -translate-x-[50%] items-center gap-6 rounded-xl z-30 glass-background border">
      <div className=" mx-auto">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              className=""
              src="/logos/logo-primary-mark-dark-transparent.svg"
              alt="Qwirl Logo"
              height={100}
              width={100}
            />
            {/* <span className="font-black tracking-tight text-lg">Qwirl</span> */}
          </Link>
          {/* <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="hover:text-slate-600" href="#how">
              How it works
            </Link>
            <Link className="hover:text-slate-600" href="#demo">
              Demo
            </Link>
            <Link className="hover:text-slate-600" href="#faq">
              FAQ
            </Link>
          </nav> */}
          <div className="flex-grow min-w-[40px]" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
            <Button className="rounded-2xl" asChild>
              <Link
                href="/question-library"
                className="flex items-center gap-2"
              >
                Create your Qwirl <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
