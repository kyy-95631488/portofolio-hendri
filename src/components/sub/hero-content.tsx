"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 mt-32 md:mt-40 w-full z-[20] max-w-7xl mx-auto"
    >
      <div className="h-full w-full flex flex-col gap-6 justify-center m-auto text-center lg:text-start lg:w-1/2">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[10px] px-[12px] opacity-[0.9] mx-auto lg:mx-0"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[14px] tracking-wide font-medium">
            Next-Generation Portfolio
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-4 mt-4 text-5xl sm:text-6xl md:text-7xl font-bold text-white max-w-[650px] w-auto h-auto leading-tight tracking-tight"
        >
          <span>
            Crafting{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              Digital
            </span>{" "}
            <br /> Experiences.
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg md:text-xl text-gray-300 my-4 max-w-[600px] leading-relaxed mx-auto lg:mx-0 font-light"
        >
          I&apos;m a Full Stack Software Engineer specializing in building exceptional digital experiences, combining clean code with stunning aesthetics.
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          className="py-3 px-6 button-primary text-center text-white cursor-pointer rounded-xl max-w-[220px] font-medium tracking-wide mx-auto lg:mx-0"
          href="#projects"
        >
          Explore Projects
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full lg:w-1/2 h-full flex justify-center items-center mt-16 lg:mt-0 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-[100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] m-auto z-0" />
        <Image
          src="/hero-bg.svg"
          alt="hero art"
          height={650}
          width={650}
          draggable={false}
          className="select-none relative z-10 w-[80%] md:w-[100%] drop-shadow-[0_0_40px_rgba(112,66,248,0.2)]"
        />
      </motion.div>
    </motion.div>
  );
};
