import Image from "next/image";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Globe, Smartphone } from "lucide-react";
import { FaAndroid, FaApple, FaWindows, FaLinux } from "react-icons/fa";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  renderMode?: 'html' | 'markdown' | 'both' | 'none';
  projectType?: 'web' | 'app' | string;
  appPlatform?: 'android' | 'ios' | 'windows' | 'linux' | 'mac' | 'cross-platform' | string;
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
  renderMode = 'both',
  projectType,
  appPlatform,
}: ProjectCardProps) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className="glass-card relative overflow-hidden rounded-2xl group flex flex-col h-full"
    >
      <div className="relative overflow-hidden w-full aspect-video">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1f] to-transparent z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-30" />
        <Image
          src={src}
          alt={title}
          width={1000}
          height={1000}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full backdrop-blur-md opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 border border-white/10">
          <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
        </div>
        {projectType && (
          <div className="absolute top-4 left-4 z-20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-semibold shadow-lg bg-black/40 text-white">
            {projectType === 'web' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Web</span>
              </>
            ) : projectType === 'app' ? (
              <>
                {appPlatform === 'android' ? <FaAndroid className="w-3.5 h-3.5 text-emerald-400" /> :
                 appPlatform === 'ios' ? <FaApple className="w-3.5 h-3.5 text-gray-300" /> :
                 appPlatform === 'windows' ? <FaWindows className="w-3.5 h-3.5 text-blue-400" /> :
                 appPlatform === 'linux' ? <FaLinux className="w-3.5 h-3.5 text-yellow-400" /> :
                 appPlatform === 'mac' ? <FaApple className="w-3.5 h-3.5 text-gray-300" /> :
                 <Smartphone className="w-3.5 h-3.5 text-purple-400" />}
                <span className="capitalize">{appPlatform === 'ios' ? 'iOS' : appPlatform === 'mac' ? 'macOS' : appPlatform === 'cross-platform' ? 'Cross Platform' : appPlatform || 'App'}</span>
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="relative p-6 flex flex-col flex-grow z-20">
        <h1 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
          {title}
        </h1>
        <div className="mt-3 text-gray-400 font-light leading-relaxed line-clamp-3 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-cyan-400">
          {renderMode === 'none' ? (
            <span className="whitespace-pre-wrap">{description}</span>
          ) : renderMode === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <ReactMarkdown 
              remarkPlugins={renderMode === 'both' || renderMode === 'markdown' ? [remarkGfm] : []} 
              rehypePlugins={renderMode === 'both' ? [rehypeRaw] : []}
            >
              {description}
            </ReactMarkdown>
          )}
        </div>
      </div>
      
      {/* Decorative gradient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500 z-0" />
    </Link>
  );
};
