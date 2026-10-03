import type { PropsWithChildren } from "react";
import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background-wrapper";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <StarsCanvas />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
