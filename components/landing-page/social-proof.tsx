"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import Wrapper from "./wrapper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserAvatar } from "../user-avatar";
export default function SocialProof() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const testimonials = [
    {
      name: "Alex Rivera",
      handle: "@alex_r",
      quote:
        "We matched at 82% and immediately had a killer conversation about the 18%. It's like a shortcut to meaningful connection.",
      image: "https://avatar.iran.liara.run/public/girl?username=Alex",
    },
    {
      name: "Ben Carter",
      handle: "@bencarter",
      quote:
        "Way faster than scrolling through profiles. Qwirl is like an introvert's cheat code for finding their people.",
      image: "https://avatar.iran.liara.run/public/boy?username=Ben",
    },
    {
      name: "Casey Morgan",
      handle: "@casey_m",
      quote:
        "The answer reveals after each poll keep it addictive without feeling like a test. I've discovered so much about my friends!",
      image: "https://avatar.iran.liara.run/public/girl?username=Casey",
    },
    {
      name: "Dana Scully",
      handle: "@dscully",
      quote:
        "I love that I can control who sees my Qwirl. It feels private and safe, which is rare on social media these days.",
      image: "https://avatar.iran.liara.run/public/girl?username=Dana",
    },
    {
      name: "Eli Vance",
      handle: "@evance",
      quote:
        "It's not just about agreement. Seeing where you differ is just as interesting. The 'wavelength' score is genius.",
      image: "https://avatar.iran.liara.run/public/boy?username=Eli",
    },
  ];

  return (
    <Wrapper className="bg-primary text-primary-foreground border-y">
      <div className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <motion.h3
                className="text-4xl sm:text-5xl font-black tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                What early users say
              </motion.h3>
              <motion.p
                className="mt-4 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Real testimonials from our private beta testers.
              </motion.p>
            </div>
            <motion.div
              className="hidden lg:flex gap-4 mt-6 lg:mt-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={scrollNext}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                <ChevronRight />
              </button>
            </motion.div>
          </div>

          <motion.div
            className="overflow-hidden mt-12"
            ref={emblaRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex -ml-4">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"
                >
                  <Card className="rounded-3xl h-full backdrop-blur-md border shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <UserAvatar name={t.name} image={t.image} ringed />
                        <div>
                          <div className="font-bold text-foreground">
                            {t.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t.handle}
                          </div>
                        </div>
                      </div>
                      <p className="mt-5 text-base text-foreground/90 leading-relaxed">
                        “{t.quote}”
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex lg:hidden justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
