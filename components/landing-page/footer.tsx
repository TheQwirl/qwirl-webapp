"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-6 rounded-t-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">Qwirl</h3>
            <p className="text-secondary-foreground/70">
              Discover yourself through the eyes of others. Connect, share, and
              grow together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-secondary-foreground hover:text-secondary-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-secondary-foreground">
              Subscribe to our newsletter
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white"
              />
              <Button className="bg-[#B4E7E6] text-black hover:bg-[#9CD5D4]">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        <Separator className="bg-white/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-secondary-foreground text-sm">
            © {new Date().getFullYear()} Qwirl. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-secondary-foreground hover:text-secondary-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-secondary-foreground hover:text-secondary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="#"
              className="text-secondary-foreground hover:text-secondary-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
