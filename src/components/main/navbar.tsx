'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { LINKS, NAV_LINKS, SOCIALS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen
          ? "py-3 bg-[#030014]/60 backdrop-blur-xl shadow-lg shadow-purple-500/5"
          : "py-5 bg-transparent"
          }`}
      >
        {/* Navbar Container */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
          {/* Logo + Name */}
          <Link
            href="#about-me"
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purple-500/30 group-hover:border-purple-400 transition-colors">
              <Image
                src="/bahan/177117448.png"
                alt="Logo"
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
            <div className="hidden md:flex font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 group-hover:from-white group-hover:to-gray-300 transition-all">
              Hendriansyah Rizky Setiawan
            </div>
          </Link>

          {/* Web Navbar */}
          <div className="hidden md:flex flex-row items-center justify-between">
            <div className="flex items-center justify-between gap-8 border border-white/10 bg-black/40 backdrop-blur-2xl px-8 py-2.5 rounded-full text-gray-200 text-sm font-semibold shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.title}
                  href={link.link}
                  className="cursor-pointer hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300 drop-shadow-md"
                >
                  {link.title}
                </Link>
              ))}

              {/* Source Code */}
              <Link
                href={LINKS.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                className="cursor-pointer hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300 drop-shadow-md"
              >
                Source Code
              </Link>
            </div>
          </div>

          {/* Social Icons (Web) */}
          <div className="hidden md:flex flex-row gap-4 items-center">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                key={name}
                className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
              >
                <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            className="md:hidden text-gray-300 focus:outline-none p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Full Screen Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 w-full bg-[#030014] md:hidden flex flex-col pt-[90px] px-6 overflow-y-auto pb-10"
          >
            {/* Background decorative gradient */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full bg-purple-600/10 blur-[100px] z-0 pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[70%] h-[50%] rounded-full bg-cyan-600/10 blur-[100px] z-0 pointer-events-none" />

            <div className="flex flex-col gap-5 z-10 w-full mt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.link}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xl font-medium text-gray-200 active:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                    <span className="text-purple-400 text-sm opacity-50">&rarr;</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.1 }}
              >
                <Link
                  href={LINKS.sourceCode}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xl font-medium text-white active:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Source Code
                  <span className="text-white text-sm opacity-50">&rarr;</span>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto z-10 w-full pt-10"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-white/10 flex-grow" />
                <span className="text-gray-500 text-sm font-medium">Connect</span>
                <div className="h-px bg-white/10 flex-grow" />
              </div>
              <div className="flex justify-center gap-6 mt-6">
                {SOCIALS.map(({ link, name, icon: Icon }) => (
                  <Link
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    key={name}
                    className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all text-gray-300 hover:text-white"
                  >
                    <Icon className="h-7 w-7" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};