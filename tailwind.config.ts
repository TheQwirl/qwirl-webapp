import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Gradients
        "apricot-sunrise":
          "linear-gradient(135deg, hsla(21, 100%, 85%, 1), hsla(12, 100%, 82%, 1))",
        "sunset-glow":
          "linear-gradient(135deg, hsla(12, 100%, 82%, 1), hsla(358, 60%, 75%, 1), hsla(348, 25%, 61%, 1))",
        "warm-blush":
          "linear-gradient(135deg, hsla(21, 100%, 85%, 1), hsla(358, 60%, 75%, 1), hsla(348, 25%, 61%, 1))",
        "vibrant-peach":
          "linear-gradient(135deg, hsla(21, 100%, 85%, 1), hsla(12, 100%, 82%, 1), hsla(263, 6%, 43%, 1))",
        "rose-flame":
          "linear-gradient(135deg, hsla(358, 60%, 75%, 1), hsla(348, 25%, 61%, 1), hsla(12, 100%, 82%, 1))",
        "dim-glow":
          "linear-gradient(135deg, hsla(263, 6%, 43%, 1), hsla(348, 25%, 61%, 1), hsla(21, 100%, 85%, 1))",
        "peachy-horizon":
          "linear-gradient(135deg, hsla(21, 100%, 85%, 1), hsla(358, 60%, 75%, 1), hsla(12, 100%, 82%, 1))",
      },
      animation: {
        blob: "blob 4s infinite",
        gradient: "gradient 15s ease infinite",
        shine: "shine 3s ease-out infinite",
        "gradient-flow":
          "gradientFlow 10s ease 0s infinite normal none running",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        gradient: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        shine: {
          "0%": { backgroundPosition: "200% 0" },
          "25%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        gradientFlow: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        rochester: ["Rochester", "cursive"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
