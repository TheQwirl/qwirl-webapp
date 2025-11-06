import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit3, Share2, Eye } from "lucide-react";

interface QwirlHeaderProps {
  username: string;
}

export function QwirlHeader({ username }: QwirlHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          className="gap-2 flex-1 sm:flex-initial min-w-[120px]"
          size="sm"
          icon={Eye}
          iconPlacement="left"
        >
          <Link href="/qwirls/primary/insights">View Insights</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="gap-2 flex-1 sm:flex-initial"
          size="sm"
          icon={Edit3}
          iconPlacement="left"
        >
          <Link href="/qwirls/primary/edit">Edit</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="gap-2 flex-1 sm:flex-initial"
          size="sm"
          icon={Share2}
          iconPlacement="left"
        >
          <Link href={`/qwirl/${username}`}>Share</Link>
        </Button>
      </div>
    </div>
  );
}
