"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Globe,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { FaAndroid, FaApple, FaWindows, FaLinux } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Project } from "@/lib/firebase/services/PortfolioServices";

type ProjectDetailModalProps = {
  project: Project | null;
  onClose: () => void;
};

function PlatformBadge({
  projectType,
  appPlatform,
}: {
  projectType?: string;
  appPlatform?: string;
}) {
  if (projectType === "web") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
        <Globe className="w-3.5 h-3.5" /> Web App
      </span>
    );
  }
  if (projectType === "app") {
    const platform = appPlatform || "cross-platform";
    const configs: Record<
      string,
      { label: string; color: string; icon: React.ReactNode }
    > = {
      android: {
        label: "Android",
        color: "text-emerald-400",
        icon: <FaAndroid className="w-3.5 h-3.5" />,
      },
      ios: {
        label: "iOS",
        color: "text-gray-300",
        icon: <FaApple className="w-3.5 h-3.5" />,
      },
      windows: {
        label: "Windows",
        color: "text-blue-400",
        icon: <FaWindows className="w-3.5 h-3.5" />,
      },
      linux: {
        label: "Linux",
        color: "text-yellow-400",
        icon: <FaLinux className="w-3.5 h-3.5" />,
      },
      mac: {
        label: "macOS",
        color: "text-gray-300",
        icon: <FaApple className="w-3.5 h-3.5" />,
      },
      "cross-platform": {
        label: "Cross Platform",
        color: "text-purple-400",
        icon: <Smartphone className="w-3.5 h-3.5" />,
      },
    };
    const cfg = configs[platform] || configs["cross-platform"];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold ${cfg.color}`}
      >
        {cfg.icon} {cfg.label}
      </span>
    );
  }
  return null;
}

function DescriptionRenderer({
  description,
  renderMode,
}: {
  description: string;
  renderMode?: string;
}) {
  if (!renderMode || renderMode === "none") {
    return <span className="whitespace-pre-wrap">{description}</span>;
  }
  if (renderMode === "html") {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={renderMode === "both" ? [rehypeRaw] : []}
    >
      {description}
    </ReactMarkdown>
  );
}

export const ProjectDetailModal = ({
  project,
  onClose,
}: ProjectDetailModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [project]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!mounted) return null;

  const allImages = project
    ? [project.imageUrl, ...(project.images || [])].filter(Boolean)
    : [];
  const currentImage = allImages[activeImageIdx] || "";

  const modal = (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 32 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl flex flex-col
              bg-gradient-to-b from-[#0d0820] to-[#08051a]
              ring-1 ring-white/10
              shadow-[0_0_80px_rgba(112,66,248,0.25),0_40px_120px_rgba(0,0,0,0.6)]"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent z-10" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white p-2 rounded-full transition-all duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* ---- Image gallery ---- */}
              <div className="relative w-full">
                <div className="relative w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                    {currentImage ? (
                      /* Use plain <img> to avoid Next.js /_next/image proxy
                         which IDM intercepts as a download */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentImage}
                        alt={project.title}
                        className="w-full h-auto block"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center bg-white/5">
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Subtle bottom gradient — only for dot legibility */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                  {/* Prev / Next arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIdx((i) =>
                            i === 0 ? allImages.length - 1 : i - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 border border-white/10 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIdx((i) =>
                            i === allImages.length - 1 ? 0 : i + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 border border-white/10 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIdx(i)}
                            className={`rounded-full transition-all duration-300 ${
                              i === activeImageIdx
                                ? "w-6 h-2 bg-purple-400"
                                : "w-2 h-2 bg-white/30 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 px-5 py-3 bg-black/30 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          i === activeImageIdx
                            ? "border-purple-500 opacity-100"
                            : "border-white/10 opacity-50 hover:opacity-80"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`View ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ---- Content ---- */}
              <div className="px-6 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8 space-y-5">

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Platform badge */}
                    {project.projectType && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        <PlatformBadge
                          projectType={project.projectType}
                          appPlatform={project.appPlatform}
                        />
                      </div>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {project.title}
                    </h2>
                  </div>

                  {/* Live link */}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Tech Stack
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-colors cursor-default"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {project.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-500 to-cyan-500" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        About this project
                      </span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-cyan-400 prose-headings:text-white prose-strong:text-white prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:rounded text-gray-300 leading-relaxed">
                      <DescriptionRenderer
                        description={project.description}
                        renderMode={project.renderMode}
                      />
                    </div>
                  </div>
                )}

                <div className="h-2" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};
