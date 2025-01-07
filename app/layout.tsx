import type { Metadata } from "next";
import { Poppins, Rochester } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const rochester = Rochester({
  variable: "--font-rochester",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qwirl",
  description: "You are what you ask.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="overflow-y-auto overflow-x-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-background scrollbar-track-transparent"
    >
      <body
        className={` ${poppins.variable} ${rochester.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
