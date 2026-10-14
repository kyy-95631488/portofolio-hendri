import { Globe, Smartphone } from "lucide-react";
import { FaAndroid, FaApple, FaWindows, FaLinux } from "react-icons/fa";
import { Eye } from "lucide-react";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  renderMode?: 'html' | 'markdown' | 'both' | 'none';
  projectType?: 'web' | 'app' | string;
  appPlatform?: 'android' | 'ios' | 'windows' | 'linux' | 'mac' | 'cross-platform' | string;
  onClick?: () => void;
};

export const ProjectCard = ({
  src,
  title,
  projectType,
  appPlatform,
  onClick,
}: ProjectCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card relative overflow-hidden rounded-2xl group flex flex-col h-full w-full text-left cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden w-full bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1f]/40 via-transparent to-transparent z-10 opacity-30 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none" />
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={title}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-white/5 flex items-center justify-center">
            <span className="text-gray-600 text-sm">No image</span>
          </div>
        )}

        {/* View detail overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-black/60 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2.5 flex items-center gap-2 text-white text-sm font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="w-4 h-4 text-purple-400" />
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="relative p-6 flex flex-col flex-grow z-20">
        {/* Platform badge */}
        {projectType && (
          <div className="mb-3 flex items-center">
            <span className="backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-semibold shadow-sm bg-white/5 text-gray-200">
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
            </span>
          </div>
        )}

        <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
          {title}
        </h2>
        <p className="mt-auto pt-3 text-xs text-gray-500 flex items-center gap-1">
          <Eye className="w-3 h-3" /> Click to view full details
        </p>
      </div>

      {/* Glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500 z-0 pointer-events-none" />
    </button>
  );
};
