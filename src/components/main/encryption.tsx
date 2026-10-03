"use client";

import { motion } from "framer-motion";
import { ServerStackIcon, ShieldCheckIcon, BoltIcon } from "@heroicons/react/24/outline";

import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";

export const Encryption = () => {
  return (
    <section className="flex flex-col relative items-center justify-center min-h-screen w-full h-full py-20">
      <div className="absolute top-0 z-[5] w-full text-center">
        <motion.div
          variants={slideInFromTop}
          className="text-4xl md:text-5xl font-bold text-gray-200"
        >
          Performance{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            &
          </span>{" "}
          Architecture.
        </motion.div>
        <motion.p
          variants={slideInFromTop}
          className="mt-4 text-gray-400 max-w-[600px] mx-auto text-lg px-4"
        >
          Built with modern technologies to ensure scalable, secure, and lightning-fast applications.
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 z-[20] w-full max-w-5xl px-6 mt-20">
        
        <motion.div variants={slideInFromLeft(0.5)} className="p-8 flex flex-col items-center text-center max-w-[300px]">
          <div className="w-16 h-16 flex items-center justify-center mb-6">
            <BoltIcon className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
          <p className="text-gray-400 text-sm">Optimized loading times and seamless transitions for the best user experience.</p>
        </motion.div>

        <motion.div variants={slideInFromTop} className="p-8 flex flex-col items-center text-center max-w-[300px] transform md:-translate-y-10">
          <div className="w-20 h-20 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <ShieldCheckIcon className="w-12 h-12 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Highly Secure</h3>
          <p className="text-gray-400 text-sm">Implementing best practices in security and data protection for all applications.</p>
        </motion.div>

        <motion.div variants={slideInFromRight(0.5)} className="p-8 flex flex-col items-center text-center max-w-[300px]">
          <div className="w-16 h-16 flex items-center justify-center mb-6">
            <ServerStackIcon className="w-12 h-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Scalable</h3>
          <p className="text-gray-400 text-sm">Robust architecture designed to grow seamlessly alongside your business needs.</p>
        </motion.div>

      </div>

      <div className="absolute z-[20] bottom-10 px-5">
        <div className="cursive text-[20px] font-medium text-center text-gray-300">
          Secure your data with end-to-end encryption.
        </div>
      </div>

      <div className="w-full flex items-center justify-center absolute inset-0 z-[-10]">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          style={{
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 60%)",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 60%)"
          }}
        >
          <source src="/videos/encryption-bg.vid" type="video/webm" />
        </video>
      </div>
    </section>
  );
};
