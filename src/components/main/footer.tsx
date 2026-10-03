import Link from "next/link";

import { FOOTER_DATA } from "@/constants";

export const Footer = () => {
  return (
    <footer className="w-full h-full bg-[#030014]/50 border-t border-white/5 text-gray-200 mt-20 relative z-20">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-12 px-6">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-10 md:gap-5 mb-12">
          {FOOTER_DATA.map((column) => (
            <div
              key={column.title}
              className="w-full md:w-auto flex flex-col items-center md:items-start"
            >
              <h3 className="font-bold text-lg mb-4 text-white">{column.title}</h3>
              <div className="flex flex-col items-center md:items-start gap-3">
                {column.data.map(({ icon: Icon, name, link }) => (
                  <Link
                    key={`${column.title}-${name}`}
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-row items-center text-gray-400 hover:text-purple-400 transition-colors group"
                  >
                    {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    <span className="text-[15px] ml-[10px]">{name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-white/10 mb-6" />

        <div className="text-[14px] text-gray-500 text-center flex flex-col md:flex-row justify-between w-full items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Hendriansyah Rizky Setiawan. All rights reserved.</span>
          <span>Crafted with Next.js & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
};
