import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyQwirlState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-6 sm:p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">
              You haven&apos;t created your Qwirl yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">
              Create your first Qwirl to let others discover who you are. Answer
              polls that define your personality, beliefs, and preferences.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2 mt-2 sm:mt-4">
            <Link href="/qwirls/primary/edit">Create Your Qwirl</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
