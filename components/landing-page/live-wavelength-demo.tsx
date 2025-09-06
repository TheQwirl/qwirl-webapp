"use client";
import { useState } from "react";
import { LineChart, MessageSquare, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Wrapper from "./wrapper";
import { UserAvatar } from "../user-avatar";
import { WavelengthBlob } from "../ui/wavelength-blob";

export function LiveWavelengthDemo() {
  const [value, setValue] = useState(68);

  return (
    <Wrapper className="h-screen border-y w-screen bg-slate-50">
      <div id="demo" className="  ">
        <div className="mx-auto py-20  max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Your wavelength with anyone
              </h3>
              <p className="mt-3 text-slate-600 max-w-prose">
                When two people complete a Qwirl, we compute a simple similarity
                score from their poll choices. No overthinking—just a quick read
                on vibe alignment.
              </p>

              <div className="mt-6">
                <Label htmlFor="match" className="text-sm">
                  Try it:
                </Label>
                <input
                  id="match"
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                  className="w-full "
                />
                <p className="mt-2 text-sm text-slate-600">
                  Move the slider to preview how the wavelength ring and copy
                  change.
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <LineChart className="size-4" /> Weighted by question
                  importance (optional per poll).
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="size-4" /> Answer reveals are
                  immediate per poll, keeping it fun.
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="size-4" /> Designed for
                  serendipity, not judgment.
                </li>
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:justify-self-end relative"
            >
              <div className="absolute blur-3xl -z-10 top-0 left-0 w-full h-full bg-gradient-to-t from-primary/30 to-primary/80 rounded-full" />
              <Card className="rounded-3xl w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Wavelength
                    <Badge variant={value >= 70 ? "default" : "secondary"}>
                      {" "}
                      {value}% match
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-5">
                    <UserAvatar
                      image="https://avatar.iran.liara.run/public/boy?username=Luna"
                      ringed
                      size={"lg"}
                    />
                    <WavelengthBlob percent={value} />
                    <UserAvatar
                      image="https://avatar.iran.liara.run/public/girl?username=Zoe"
                      ringed
                      size={"lg"}
                    />
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    <strong className="font-semibold">{value}%</strong> suggests
                    you share many instincts. Swap Qwirls to see exactly where
                    you match—and where you pleasantly disagree.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button className="rounded-xl flex-1" asChild>
                      <Link href="/create">Build your Qwirl</Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl" asChild>
                      <Link href="/signin">Sign in</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
