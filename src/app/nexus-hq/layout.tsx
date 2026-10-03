"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, LogOut, Loader2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user && pathname !== "/nexus-hq/login") {
      router.push("/nexus-hq/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user && pathname === "/nexus-hq/login") {
    return <>{children}</>;
  }

  if (!user) {
    return null; // Will redirect
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/nexus-hq",
    },
    {
      title: "Projects",
      icon: <FolderKanban className="h-5 w-5" />,
      href: "/nexus-hq/projects",
    },
  ];

  return (
    <div className="flex h-screen bg-[#030014] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a051e] flex-col hidden md:flex z-30">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 outline-none focus:outline-none focus-visible:outline-none [WebkitTapHighlightColor:transparent]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              Admin
            </span>
            Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none [WebkitTapHighlightColor:transparent]",
                pathname === item.href
                  ? "bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full outline-none [WebkitTapHighlightColor:transparent]"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0a051e] ring-1 ring-white/10 z-50 flex flex-col md:hidden shadow-2xl outline-none transform-gpu"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 outline-none focus:outline-none focus-visible:outline-none [WebkitTapHighlightColor:transparent]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                    Admin
                  </span>
                  Panel
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none [WebkitTapHighlightColor:transparent]",
                      pathname === item.href
                        ? "bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[80px] mix-blend-screen opacity-30" />
          
          {/* Subtle Grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" style={{ backgroundSize: '30px' }} />
        </div>

        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-white/10 bg-[#0a051e]/60 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden rounded-lg hover:bg-white/5 transition-colors outline-none [WebkitTapHighlightColor:transparent]"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center hidden sm:flex">
              {menuItems.find((m) => m.href === pathname)?.icon || <LayoutDashboard className="h-4 w-4 text-purple-400" />}
            </div>
            <h2 className="text-xl font-semibold text-gray-200">
              {menuItems.find((m) => m.href === pathname)?.title || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium text-gray-300 bg-white/5 px-3 sm:px-4 py-1.5 rounded-full border border-white/5 shadow-inner max-w-[150px] sm:max-w-none">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">{user.email}</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 z-10 relative custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
