"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { StarsCanvas } from "@/components/main/star-background-wrapper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithPersistence, user, loading } = useAuth();
  const router = useRouter();

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem("nexus_remember_me") === "true";
      if (isRemembered) {
        const savedEmail = localStorage.getItem("nexus_remembered_email") || "";
        const savedPassEncoded = localStorage.getItem("nexus_remembered_password") || "";
        let savedPass = "";
        try {
          savedPass = decodeURIComponent(atob(savedPassEncoded));
        } catch {
          savedPass = savedPassEncoded;
        }
        if (savedEmail) setEmail(savedEmail);
        if (savedPass) setPassword(savedPass);
        setRememberMe(true);
      }
    } catch (err) {
      console.error("Failed to load remembered credentials", err);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/nexus-hq");
    }
  }, [user, loading, router]);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      try {
        localStorage.removeItem("nexus_remember_me");
        localStorage.removeItem("nexus_remembered_email");
        localStorage.removeItem("nexus_remembered_password");
      } catch (e) {
        console.error("Failed to clear remember me", e);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginWithPersistence(email, password, rememberMe);

      if (rememberMe) {
        try {
          localStorage.setItem("nexus_remember_me", "true");
          localStorage.setItem("nexus_remembered_email", email);
          localStorage.setItem(
            "nexus_remembered_password",
            btoa(encodeURIComponent(password))
          );
        } catch (e) {
          console.error("Failed to save remember me credentials", e);
        }
      } else {
        try {
          localStorage.removeItem("nexus_remember_me");
          localStorage.removeItem("nexus_remembered_email");
          localStorage.removeItem("nexus_remembered_password");
        } catch (e) {
          console.error("Failed to clear remember me credentials", e);
        }
      }

      router.push("/nexus-hq");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password"
        ) {
          setError("Email atau kata sandi tidak valid.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Terlalu banyak percobaan. Silakan coba beberapa saat lagi.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Terjadi kesalahan saat masuk. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-between relative overflow-hidden selection:bg-purple-500/30">
      {/* 3D Rotating Cosmic Stars Background */}
      <StarsCanvas />

      {/* Subtle Ambient Cosmic Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-cyan-500/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-5 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-md text-xs font-medium text-gray-300 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Portfolio</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium tracking-wide text-gray-400">
            Nexus Portal
          </span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full relative"
        >
          {/* Card Wrapper with Outer Glow & Border Highlight */}
          <div className="relative rounded-3xl bg-[#090518]/75 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(112,66,248,0.12)] p-7 sm:p-9 overflow-hidden">
            
            {/* Top edge light reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Brand Monogram & Title */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link
                href="/"
                className="relative mb-4 group inline-block"
                title="Hendriansyah Rizky Setiawan"
              >
                <div className="w-14 h-14 rounded-2xl p-[1px] bg-gradient-to-b from-purple-500/40 via-white/10 to-cyan-500/30 group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-purple-500/10">
                  <div className="w-full h-full rounded-[15px] bg-[#070314] overflow-hidden relative flex items-center justify-center">
                    <Image
                      src="/bahan/177117448.png"
                      alt="Hendriansyah Rizky Setiawan"
                      width={56}
                      height={56}
                      className="object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
                      priority
                    />
                  </div>
                </div>
              </Link>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Nexus HQ
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Admin Panel • Hendriansyah Rizky Setiawan
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs sm:text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Email
                </label>
                <div className="relative flex items-center group">
                  <Mail className="absolute left-3.5 w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="w-full bg-[#030014]/60 border border-white/10 group-hover:border-white/20 focus:border-purple-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Password
                </label>
                <div className="relative flex items-center group">
                  <Lock className="absolute left-3.5 w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#030014]/60 border border-white/10 group-hover:border-white/20 focus:border-purple-500 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 p-1 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => handleRememberMeChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.04] peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-cyan-500 peer-checked:border-transparent flex items-center justify-center transition-all">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    Ingat saya di perangkat ini
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 py-3.5 px-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Nexus HQ</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-5 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Hendriansyah Rizky Setiawan. All rights reserved.</p>
      </footer>
    </div>
  );
}


