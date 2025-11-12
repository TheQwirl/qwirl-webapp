"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Twitter, Instagram, Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-6 rounded-t-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Image
              src="/logos/logo-primary-mark-light-transparent.svg"
              alt="Qwirl Logo"
              height={100}
              width={100}
            />
            <p className="text-primary-foreground/70">
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
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
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
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-primary-foreground hover:text-primary-foreground transition-colors"
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
            <p className="text-primary-foreground">
              Subscribe to our newsletter
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className=" bg-white" />
              <Button className="" variant={"ghost"}>
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        <Separator className="bg-white/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-primary-foreground text-sm">
            © {new Date().getFullYear()} Qwirl. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-primary-foreground hover:text-primary-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-primary-foreground hover:text-primary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="#"
              className="text-primary-foreground hover:text-primary-foreground transition-colors"
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
