"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SiteNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/question-library", label: "Library" },
    { href: "/discover", label: "Discover" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;

    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isMobile = useIsMobile();

  return (
    <header className="fixed left-[50%] top-4 sm:top-8 flex w-fit -translate-x-[50%] items-center gap-6 rounded-xl z-30 glass-background border">
      <div className="mx-auto">
        <div className="mx-auto sm:max-w-4xl px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            {isMobile ? (
              <Image
                className="min-w-[30px] h-auto object-contain"
                src="/logos/logo-icon-dark-transparent.svg"
                alt="Qwirl Logo"
                height={100}
                width={100}
              />
            ) : (
              <Image
                className="min-w-[75px] md:min-w-[100px] h-auto object-contain"
                src="/logos/logo-primary-mark-dark-transparent.svg"
                alt="Qwirl Logo"
                height={100}
                width={100}
              />
            )}
            {/* <span className="font-black tracking-tight text-lg">Qwirl</span> */}
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6 text-xs md:text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-primary",
                  isActive(item.href) &&
                    "text-primary underline underline-offset-4 decoration-2 decoration-primary"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button size={"sm"} asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
