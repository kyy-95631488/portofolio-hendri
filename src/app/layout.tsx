import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";

import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden text-gray-200 selection:bg-purple-500/30",
          outfit.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
