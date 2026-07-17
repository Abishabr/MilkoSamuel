import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { api } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { 
  Settings, Folder, Tag, PenTool, Zap, BookOpen, MessageSquare, Plus, Trash2, Edit2, Save, LogOut, Check, ArrowRight, Eye, RefreshCw, Layers, Award, Film, Paintbrush, Briefcase, Link, CircleAlert 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardProps {
  onBackToPortfolio?: () => void;
}

export default function AdminDashboard({ onBackToPortfolio }: AdminDashboardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { 
    settings, projects, categories, services, skills, experiences, socialLinks, processSteps, philosophyItems, refetch 
  } = useData();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("milkosamuel470@gmail.com");
  const [loginPassword, setLoginPassword] = useState("admin");
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Active section in Admin Panel
  const [activeTab, setActiveTab] = useState<string>("settings");

  // Loading indicator for operations
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Messages list state (fetched separately inside admin)
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Edit / Form states
  const [settingsForm, setSettingsForm] = useState<any>({});
  
  // Projects Management States
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: "",
    title: "",
    slug: "",
    client: "",
    projectDate: "",
    description: "",
    coverImage: "",
    videoUrl: "",
    creativeProcess: "",
    challenges: "",
    finalResult: "",
    isFeatured: false,
    featuredOrder: 1,
    categoryId: "",
    technologies: "",
    duration: "",
    testimonialQuote: "",
    testimonialAuthor: "",
    testimonialRole: ""
  });

  // Categories Management States
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // Services & Skills Management States
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", icon: "PenTool", order: 1 });

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillForm, setSkillForm] = useState({ name: "", percentage: 80, icon: "Award", order: 1 });

  // Experiences & Social Links
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expForm, setExpForm] = useState({ company: "", position: "", description: "", startDate: "", endDate: "", order: 1 });

  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState<any | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "", url: "" });

  // Process & Philosophy
  const [isAddingProcess, setIsAddingProcess] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any | null>(null);
  const [processForm, setProcessForm] = useState({ number: "01", title: "", description: "", order: 1 });

  const [isAddingPhilosophy, setIsAddingPhilosophy] = useState(false);
  const [editingPhilosophy, setEditingPhilosophy] = useState<any | null>(null);
  const [philosophyForm, setPhilosophyForm] = useState({ title: "", description: "", order: 1 });

  // Load message inbox when messages tab or admin dashboard mounts
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await api.messages.list();
      setMessages(msgs);
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    // Check if token exists in session
    const savedToken = sessionStorage.getItem("admin_token");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setSettingsForm({ ...settings });
      fetchMessages();
    }
  }, [isAuthenticated, settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.success) {
        sessionStorage.setItem("admin_token", res.token);
        setAuthToken(res.token);
        setIsAuthenticated(true);
        showToast("Logged in successfully");
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setAuthToken(null);
    setIsAuthenticated(false);
    showToast("Logged out successfully");
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ---------------- SETTINGS SAVE ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updateSettings(settingsForm);
      await refetch();
      showToast("Global Settings updated successfully");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- PROJECTS CRUD ----------------
  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setProjectForm({
      id: Math.random().toString(36).substring(2, 9),
      title: "",
      slug: "",
      client: "",
      projectDate: new Date().getFullYear().toString(),
      description: "",
      coverImage: "",
      videoUrl: "",
      creativeProcess: "",
      challenges: "",
      finalResult: "",
      isFeatured: false,
      featuredOrder: projects.length + 1,
      categoryId: categories[0]?.id || "",
      technologies: "",
      duration: "4 Weeks",
      testimonialQuote: "",
      testimonialAuthor: "",
      testimonialRole: ""
    });
  };

  const startEditProject = (proj: any) => {
    setEditingProject(proj);
    setIsAddingProject(false);
    setProjectForm({
      id: proj.id,
      title: proj.title || "",
      slug: proj.slug || "",
      client: proj.client || "",
      projectDate: proj.projectDate || proj.year || "",
      description: proj.description || "",
      coverImage: proj.coverImage || proj.image || "",
      videoUrl: proj.videoUrl || "",
      creativeProcess: proj.creativeProcess || proj.solution || "",
      challenges: proj.challenges || proj.challenge || "",
      finalResult: proj.finalResult || proj.outcome || "",
      isFeatured: !!proj.isFeatured,
      featuredOrder: proj.featuredOrder || 1,
      categoryId: proj.categoryId || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : (proj.tags ? proj.tags.join(", ") : ""),
      duration: proj.duration || "4 Weeks",
      testimonialQuote: proj.testimonial?.quote || "",
      testimonialAuthor: proj.testimonial?.author || "",
      testimonialRole: proj.testimonial?.role || ""
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...projectForm,
        technologies: projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean),
        tags: projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean), // keep for backward compat
        image: projectForm.coverImage, // map cover image
        year: projectForm.projectDate, // map for backward compat
        solution: projectForm.creativeProcess,
        challenge: projectForm.challenges,
        outcome: projectForm.finalResult,
        category: categories.find(c => c.id === projectForm.categoryId)?.name || "Uncategorized",
        duration: projectForm.duration || "4 Weeks",
        testimonial: projectForm.testimonialQuote ? {
          quote: projectForm.testimonialQuote,
          author: projectForm.testimonialAuthor,
          role: projectForm.testimonialRole
        } : null
      };

      if (isAddingProject) {
        await api.projects.create(payload);
        showToast("Project created successfully");
      } else {
        await api.projects.update(projectForm.id, payload);
        showToast("Project updated successfully");
      }
      setIsAddingProject(false);
      setEditingProject(null);
      await refetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.projects.delete(id);
      showToast("Project deleted successfully");
      await refetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // ---------------- CATEGORIES CRUD ----------------
  const startAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "" });
  };

  const startEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setIsAddingCategory(false);
    setCategoryForm({ name: cat.name, slug: cat.slug });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingCategory) {
        await api.categories.create(categoryForm);
        showToast("Category created successfully");
      } else {
        await api.categories.update(editingCategory.id, categoryForm);
        showToast("Category updated successfully");
      }
      setIsAddingCategory(false);
      setEditingCategory(null);
      await refetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.categories.delete(id);
      showToast("Category deleted successfully");
      await refetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // ---------------- SERVICES CRUD ----------------
  const startAddService = () => {
    setIsAddingService(true);
    setEditingService(null);
    setServiceForm({ name: "", description: "", icon: "PenTool", order: services.length + 1 });
  };

  const startEditService = (serv: any) => {
    setEditingService(serv);
    setIsAddingService(false);
    setServiceForm({ name: serv.name || serv.title, description: serv.description, icon: serv.icon || serv.iconName || "PenTool", order: serv.order || 1 });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...serviceForm,
        title: serviceForm.name, // backward compatibility mapping
        iconName: serviceForm.icon
      };
      if (isAddingService) {
        await api.services.create(payload);
        showToast("Service created successfully");
      } else {
        await api.services.update(editingService.id, payload);
        showToast("Service updated successfully");
      }
      setIsAddingService(false);
      setEditingService(null);
      await refetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.services.delete(id);
      showToast("Service deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- SKILLS CRUD ----------------
  const startAddSkill = () => {
    setIsAddingSkill(true);
    setEditingSkill(null);
    setSkillForm({ name: "", percentage: 80, icon: "Award", order: skills.length + 1 });
  };

  const startEditSkill = (sk: any) => {
    setEditingSkill(sk);
    setIsAddingSkill(false);
    setSkillForm({ name: sk.name, percentage: sk.percentage, icon: sk.icon || "Award", order: sk.order || 1 });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingSkill) {
        await api.skills.create(skillForm);
        showToast("Skill created successfully");
      } else {
        await api.skills.update(editingSkill.id, skillForm);
        showToast("Skill updated successfully");
      }
      setIsAddingSkill(false);
      setEditingSkill(null);
      await refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.skills.delete(id);
      showToast("Skill deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- EXPERIENCES CRUD ----------------
  const startAddExp = () => {
    setIsAddingExp(true);
    setEditingExp(null);
    setExpForm({ company: "", position: "", description: "", startDate: "", endDate: "", order: experiences.length + 1 });
  };

  const startEditExp = (exp: any) => {
    setEditingExp(exp);
    setIsAddingExp(false);
    setExpForm({ company: exp.company, position: exp.position, description: exp.description, startDate: exp.startDate, endDate: exp.endDate, order: exp.order || 1 });
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingExp) {
        await api.experiences.create(expForm);
        showToast("Experience added");
      } else {
        await api.experiences.update(editingExp.id, expForm);
        showToast("Experience updated");
      }
      setIsAddingExp(false);
      setEditingExp(null);
      await refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.experiences.delete(id);
      showToast("Experience deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- PROCESS STEPS CRUD ----------------
  const startAddProcess = () => {
    setIsAddingProcess(true);
    setEditingProcess(null);
    setProcessForm({ number: `0${processSteps.length + 1}`, title: "", description: "", order: processSteps.length + 1 });
  };

  const startEditProcess = (step: any) => {
    setEditingProcess(step);
    setIsAddingProcess(false);
    setProcessForm({ number: step.number || step.step || "01", title: step.title, description: step.description, order: step.order || 1 });
  };

  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...processForm,
        step: processForm.number // maintain for backward compat
      };
      if (isAddingProcess) {
        await api.processSteps.create(payload);
        showToast("Process step added");
      } else {
        await api.processSteps.update(editingProcess.id, payload);
        showToast("Process step updated");
      }
      setIsAddingProcess(false);
      setEditingProcess(null);
      await refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProcess = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.processSteps.delete(id);
      showToast("Process step deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- PHILOSOPHY ITEMS CRUD ----------------
  const startAddPhilosophy = () => {
    setIsAddingPhilosophy(true);
    setEditingPhilosophy(null);
    setPhilosophyForm({ title: "", description: "", order: philosophyItems.length + 1 });
  };

  const startEditPhilosophy = (phil: any) => {
    setEditingPhilosophy(phil);
    setIsAddingPhilosophy(false);
    setPhilosophyForm({ title: phil.title, description: phil.description, order: phil.order || 1 });
  };

  const handleSavePhilosophy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingPhilosophy) {
        await api.philosophyItems.create(philosophyForm);
        showToast("Philosophy item added");
      } else {
        await api.philosophyItems.update(editingPhilosophy.id, philosophyForm);
        showToast("Philosophy item updated");
      }
      setIsAddingPhilosophy(false);
      setEditingPhilosophy(null);
      await refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhilosophy = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.philosophyItems.delete(id);
      showToast("Philosophy item deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- SOCIALS CRUD ----------------
  const startAddSocial = () => {
    setIsAddingSocial(true);
    setEditingSocial(null);
    setSocialForm({ platform: "", url: "" });
  };

  const startEditSocial = (soc: any) => {
    setEditingSocial(soc);
    setIsAddingSocial(false);
    setSocialForm({ platform: soc.platform, url: soc.url });
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingSocial) {
        await api.socialLinks.create(socialForm);
        showToast("Social Link added");
      } else {
        await api.socialLinks.update(editingSocial.id, socialForm);
        showToast("Social Link updated");
      }
      setIsAddingSocial(false);
      setEditingSocial(null);
      await refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.socialLinks.delete(id);
      showToast("Social Link deleted");
      await refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ---------------- INBOX CRUD ----------------
  const handleToggleReadMessage = async (msg: any) => {
    try {
      await api.messages.update(msg.id, { ...msg, isRead: !msg.isRead });
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await api.messages.delete(id);
      fetchMessages();
      showToast("Message deleted");
    } catch (e) {
      console.error(e);
    }
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen pt-32 pb-16 flex items-center justify-center transition-colors duration-300 ${
        isLight ? "bg-zinc-50" : "bg-[#0a0a0a]"
      }`}>
        <div className={`w-full max-w-md p-10 border transition-all duration-300 shadow-2xl relative ${
          isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
        }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 font-bold border text-xl ${
              isLight ? "bg-black text-white border-black" : "bg-white text-black border-white"
            }`}>
              SM
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tighter uppercase font-sans ${isLight ? "text-black" : "text-white"}`}>
              Portfolio Admin Portal
            </h1>
            <p className={`text-xs mt-2 font-mono uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Database Control Desk
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
              <CircleAlert className="w-5 h-5 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full p-3.5 border text-sm focus:outline-none transition-colors rounded-none ${
                  isLight 
                    ? "bg-zinc-50 border-black/10 text-black focus:border-black" 
                    : "bg-zinc-900 border-white/10 text-white focus:border-white"
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Access Password
              </label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full p-3.5 border text-sm focus:outline-none transition-colors rounded-none ${
                  isLight 
                    ? "bg-zinc-50 border-black/10 text-black focus:border-black" 
                    : "bg-zinc-900 border-white/10 text-white focus:border-white"
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full p-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group border ${
                isLight 
                  ? "bg-black text-white hover:bg-transparent hover:text-black border-black" 
                  : "bg-white text-black hover:bg-transparent hover:text-white border-white"
              }`}
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {onBackToPortfolio && (
              <button
                type="button"
                onClick={onBackToPortfolio}
                className={`w-full p-3.5 text-[10px] font-bold uppercase tracking-widest border border-dashed transition-all duration-300 cursor-pointer text-center ${
                  isLight 
                    ? "border-black/30 text-gray-700 hover:text-black hover:border-black hover:bg-black/5" 
                    : "border-white/20 text-gray-400 hover:text-white hover:border-white hover:bg-white/5"
                }`}
              >
                ← Return to Main Website
              </button>
            )}
          </form>

          {/* Seed hints */}
          <div className={`mt-8 pt-6 border-t border-dashed text-xs space-y-1.5 ${
            isLight ? "border-black/10 text-gray-500" : "border-white/10 text-gray-400"
          }`}>
            <p className="font-bold uppercase tracking-wider text-[9px] font-mono">Default Demo Access:</p>
            <p className="font-mono">Email: <span className={isLight ? "text-black" : "text-white font-semibold"}>milkosamuel470@gmail.com</span></p>
            <p className="font-mono">Password: <span className={isLight ? "text-black" : "text-white font-semibold"}>admin</span></p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className={`min-h-screen pt-24 pb-16 transition-colors duration-300 ${
      isLight ? "bg-zinc-100" : "bg-[#080808]"
    }`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-black border border-white/20 text-white px-5 py-3 shadow-2xl flex items-center gap-3 font-mono text-xs"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span>{successMessage.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column navigation panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-6 border transition-colors ${
            isLight ? "bg-white border-black/10 text-black" : "bg-[#111111] border-white/10 text-white"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-3 h-3 rounded-full bg-green-500 animate-pulse`} />
              <div>
                <p className="text-xs font-extrabold uppercase font-sans">Milko Samuel</p>
                <p className="text-[10px] text-gray-500 font-mono">ADMINISTRATOR</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className={`w-full py-2.5 mt-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLight 
                  ? "border-black/10 hover:border-black hover:bg-black/5 text-black" 
                  : "border-white/10 hover:border-white hover:bg-white/5 text-white"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>

            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className={`w-full py-2.5 mt-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight 
                    ? "border-black/10 hover:border-black hover:bg-black/5 text-black" 
                    : "border-white/10 hover:border-white hover:bg-white/5 text-white"
                }`}
              >
                ← Exit to Portfolio
              </button>
            )}
          </div>

          {/* Nav Items Panel */}
          <nav className={`border flex flex-wrap lg:flex-col overflow-hidden transition-colors ${
            isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
          }`}>
            {[
              { id: "settings", label: "Settings & Stats", icon: Settings },
              { id: "projects", label: "Projects CRUD", icon: Folder },
              { id: "categories", label: "Categories", icon: Tag },
              { id: "services", label: "Services & Skills", icon: Layers },
              { id: "process", label: "Process & Philosophy", icon: BookOpen },
              { id: "experiences", label: "History & Socials", icon: Briefcase },
              { id: "messages", label: `Inbox Messages (${messages.filter(m => !m.isRead).length})`, icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // clear forms when switching
                    setIsAddingProject(false); setEditingProject(null);
                    setIsAddingCategory(false); setEditingCategory(null);
                    setIsAddingService(false); setEditingService(null);
                    setIsAddingSkill(false); setEditingSkill(null);
                    setIsAddingExp(false); setEditingExp(null);
                    setIsAddingSocial(false); setEditingSocial(null);
                    setIsAddingProcess(false); setEditingProcess(null);
                    setIsAddingPhilosophy(false); setEditingPhilosophy(null);
                  }}
                  className={`flex-1 min-w-[150px] lg:w-full px-5 py-4 text-left font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all cursor-pointer ${
                    isActive 
                      ? (isLight ? "bg-black text-white" : "bg-white text-black") 
                      : (isLight ? "text-gray-500 hover:text-black hover:bg-zinc-50" : "text-gray-400 hover:text-white hover:bg-zinc-900")
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right column main content dashboard view */}
        <div className="lg:col-span-9">
          <div className={`p-8 border min-h-[600px] transition-colors duration-300 relative ${
            isLight ? "bg-white border-black/10 text-black" : "bg-[#111111] border-white/10 text-white"
          }`}>
            
            {/* ----------------- TAB: SETTINGS & STATS ----------------- */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Global Settings</h2>
                  <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Main settings single database row</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Website Title</label>
                      <input 
                        type="text" 
                        value={settingsForm.websiteTitle || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, websiteTitle: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Website Logo Text</label>
                      <input 
                        type="text" 
                        value={settingsForm.logo || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Hero Section Heading Text</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.heroText || ""} 
                      onChange={e => setSettingsForm({ ...settingsForm, heroText: e.target.value })}
                      className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Biography Story Paragraph</label>
                    <textarea 
                      rows={4}
                      value={settingsForm.biography || ""} 
                      onChange={e => setSettingsForm({ ...settingsForm, biography: e.target.value })}
                      className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Profile Picture URL</label>
                      <input 
                        type="text" 
                        value={settingsForm.profilePicture || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, profilePicture: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Resume / CV Document URL</label>
                      <input 
                        type="text" 
                        value={settingsForm.resumeUrl || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed border-white/10">
                    <h3 className="text-sm font-extrabold uppercase mb-4 tracking-wider">Metrics &amp; Statistics Counter</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Years of Experience</label>
                        <input 
                          type="text" 
                          value={settingsForm.yearsExperience || ""} 
                          onChange={e => setSettingsForm({ ...settingsForm, yearsExperience: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Projects Completed</label>
                        <input 
                          type="text" 
                          value={settingsForm.projectsCompleted || ""} 
                          onChange={e => setSettingsForm({ ...settingsForm, projectsCompleted: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Happy Clients</label>
                        <input 
                          type="text" 
                          value={settingsForm.happyClients || ""} 
                          onChange={e => setSettingsForm({ ...settingsForm, happyClients: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-white/10">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Footer Text</label>
                      <input 
                        type="text" 
                        value={settingsForm.footerText || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Theme Base Color</label>
                      <input 
                        type="text" 
                        value={settingsForm.themeColor || ""} 
                        onChange={e => setSettingsForm({ ...settingsForm, themeColor: e.target.value })}
                        placeholder="#000000"
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-8 py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 border ${
                      isLight 
                        ? "bg-black text-white hover:bg-zinc-800 border-black" 
                        : "bg-white text-black hover:bg-zinc-100 border-white"
                    } active:scale-95 disabled:opacity-50`}
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? "SAVING SETTINGS..." : "SAVE SITE SETTINGS"}
                  </button>
                </form>
              </div>
            )}

            {/* ----------------- TAB: PROJECTS CRUD ----------------- */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Projects Database</h2>
                    <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Add or modify case studies</p>
                  </div>
                  {!isAddingProject && !editingProject && (
                    <button
                      onClick={startAddProject}
                      className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border cursor-pointer transition-all ${
                        isLight 
                          ? "bg-black text-white border-black hover:bg-zinc-800" 
                          : "bg-white text-black border-white hover:bg-zinc-200"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Project
                    </button>
                  )}
                </div>

                {/* Listing Projects */}
                {!isAddingProject && !editingProject && (
                  <div className="border border-white/5 divide-y divide-white/5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="flex items-center justify-between p-4 group hover:bg-zinc-50/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <img 
                            src={proj.image || proj.coverImage} 
                            alt={proj.title} 
                            className="w-16 h-12 object-cover border border-white/10" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-bold text-sm tracking-tight">{proj.title}</h3>
                            <p className="text-xs text-gray-500 font-mono">
                              {proj.client} — {proj.projectDate || proj.year}
                              {proj.isFeatured && <span className="ml-2.5 text-[9px] bg-yellow-400/20 text-yellow-500 px-1.5 py-0.5 rounded font-bold font-sans">FEATURED</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditProject(proj)}
                            className="p-2 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-500 cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create/Edit Form */}
                {(isAddingProject || editingProject) && (
                  <form onSubmit={handleSaveProject} className="space-y-6 pt-4 border-t border-dashed border-white/10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-yellow-500">
                        {isAddingProject ? "CREATE NEW CASE STUDY" : `EDITING: ${projectForm.title}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                        className="text-xs text-gray-500 hover:text-white font-mono uppercase"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Title</label>
                        <input 
                          type="text" required
                          value={projectForm.title} 
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Slug (URL ID)</label>
                        <input 
                          type="text" required
                          value={projectForm.slug} 
                          onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Client / Company Name</label>
                        <input 
                          type="text" required
                          value={projectForm.client} 
                          onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Date / Year</label>
                        <input 
                          type="text" required
                          value={projectForm.projectDate} 
                          onChange={e => setProjectForm({ ...projectForm, projectDate: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Duration (e.g. 4 Weeks)</label>
                        <input 
                          type="text" required
                          value={projectForm.duration} 
                          onChange={e => setProjectForm({ ...projectForm, duration: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Folder</label>
                        <select 
                          value={projectForm.categoryId} 
                          onChange={e => setProjectForm({ ...projectForm, categoryId: e.target.value })}
                          className={`w-full p-3.5 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Cover Image URL</label>
                        <input 
                          type="text" required
                          value={projectForm.coverImage} 
                          onChange={e => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Video Embed URL (Optional)</label>
                        <input 
                          type="text" 
                          value={projectForm.videoUrl} 
                          onChange={e => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Technologies (comma-separated, e.g. FIGMA, PREMIERE, VIDEO)</label>
                      <input 
                        type="text" 
                        value={projectForm.technologies} 
                        onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        placeholder="BRANDING, PACKAGING, ADOBE CC"
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Intro Description Summary</label>
                      <textarea 
                        rows={2} required
                        value={projectForm.description} 
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed border-white/10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Creative Process (Solution)</label>
                        <textarea 
                          rows={4}
                          value={projectForm.creativeProcess} 
                          onChange={e => setProjectForm({ ...projectForm, creativeProcess: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Key Challenges Faced</label>
                        <textarea 
                          rows={4}
                          value={projectForm.challenges} 
                          onChange={e => setProjectForm({ ...projectForm, challenges: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Final Results &amp; Impact</label>
                        <textarea 
                          rows={4}
                          value={projectForm.finalResult} 
                          onChange={e => setProjectForm({ ...projectForm, finalResult: e.target.value })}
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-white/10 space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Client Testimonial (Optional)</h4>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Quote</label>
                        <textarea 
                          rows={2}
                          value={projectForm.testimonialQuote} 
                          onChange={e => setProjectForm({ ...projectForm, testimonialQuote: e.target.value })}
                          placeholder="e.g. Samuel's geometric precision completely redefined our presence. He brought a rare level of craft and vision..."
                          className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Author Name</label>
                          <input 
                            type="text"
                            value={projectForm.testimonialAuthor} 
                            onChange={e => setProjectForm({ ...projectForm, testimonialAuthor: e.target.value })}
                            placeholder="e.g. Dr. Helena Vanta"
                            className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Author Role / Position</label>
                          <input 
                            type="text"
                            value={projectForm.testimonialRole} 
                            onChange={e => setProjectForm({ ...projectForm, testimonialRole: e.target.value })}
                            placeholder="e.g. Founder & Creative Director, Vanta Skin"
                            className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 border border-white/5">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="isFeatured"
                          checked={projectForm.isFeatured}
                          onChange={e => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded-none cursor-pointer"
                        />
                        <label htmlFor="isFeatured" className="text-xs uppercase font-mono cursor-pointer font-bold select-none">Feature on Homepage</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase font-mono font-bold">Display Order:</label>
                        <input 
                          type="number"
                          value={projectForm.featuredOrder}
                          onChange={e => setProjectForm({ ...projectForm, featuredOrder: parseInt(e.target.value) || 1 })}
                          className={`w-16 p-1 border text-center font-mono ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                          isLight ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-200"
                        }`}
                      >
                        {submitting ? "SAVING..." : "SAVE CASE STUDY"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all cursor-pointer`}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ----------------- TAB: CATEGORIES ----------------- */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Portfolio Categories</h2>
                    <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Filter tags for portfolio</p>
                  </div>
                  {!isAddingCategory && !editingCategory && (
                    <button
                      onClick={startAddCategory}
                      className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border cursor-pointer transition-all ${
                        isLight ? "bg-black text-white border-black" : "bg-white text-black border-white"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> New Category
                    </button>
                  )}
                </div>

                {/* List Categories */}
                {!isAddingCategory && !editingCategory && (
                  <div className="border border-white/5 divide-y divide-white/5">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex justify-between items-center p-4">
                        <div>
                          <h4 className="font-bold text-sm">{cat.name}</h4>
                          <p className="text-xs text-gray-500 font-mono">Slug ID: {cat.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditCategory(cat)}
                            className="p-1.5 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create/Edit Category form */}
                {(isAddingCategory || editingCategory) && (
                  <form onSubmit={handleSaveCategory} className="space-y-6 pt-4 border-t border-dashed border-white/10 max-w-md">
                    <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-yellow-500">
                      {isAddingCategory ? "Add Category" : "Edit Category"}
                    </h3>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Name</label>
                      <input 
                        type="text" required
                        value={categoryForm.name} 
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Slug</label>
                      <input 
                        type="text" required
                        value={categoryForm.slug} 
                        onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className={`px-4 py-2 text-xs font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        Save
                      </button>
                      <button type="button" onClick={() => { setIsAddingCategory(false); setEditingCategory(null); }} className="text-xs text-gray-500 hover:text-white uppercase font-mono">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ----------------- TAB: SERVICES & SKILLS ----------------- */}
            {activeTab === "services" && (
              <div className="space-y-12">
                
                {/* 1. Services section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Services Capabilities</h3>
                      <p className="text-xs text-gray-500 font-mono">Capabilities list shown on Capabilities page</p>
                    </div>
                    {!isAddingService && !editingService && (
                      <button onClick={startAddService} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Service
                      </button>
                    )}
                  </div>

                  {/* Form Service */}
                  {(isAddingService || editingService) && (
                    <form onSubmit={handleSaveService} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Service Title / Name</label>
                          <input type="text" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Lucide Icon name</label>
                          <input type="text" required value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Description Paragraph</label>
                        <textarea rows={2} required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
                        <input type="number" value={serviceForm.order} onChange={e => setServiceForm({...serviceForm, order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingService(false); setEditingService(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingService && !editingService && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 p-4">
                      {services.map(s => (
                        <div key={s.id} className="p-2 flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-sm flex items-center gap-2">
                              <span className="text-[10px] font-mono text-gray-500">[{s.icon || s.iconName || "PenTool"}]</span>
                              {s.name || s.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => startEditService(s)} className="p-1 border border-white/5 text-gray-400 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDeleteService(s.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Skills Counter section */}
                <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Expertise Skills</h3>
                      <p className="text-xs text-gray-500 font-mono">Percentage progress bars on About Full page</p>
                    </div>
                    {!isAddingSkill && !editingSkill && (
                      <button onClick={startAddSkill} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Skill
                      </button>
                    )}
                  </div>

                  {/* Form Skill */}
                  {(isAddingSkill || editingSkill) && (
                    <form onSubmit={handleSaveSkill} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Skill Name</label>
                          <input type="text" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Percentage (0-100)</label>
                          <input type="number" required min="0" max="100" value={skillForm.percentage} onChange={e => setSkillForm({...skillForm, percentage: parseInt(e.target.value) || 0})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
                        <input type="number" value={skillForm.order} onChange={e => setSkillForm({...skillForm, order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingSkill(false); setEditingSkill(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingSkill && !editingSkill && (
                    <div className="border border-white/5 divide-y divide-white/5 p-4">
                      {skills.map(sk => (
                        <div key={sk.id} className="py-2.5 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-gray-500">[{sk.percentage}%]</span>
                            <span className="font-bold text-sm uppercase tracking-wider">{sk.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditSkill(sk)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteSkill(sk.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------- TAB: PROCESS & PHILOSOPHY ----------------- */}
            {activeTab === "process" && (
              <div className="space-y-12">
                
                {/* 1. Process Steps */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Process Roadmaps</h3>
                      <p className="text-xs text-gray-500 font-mono">My Process timeline steps on homepage</p>
                    </div>
                    {!isAddingProcess && !editingProcess && (
                      <button onClick={startAddProcess} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Step
                      </button>
                    )}
                  </div>

                  {/* Form Process */}
                  {(isAddingProcess || editingProcess) && (
                    <form onSubmit={handleSaveProcess} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Number (e.g. 01, 02)</label>
                          <input type="text" required value={processForm.number} onChange={e => setProcessForm({...processForm, number: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Title</label>
                          <input type="text" required value={processForm.title} onChange={e => setProcessForm({...processForm, title: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Description</label>
                        <textarea rows={2} required value={processForm.description} onChange={e => setProcessForm({...processForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
                        <input type="number" value={processForm.order} onChange={e => setProcessForm({...processForm, order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingProcess(false); setEditingProcess(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingProcess && !editingProcess && (
                    <div className="border border-white/5 divide-y divide-white/5 p-4">
                      {processSteps.map(step => (
                        <div key={step.id} className="py-3 flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-yellow-500 mr-4">[{step.number || step.step}]</span>
                            <span className="font-bold text-sm tracking-wide uppercase">{step.title}</span>
                            <p className="text-xs text-gray-500 mt-1 pl-12">{step.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditProcess(step)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteProcess(step.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Philosophy Items */}
                <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Philosophy Principles</h3>
                      <p className="text-xs text-gray-500 font-mono">Philosophy columns on homepage about block</p>
                    </div>
                    {!isAddingPhilosophy && !editingPhilosophy && (
                      <button onClick={startAddPhilosophy} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Philosophy
                      </button>
                    )}
                  </div>

                  {/* Form Philosophy */}
                  {(isAddingPhilosophy || editingPhilosophy) && (
                    <form onSubmit={handleSavePhilosophy} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Philosophy Title</label>
                        <input type="text" required value={philosophyForm.title} onChange={e => setPhilosophyForm({...philosophyForm, title: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Philosophy Description Summary</label>
                        <textarea rows={2} required value={philosophyForm.description} onChange={e => setPhilosophyForm({...philosophyForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
                        <input type="number" value={philosophyForm.order} onChange={e => setPhilosophyForm({...philosophyForm, order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingPhilosophy(false); setEditingPhilosophy(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingPhilosophy && !editingPhilosophy && (
                    <div className="border border-white/5 divide-y divide-white/5 p-4">
                      {philosophyItems.map(item => (
                        <div key={item.id} className="py-3 flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-sm tracking-wide uppercase font-sans">{item.title}</span>
                            <p className="text-xs text-gray-500 mt-1 pr-12">{item.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditPhilosophy(item)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeletePhilosophy(item.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------- TAB: HISTORY & SOCIALS ----------------- */}
            {activeTab === "experiences" && (
              <div className="space-y-12">
                
                {/* 1. Experiences */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Work History Experience</h3>
                      <p className="text-xs text-gray-500 font-mono">Curriculum Vitae block on About page</p>
                    </div>
                    {!isAddingExp && !editingExp && (
                      <button onClick={startAddExp} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Work
                      </button>
                    )}
                  </div>

                  {/* Form Experience */}
                  {(isAddingExp || editingExp) && (
                    <form onSubmit={handleSaveExp} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Company</label>
                          <input type="text" required value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Position</label>
                          <input type="text" required value={expForm.position} onChange={e => setExpForm({...expForm, position: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Start Date/Year</label>
                          <input type="text" required value={expForm.startDate} onChange={e => setExpForm({...expForm, startDate: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">End Date/Year</label>
                          <input type="text" required value={expForm.endDate} onChange={e => setExpForm({...expForm, endDate: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Position details / Description</label>
                        <textarea rows={2} required value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
                        <input type="number" value={expForm.order} onChange={e => setExpForm({...expForm, order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingExp(false); setEditingExp(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingExp && !editingExp && (
                    <div className="border border-white/5 divide-y divide-white/5 p-4">
                      {experiences.map(exp => (
                        <div key={exp.id} className="py-3 flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-gray-500 mr-4">[{exp.startDate} - {exp.endDate}]</span>
                            <span className="font-bold text-sm tracking-wide uppercase">{exp.position}</span>
                            <span className="text-xs font-mono ml-3 text-yellow-500">@ {exp.company}</span>
                            <p className="text-xs text-gray-500 mt-1 pl-12">{exp.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditExp(exp)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteExp(exp.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Social Links */}
                <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Social Platform Links</h3>
                      <p className="text-xs text-gray-500 font-mono">Footer links</p>
                    </div>
                    {!isAddingSocial && !editingSocial && (
                      <button onClick={startAddSocial} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                        + Add Link
                      </button>
                    )}
                  </div>

                  {/* Form Social */}
                  {(isAddingSocial || editingSocial) && (
                    <form onSubmit={handleSaveSocial} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Platform Name</label>
                          <input type="text" required placeholder="e.g. Telegram, WhatsApp" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Direct URL</label>
                          <input type="text" required value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
                        <button type="button" onClick={() => { setIsAddingSocial(false); setEditingSocial(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!isAddingSocial && !editingSocial && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-white/5 p-4">
                      {socialLinks.map(soc => (
                        <div key={soc.id} className="p-2 border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-xs uppercase">{soc.platform}</p>
                            <a href={soc.url} target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 truncate block max-w-[120px]">{soc.url}</a>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => startEditSocial(soc)} className="p-1 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteSocial(soc.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------- TAB: INBOX MESSAGES ----------------- */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Inbox Submissions</h2>
                    <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Leads received via contact form</p>
                  </div>
                  <button 
                    onClick={fetchMessages} 
                    disabled={loadingMessages}
                    className="p-2 border border-white/5 text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-mono uppercase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin" : ""}`} /> Refresh
                  </button>
                </div>

                {loadingMessages && <div className="text-center py-10 font-mono text-xs">LOADING MESSAGE LEADS...</div>}

                {!loadingMessages && messages.length === 0 && (
                  <div className="text-center py-20 border border-dashed border-white/10">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-600 mb-4" strokeWidth={1.2} />
                    <p className="font-mono text-xs text-gray-500">NO MESSAGES IN INBOX YET</p>
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-6 border transition-colors ${
                        msg.isRead 
                          ? (isLight ? "bg-zinc-50 border-black/5" : "bg-zinc-900/40 border-white/5 opacity-80") 
                          : (isLight ? "bg-white border-black font-semibold shadow-md" : "bg-[#161616] border-white/20 font-semibold")
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mr-3 ${
                            msg.isRead ? "bg-zinc-800 text-gray-400" : "bg-yellow-400 text-black"
                          }`}>
                            {msg.isRead ? "READ" : "NEW SUBMISSION"}
                          </span>
                          <span className="text-xs font-bold">{msg.name}</span>
                          <span className="text-xs text-gray-500 font-mono ml-2">&lt;{msg.email}&gt;</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider font-mono">
                          Subject: <span className={isLight ? "text-black" : "text-white font-semibold"}>{msg.subject || "No Subject"}</span>
                        </p>
                        <p className={`text-sm leading-relaxed font-sans ${isLight ? "text-gray-800" : "text-gray-300"}`}>
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleToggleReadMessage(msg)}
                          className="px-3 py-1.5 border border-white/10 hover:border-white/20 text-xs font-mono uppercase text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Mark as {msg.isRead ? "Unread" : "Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-3 py-1.5 border border-white/10 hover:border-red-500/30 text-xs font-mono uppercase text-gray-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
