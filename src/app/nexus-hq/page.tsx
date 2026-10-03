"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/lib/firebase/services/PortfolioServices";
import { FolderKanban, ShieldAlert, Activity, Cpu } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    securityStatus: "Secure",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projects = await projectService.getAll();
        setStats((prev) => ({ ...prev, projectsCount: projects.length }));
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Projects",
      value: isLoading ? "-" : stats.projectsCount.toString(),
      icon: <FolderKanban className="h-6 w-6 text-purple-500" />,
      gradient: "from-purple-500/20 to-purple-500/0",
      border: "border-purple-500/20",
    },
    {
      title: "Security Status",
      value: stats.securityStatus,
      icon: <ShieldAlert className="h-6 w-6 text-emerald-500" />,
      gradient: "from-emerald-500/20 to-emerald-500/0",
      border: "border-emerald-500/20",
    },
    {
      title: "System Core",
      value: "Online",
      icon: <Cpu className="h-6 w-6 text-cyan-500" />,
      gradient: "from-cyan-500/20 to-cyan-500/0",
      border: "border-cyan-500/20",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Activity className="h-8 w-8 text-purple-500" />
          Nexus HQ Overview
        </h1>
        <p className="text-gray-400 mt-2">Welcome to your highly secure administrative portal.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-[#0a051e]/80 backdrop-blur-xl p-6 transition-all hover:scale-[1.02] duration-300 group`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                  {isLoading && (
                    <div className="h-6 w-6 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-[#0a051e]/80 backdrop-blur-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <ShieldAlert className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Security Report</h2>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="group flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <div>
                <p className="text-white font-medium">End-to-End Authentication</p>
                <p className="text-sm text-gray-400">Firebase Auth securely manages your sessions.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              Active
            </span>
          </div>
          <div className="group flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <div>
                <p className="text-white font-medium">Anti-Exploit Protection</p>
                <p className="text-sm text-gray-400">Route guards and API rate limits are configured.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
