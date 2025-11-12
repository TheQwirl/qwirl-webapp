import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import QwirlStatsSummaryCard from "@/components/qwirl/qwirl-stats-summary-card";

export function QuickStatsCard() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="text-base font-semibold mb-3">Quick Stats</h3>
        <QwirlStatsSummaryCard />
      </CardContent>
    </Card>
  );
}
