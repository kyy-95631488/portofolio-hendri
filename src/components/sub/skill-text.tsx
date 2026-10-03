"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const SkillText = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center relative z-20">
      <motion.div
        variants={slideInFromTop}
        className="Welcome-box py-[10px] px-[12px] opacity-[0.9]"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[14px] tracking-wide font-medium">
          Technical Arsenal
        </h1>
      </motion.div>

      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-4xl md:text-5xl text-white font-bold mt-[20px] text-center mb-[15px]"
      >
        Mastering modern{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
          technologies.
        </span>
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="text-[18px] text-gray-400 mb-10 mt-[10px] text-center max-w-[600px] font-light"
      >
        Leveraging the best tools in the ecosystem to deliver highly scalable, maintainable, and visually stunning applications.
      </motion.div>
    </div>
  );
};
