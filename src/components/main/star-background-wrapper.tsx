"use client";
import dynamic from "next/dynamic";

export const StarsCanvas = dynamic(
  () => import("./star-background").then((mod) => mod.StarsCanvas),
  { ssr: false }
);
