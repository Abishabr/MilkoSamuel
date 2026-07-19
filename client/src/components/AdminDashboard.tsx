import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { getMessages } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import {
  Check,
  CircleAlert,
  Sun,
  Moon,
  LogOut,
  Timer,
  Folder,
  MessageSquare,
  Layers,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  touchAdminSession,
  isAdminSessionValid,
  adminSessionRemainingMs,
  clearAdminSession,
} from "../lib/adminSession";

import AdminLogin from "./admin/AdminLogin";
import AdminSidebar from "./admin/AdminSidebar";
import SettingsTab from "./admin/SettingsTab";
import ProjectsTab from "./admin/ProjectsTab";
import CategoriesTab from "./admin/CategoriesTab";
import ServicesSkillsTab from "./admin/ServicesSkillsTab";
import ProcessPhilosophyTab from "./admin/ProcessPhilosophyTab";
import ExperiencesSocialsTab from "./admin/ExperiencesSocialsTab";
import MessagesTab from "./admin/MessagesTab";

interface AdminDashboardProps {
  onBackToPortfolio?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  settings: { title: "Global Settings", subtitle: "Site identity, biography & metrics" },
  projects: { title: "Projects", subtitle: "Create, edit and organise case studies" },
  categories: { title: "Categories", subtitle: "Portfolio filtering taxonomy" },
  services: { title: "Services & Skills", subtitle: "Capabilities shown on the site" },
  process: { title: "Process & Philosophy", subtitle: "How-you-work narrative" },
  experiences: { title: "History & Socials", subtitle: "Experience timeline and social links" },
  messages: { title: "Inbox", subtitle: "Messages from the contact form" },
};

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AdminDashboard({ onBackToPortfolio }: AdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const { projects, services, experiences } = useData();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<boolean>(false);

  // Active section in Admin Panel
  const [activeTab, setActiveTab] = useState<string>("settings");

  // Toast / error banners shared across all tabs
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  // Messages list state (fetched separately inside admin)
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Session countdown display
  const [remainingMs, setRemainingMs] = useState<number>(adminSessionRemainingMs());
  const expiredRef = useRef(false);

  const fetchMessagesData = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await getMessages();
      setMessages(msgs);
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSessionExpired = useCallback(async () => {
    if (expiredRef.current) return;
    expiredRef.current = true;
    clearAdminSession();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setSessionExpiredNotice(true);
  }, []);

  useEffect(() => {
    // A Supabase session alone is not enough — the dashboard session
    // window (time limit) must also still be open.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isAdminSessionValid()) {
        setIsAuthenticated(true);
      } else if (session) {
        // Supabase token exists but the dashboard window expired → force re-login.
        handleSessionExpired();
      }
    });
  }, [handleSessionExpired]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessagesData();
    }
  }, [isAuthenticated]);

  // Enforce the session time limit + keep the countdown ticking.
  // Any user activity (click / keypress) extends the window.
  useEffect(() => {
    if (!isAuthenticated) return;
    expiredRef.current = false;

    const tick = window.setInterval(() => {
      const left = adminSessionRemainingMs();
      setRemainingMs(left);
      if (left <= 0) handleSessionExpired();
    }, 1000);

    const onActivity = () => {
      if (isAdminSessionValid()) touchAdminSession();
    };
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [isAuthenticated, handleSessionExpired]);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showWriteError = (msg: string) => {
    setWriteError(msg);
    setTimeout(() => setWriteError(null), 5000);
  };

  const handleLogout = async () => {
    clearAdminSession();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    showToast("Logged out successfully");
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <AdminLogin
        sessionExpired={sessionExpiredNotice}
        onLoginSuccess={() => {
          touchAdminSession();
          setSessionExpiredNotice(false);
          setIsAuthenticated(true);
          showToast("Logged in successfully");
        }}
        onBackToPortfolio={onBackToPortfolio}
      />
    );
  }

  const tabProps = { showToast, showWriteError };
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const heading = TAB_TITLES[activeTab] ?? TAB_TITLES.settings;

  const statCards = [
    { label: "Projects", value: projects.length, icon: Folder, tab: "projects" },
    { label: "Services", value: services.length, icon: Layers, tab: "services" },
    { label: "Experiences", value: experiences.length, icon: Briefcase, tab: "experiences" },
    { label: "Unread Messages", value: unreadCount, icon: MessageSquare, tab: "messages" },
  ];

  // Dashboard content
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isLight ? "bg-zinc-100 text-black" : "bg-[#080808] text-white"
    }`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-black border border-white/20 text-white px-5 py-3 shadow-2xl flex items-center gap-3 font-mono text-xs"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span>{successMessage.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Error Banner */}
      <AnimatePresence>
        {writeError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-5 py-3 shadow-2xl flex items-center gap-3 font-mono text-xs max-w-sm"
          >
            <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{writeError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top header bar ─────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        isLight ? "bg-white/90 border-black/10" : "bg-[#0c0c0c]/90 border-white/10"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 flex items-center justify-center font-extrabold text-sm border flex-shrink-0 ${
              isLight ? "bg-black text-white border-black" : "bg-white text-black border-white"
            }`}>
              SM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider truncate">Admin Console</p>
              <p className={`text-[10px] font-mono uppercase tracking-widest truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Samuel Milko Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Session countdown */}
            <div
              title="Time until automatic sign-out (activity extends it)"
              className={`hidden sm:flex items-center gap-2 px-3 py-2 border font-mono text-[11px] tracking-wider ${
                remainingMs < 5 * 60 * 1000
                  ? "border-red-500/50 text-red-500"
                  : isLight ? "border-black/10 text-gray-600" : "border-white/10 text-gray-400"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              {formatRemaining(remainingMs)}
            </div>

            {/* Admin-only theme toggle */}
            <button
              onClick={toggleTheme}
              title={isLight ? "Switch admin to dark mode" : "Switch admin to light mode"}
              className={`p-2.5 border transition-all cursor-pointer ${
                isLight
                  ? "border-black/10 hover:border-black text-black hover:bg-black/5"
                  : "border-white/10 hover:border-white text-white hover:bg-white/5"
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className={`hidden md:block px-4 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  isLight
                    ? "border-black/10 hover:border-black text-gray-700 hover:text-black hover:bg-black/5"
                    : "border-white/10 hover:border-white text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                View Site
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer border ${
                isLight
                  ? "bg-black text-white border-black hover:bg-zinc-800"
                  : "bg-white text-black border-white hover:bg-zinc-200"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Overview stat cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.label}
                onClick={() => setActiveTab(card.tab)}
                className={`group p-5 border text-left transition-all duration-200 cursor-pointer ${
                  isLight
                    ? "bg-white border-black/10 hover:border-black hover:shadow-lg"
                    : "bg-[#111111] border-white/10 hover:border-white/40 hover:bg-[#161616]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {card.label}
                  </p>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isLight ? "text-gray-400 group-hover:text-black" : "text-gray-500 group-hover:text-white"
                  }`} />
                </div>
                <p className="text-3xl font-extrabold tracking-tighter mt-3 font-sans">
                  {card.value}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column navigation panel */}
          <AdminSidebar
            activeTab={activeTab}
            unreadCount={unreadCount}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            onBackToPortfolio={onBackToPortfolio}
          />

          {/* Right column main content dashboard view */}
          <div className="lg:col-span-9">
            <div className={`border min-h-[600px] transition-colors duration-300 ${
              isLight ? "bg-white border-black/10 text-black" : "bg-[#111111] border-white/10 text-white"
            }`}>
              {/* Section heading strip */}
              <div className={`px-8 py-5 border-b flex items-center justify-between ${
                isLight ? "border-black/10" : "border-white/10"
              }`}>
                <div>
                  <h1 className="text-lg font-extrabold tracking-tighter uppercase font-sans">
                    {heading.title}
                  </h1>
                  <p className={`text-[10px] font-mono uppercase tracking-widest mt-0.5 ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {heading.subtitle}
                  </p>
                </div>
                <span className={`hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="p-8">
                {activeTab === "settings" && <SettingsTab {...tabProps} />}
                {activeTab === "projects" && <ProjectsTab {...tabProps} />}
                {activeTab === "categories" && <CategoriesTab {...tabProps} />}
                {activeTab === "services" && <ServicesSkillsTab {...tabProps} />}
                {activeTab === "process" && <ProcessPhilosophyTab {...tabProps} />}
                {activeTab === "experiences" && <ExperiencesSocialsTab {...tabProps} />}
                {activeTab === "messages" && (
                  <MessagesTab
                    messages={messages}
                    loadingMessages={loadingMessages}
                    onRefresh={fetchMessagesData}
                    showToast={showToast}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
