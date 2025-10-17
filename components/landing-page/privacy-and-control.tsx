"use client";
import {
  ShieldCheck,
  Users,
  ArrowUpRight,
  Lock,
  Eye,
  Globe,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Wrapper from "./wrapper";

export function PrivacyAndControl() {
  const features = [
    {
      icon: <ShieldCheck className="size-5" />,
      title: "Answer reveals only after you answer",
      description: "No spoilers - see responses only after you participate",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <Users className="size-5" />,
      title: "Block or report rude responders",
      description: "Keep your space safe with built-in moderation tools",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: <ArrowUpRight className="size-5" />,
      title: "Export your Qwirl as a share card",
      description: "Beautiful, shareable cards of your personality insights",
      color: "text-secondary-foreground",
      bgColor: "bg-secondary/20",
    },
  ];

  const visibilityOptions = [
    {
      icon: <Globe className="size-4" />,
      label: "Public",
      desc: "Everyone can see",
      active: false,
    },
    {
      icon: <UserCheck className="size-4" />,
      label: "Friends",
      desc: "Friends only",
      active: true,
    },
    {
      icon: <Lock className="size-4" />,
      label: "Private",
      desc: "Link only",
      active: false,
    },
  ];

  return (
    <Wrapper className="bg-secondary text-secondary-foreground min-h-screen w-screen relative overflow-hidden">
      <div className="relative z-10">
        <div className="mx-auto py-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-6">
                <div>
                  <motion.h3
                    className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    You control the <span className="text-primary">vibe</span>
                  </motion.h3>
                  <motion.p
                    className="mt-4 text-lg text-muted-foreground max-w-prose leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Not every question is for every audience. Choose visibility
                    per Qwirl:{" "}
                    <span className="text-primary font-semibold">public</span>,
                    <span className="text-accent-foreground font-semibold">
                      {" "}
                      friends
                    </span>
                    , or
                    <span className="text-secondary-foreground font-semibold">
                      {" "}
                      link‑only
                    </span>
                    . Hide any poll anytime.
                  </motion.p>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-card text-card-foreground hover:shadow-2xl relative transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    >
                      <div
                        className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/40 to-accent/20 rounded-full blur-xl" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <Card className="relative p-8 bg-card border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                <CardContent className="space-y-6 p-0">
                  {/* Privacy Controls Header */}
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-2xl bg-primary/10">
                        <Eye className="size-8 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-foreground">
                      Privacy Controls
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Choose who can see your Qwirl
                    </p>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="space-y-3">
                    {visibilityOptions.map((option, index) => (
                      <motion.div
                        key={option.label}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                          option.active
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              option.active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {option.icon}
                          </div>
                          <div>
                            <div
                              className={`font-semibold ${
                                option.active
                                  ? "text-primary"
                                  : "text-foreground"
                              }`}
                            >
                              {option.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {option.desc}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            option.active
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {option.active && (
                            <motion.div
                              className="w-full h-full rounded-full bg-primary-foreground scale-50"
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.5 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Feature Badge */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      <ShieldCheck className="size-4 mr-2" />
                      Privacy First Design
                    </Badge>
                  </motion.div>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-lg" />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-secondary/10 to-primary/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
    </Wrapper>
  );
}
