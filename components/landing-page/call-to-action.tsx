import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-3xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10" />
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Ready to find your wavelength?
                  </h3>
                  <p className="mt-2 text-slate-600 max-w-prose">
                    Create your first Qwirl in minutes and share a single link
                    that actually tells people who you are.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" className="rounded-2xl" asChild>
                    <Link href="/auth" className="flex items-center gap-2">
                      Create your Qwirl <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl"
                    asChild
                  >
                    <Link href="/auth">Sign in</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
