"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/sub/project-card";
import { projectService, Project } from "@/lib/firebase/services/PortfolioServices";
import { FolderGit2 } from "lucide-react";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center py-20 relative z-20"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Featured{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Works
          </span>
        </h1>
        <p className="text-gray-400 max-w-[600px] text-lg font-light">
          A selection of my recent projects, showcasing my expertise in building full-stack applications with modern tools.
        </p>
      </div>
      
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-white/5 border border-white/10 rounded-3xl text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full" />
            
            <div className="bg-purple-500/10 p-5 rounded-full mb-5 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative z-10">
              <FolderGit2 className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Works in Progress</h3>
            <p className="text-gray-400 max-w-md relative z-10">
              The showcase is currently being curated. Amazing new projects will be deployed and displayed here very soon!
            </p>
          </div>
        ) : (
          projects.map((project, idx) => (
            <ProjectCard
              key={project.title + idx}
              src={project.imageUrl}
              title={project.title}
              description={project.description}
              link={project.link || "#"}
              renderMode={project.renderMode}
              projectType={project.projectType}
              appPlatform={project.appPlatform}
            />
          ))
        )}
      </div>
    </section>
  );
};
