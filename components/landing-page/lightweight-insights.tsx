"use client";
import { LineChart, Users, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import Wrapper from "./wrapper";

export function LightweightInsights() {
  return (
    <Wrapper className="bg-slate-50 border-y">
      <section className=" ">
        <div className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Results, not dashboards
              </h3>
              <p className="mt-3 text-slate-600 max-w-prose">
                Qwirl shows only the stats that matter: answer distributions and
                how you compare. No overwhelming charts—just clarity.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <LineChart className="size-4" /> Per‑poll distribution bars.
                </li>
                <li className="flex items-center gap-2">
                  <Users className="size-4" /> See what friends chose after you
                  answer.
                </li>
                <li className="flex items-center gap-2">
                  <Share2 className="size-4" /> Share your wavelength public
                  link.
                </li>
              </ul>
            </div>
            <Card className="rounded-3xl lg:justify-self-end w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-lg">Example results</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple distribution mock */}
                <div className="grid gap-4">
                  {[
                    {
                      q: "Pineapple on pizza?",
                      you: "Always",
                      dist: [46, 22, 28, 4],
                    },
                    {
                      q: "Free speech should be…",
                      you: "Broad with limits",
                      dist: [18, 57, 20, 5],
                    },
                  ].map((row, i) => (
                    <div key={i} className="p-3 border rounded-xl">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{row.q}</span>
                        <Badge>Your answer: {row.you}</Badge>
                      </div>
                      <div className="mt-2 space-y-2">
                        {row.dist.map((pct, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-20 text-xs text-slate-500">
                              Option {idx + 1}
                            </div>
                            <Progress value={pct} className="h-2" />
                            <div className="w-10 text-xs text-right">
                              {pct}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
