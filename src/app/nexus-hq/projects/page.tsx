"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { projectService, Project } from "@/lib/firebase/services/PortfolioServices";
import { Plus, Edit2, Trash2, X, Loader2, Save, FolderKanban, Image as ImageIcon, ChevronDown, AlertCircle, CheckCircle, Info, Globe, Smartphone } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FaAndroid, FaApple, FaWindows, FaLinux } from "react-icons/fa";

type ProjectWithId = Project & { id: string };

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | 'main' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveFolders, setDriveFolders] = useState<{id: string, name: string}[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [descMode, setDescMode] = useState<'write' | 'preview'>('write');
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  const showNotification = (message: string, type: "error" | "success" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    setMounted(true);
    fetchProjects();
  }, []);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditing]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectService.delete(id);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if ((currentProject as ProjectWithId).id) {
        const { id, ...data } = currentProject as ProjectWithId;
        await projectService.update(id, data);
      } else {
        await projectService.add({
          ...currentProject,
          tags: currentProject.tags || [],
          createdAt: currentProject.createdAt || new Date().toISOString(),
        } as Project);
      }
      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectDrive = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveToken(credential.accessToken);
        
        const res = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)", {
          headers: {
            Authorization: `Bearer ${credential.accessToken}`
          }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error?.message || "Failed to fetch folders from Google Drive API");
        }

        if (data.files) {
          if (data.files.length === 0) {
            showNotification("No folders found in your Google Drive.", "error");
          } else {
            showNotification("Successfully connected to Google Drive!", "success");
          }
          setDriveFolders(data.files);
          if (data.files.length > 0) {
            setSelectedFolder(data.files[0].id);
          }
        } else {
          showNotification("Unexpected response from Google Drive.", "error");
        }
      }
    } catch (error: any) {
      console.error(error);
      showNotification(`Google Drive Error: ${error.message} (Tip: Ensure API is enabled)`, "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!driveToken || !selectedFolder) {
      showNotification("Please connect to Google Drive and select a folder first.", "error");
      return;
    }

    setUploadingImageIndex(index !== undefined ? index : 'main');
    try {
      const metadata = {
        name: file.name,
        parents: [selectedFolder],
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${driveToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message || "Failed to upload to Google Drive");

      const fileId = data.id;

      // Make file public
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${driveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });

      const rawImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      const imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(rawImageUrl)}&output=webp`;

      if (index !== undefined) {
        const newImages = [...(currentProject.images || [])];
        newImages[index] = imageUrl;
        setCurrentProject({ ...currentProject, images: newImages });
      } else {
        setCurrentProject({ ...currentProject, imageUrl });
      }

      showNotification("Image successfully uploaded to Google Drive!", "success");
    } catch (error: any) {
      showNotification("Upload Error: " + error.message, "error");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const openEditor = (project?: ProjectWithId) => {
    setCurrentProject(project || { title: "", description: "", imageUrl: "", images: [], link: "", tags: [], renderMode: "both", projectType: "web", appPlatform: "android" });
    setIsEditing(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a051e]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-purple-500" />
            Manage Projects
          </h1>
          <p className="text-gray-400 mt-1">Add, update, or remove your portfolio projects securely.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openEditor()}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Project
        </motion.button>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-[#0a051e] ring-1 ring-white/10 text-left shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all sm:my-8 p-6 sm:p-8 outline-none transform-gpu"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                  <button
                    onClick={() => setIsEditing(false)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2 pr-10">
                    {(currentProject as ProjectWithId).id ? <Edit2 className="text-purple-500" /> : <Plus className="text-cyan-500" />}
                    {(currentProject as ProjectWithId).id ? "Edit Project" : "Add New Project"}
                  </h2>
                  <form onSubmit={handleSave} className="flex flex-col max-h-[75vh]">
                    <div className="flex-1 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Info & Details (span 7) */}
                        <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Title</label>
                        <input
                          required
                          value={currentProject.title || ""}
                          onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                          placeholder="e.g. E-Commerce Platform"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Live Link (Optional)</label>
                        <input
                          value={currentProject.link || ""}
                          onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Type</label>
                        <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 w-max">
                          <button
                            type="button"
                            onClick={() => setCurrentProject({ ...currentProject, projectType: 'web' })}
                            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                              (currentProject.projectType || 'web') === 'web' 
                                ? 'bg-purple-500/20 text-purple-300 shadow-sm' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Globe className="h-4 w-4" /> Web
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentProject({ ...currentProject, projectType: 'app' })}
                            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                              currentProject.projectType === 'app' 
                                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Smartphone className="h-4 w-4" /> App
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tags (comma separated)</label>
                        <input
                          value={currentProject.tags?.join(", ") || ""}
                          onChange={(e) =>
                            setCurrentProject({
                              ...currentProject,
                              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                          placeholder="Next.js, Tailwind, Firebase"
                        />
                      </div>
                    </div>
                    <AnimatePresence>
                      {currentProject.projectType === 'app' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 pt-1 pb-2">
                            <label className="text-sm font-medium text-gray-300">App Platform</label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: 'android', label: 'Android', icon: FaAndroid },
                                { id: 'ios', label: 'iOS', icon: FaApple },
                                { id: 'windows', label: 'Windows', icon: FaWindows },
                                { id: 'linux', label: 'Linux', icon: FaLinux },
                                { id: 'mac', label: 'macOS', icon: FaApple },
                                { id: 'cross-platform', label: 'Cross Platform', icon: Smartphone }
                              ].map((plat) => {
                                const Icon = plat.icon;
                                return (
                                  <button
                                    key={plat.id}
                                    type="button"
                                    onClick={() => setCurrentProject({ ...currentProject, appPlatform: plat.id as any })}
                                    className={`px-4 py-2 text-xs font-medium rounded-xl transition-all border flex items-center gap-2 ${
                                      (currentProject.appPlatform || 'android') === plat.id 
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    {plat.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description Render Mode</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'both', label: 'Markdown + HTML' },
                            { id: 'markdown', label: 'Markdown Only' },
                            { id: 'html', label: 'HTML Only' },
                            { id: 'none', label: 'Plain Text' }
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setCurrentProject({ ...currentProject, renderMode: mode.id as any })}
                              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all border ${
                                (currentProject.renderMode || 'both') === mode.id 
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300">Description</label>
                          <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setDescMode('write')}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${descMode === 'write' ? 'bg-purple-500/20 text-purple-300 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                              Write
                            </button>
                            <button
                              type="button"
                              onClick={() => setDescMode('preview')}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${descMode === 'preview' ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                        
                        {descMode === 'write' ? (
                          <textarea
                            required
                            rows={6}
                            value={currentProject.description || ""}
                            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none font-mono text-sm"
                            placeholder="Describe your project..."
                          />
                        ) : (
                          <div className="w-full min-h-[160px] max-h-[300px] overflow-y-auto bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-300 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-cyan-400 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {!currentProject.description ? (
                              <span className="text-gray-500 italic">Preview will appear here...</span>
                            ) : (currentProject.renderMode || 'both') === 'none' ? (
                              <span className="whitespace-pre-wrap">{currentProject.description}</span>
                            ) : (currentProject.renderMode || 'both') === 'html' ? (
                              <div dangerouslySetInnerHTML={{ __html: currentProject.description }} />
                            ) : (
                              <ReactMarkdown 
                                remarkPlugins={(currentProject.renderMode || 'both') === 'both' || (currentProject.renderMode || 'both') === 'markdown' ? [remarkGfm] : []} 
                                rehypePlugins={(currentProject.renderMode || 'both') === 'both' ? [rehypeRaw] : []}
                              >
                                {currentProject.description}
                              </ReactMarkdown>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                                            </div>

                        {/* RIGHT COLUMN: Media & Assets (span 5) */}
                        <div className="lg:col-span-5 space-y-6">
<div className="space-y-4 border border-white/10 p-4 rounded-xl bg-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">Google Drive Integration</label>
                        {!driveToken ? (
                          <button
                            type="button"
                            onClick={handleConnectDrive}
                            className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/30 transition-colors"
                          >
                            Connect Drive
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            Connected
                          </span>
                        )}
                      </div>
                      
                      {driveToken && (
                        <div className="space-y-2 relative">
                          <label className="text-xs font-medium text-gray-400">Select Upload Folder</label>
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none hover:bg-white/5 transition-all"
                          >
                            <span className="truncate flex items-center gap-2">
                              <FolderKanban className="h-4 w-4 text-purple-400" />
                              {selectedFolder ? driveFolders.find(f => f.id === selectedFolder)?.name : "Select a folder"}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-1 bg-[#1a0f3c] border border-purple-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
                              >
                                {driveFolders.length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No folders found</div>
                                ) : (
                                  driveFolders.map(folder => (
                                    <button
                                      key={folder.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedFolder(folder.id);
                                        setIsDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                                        selectedFolder === folder.id 
                                          ? "bg-purple-500/20 text-purple-300" 
                                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                                      }`}
                                    >
                                      <FolderKanban className={`h-4 w-4 ${selectedFolder === folder.id ? 'text-purple-400' : 'text-gray-500'}`} />
                                      <span className="truncate">{folder.name}</span>
                                    </button>
                                  ))
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 border border-white/10 p-4 rounded-xl bg-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-white">Main Thumbnail</h3>
                      </div>
                      
                      {currentProject.imageUrl && (
                        <div className="relative w-full rounded-xl overflow-hidden bg-black/20 border border-white/10 mb-3 group">
                          <img src={currentProject.imageUrl} alt="Thumbnail preview" className="w-full h-auto group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex justify-between items-center">
                          <span>Image URL</span>
                          <label className={`cursor-pointer text-xs px-3 py-1 rounded-full transition-colors ${
                            !driveToken || !selectedFolder 
                              ? "bg-gray-500/20 text-gray-400 cursor-not-allowed" 
                              : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                          }`}>
                            {uploadingImageIndex === 'main' ? "Uploading..." : "Upload to Drive"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e)}
                              disabled={uploadingImageIndex !== null || !driveToken || !selectedFolder}
                            />
                          </label>
                        </label>
                        <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <input
                            required
                            value={currentProject.imageUrl || ""}
                            onChange={(e) => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 border border-white/10 p-4 rounded-xl bg-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-white">Additional View Images</h3>
                        <button
                          type="button"
                          onClick={() => {
                            if ((currentProject.images?.length || 0) >= 3) {
                              showNotification("You can only add up to 3 view images.", "error");
                              return;
                            }
                            setCurrentProject({ ...currentProject, images: [...(currentProject.images || []), ""] });
                          }}
                          className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Image
                        </button>
                      </div>

                      {(currentProject.images || []).map((imgUrl, idx) => (
                        <div key={idx} className="space-y-2 pt-3 border-t border-white/10 first:border-0 first:pt-0">
                          {imgUrl && (
                            <div className="relative w-full rounded-xl overflow-hidden bg-black/20 border border-white/10 mb-2 group">
                              <img src={imgUrl} alt={`View ${idx + 1} preview`} className="w-full h-auto group-hover:scale-105 transition-transform" />
                            </div>
                          )}
                          <label className="text-sm font-medium text-gray-300 flex justify-between items-center">
                            <span>Image {idx + 1} URL</span>
                            <div className="flex items-center gap-2">
                              <label className={`cursor-pointer text-xs px-3 py-1 rounded-full transition-colors ${
                                !driveToken || !selectedFolder 
                                  ? "bg-gray-500/20 text-gray-400 cursor-not-allowed" 
                                  : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                              }`}>
                                {uploadingImageIndex === idx ? "Uploading..." : "Upload to Drive"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, idx)}
                                  disabled={uploadingImageIndex !== null || !driveToken || !selectedFolder}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...(currentProject.images || [])];
                                  newImages.splice(idx, 1);
                                  setCurrentProject({ ...currentProject, images: newImages });
                                }}
                                className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-md hover:bg-red-500/30 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                              required
                              value={imgUrl || ""}
                              onChange={(e) => {
                                const newImages = [...(currentProject.images || [])];
                                newImages[idx] = e.target.value;
                                setCurrentProject({ ...currentProject, images: newImages });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                                            </div>
                      </div>
                    </div>

<div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Save Project
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <motion.div 
              key={n}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: n * 0.1 }}
              className="rounded-2xl border border-white/10 bg-[#0a051e]/80 overflow-hidden h-[360px] animate-pulse"
            >
              <div className="h-48 bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-white/10 rounded-md w-3/4" />
                <div className="h-4 bg-white/5 rounded-md w-full" />
                <div className="h-4 bg-white/5 rounded-md w-5/6" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 border border-white/10 rounded-2xl bg-[#0a051e]/80 backdrop-blur-xl"
        >
          <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <FolderKanban className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
          <p className="text-gray-400">Start by creating your first project.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              variants={itemVariants}
              key={project.id}
              className="group relative rounded-2xl ring-1 ring-white/10 bg-[#0a051e]/80 overflow-hidden hover:ring-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col outline-none transform-gpu"
            >
              <div className="relative overflow-hidden bg-white/5 w-full">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 aspect-video">
                    <FolderKanban className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a051e]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {project.description.replace(/#+\s?|[*_~`>\[\]()!|\\]/g, '').replace(/\n+/g, ' ').slice(0, 120)}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      {tag}
                    </span>
                  ))}
                  {(project.tags?.length || 0) > 3 && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/10 font-medium">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => openEditor(project)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl transition-all border border-white/10 hover:border-white/20 font-medium"
                  >
                    <Edit2 className="h-4 w-4 text-cyan-400" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl transition-all border border-red-500/20 hover:border-red-500/30 font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border backdrop-blur-xl ${
              notification.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                : notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-200'
            }`}
          >
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
            {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
            {notification.type === 'info' && <Info className="h-5 w-5 text-purple-400" />}
            <p className="text-sm font-medium">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-2 text-white/50 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
