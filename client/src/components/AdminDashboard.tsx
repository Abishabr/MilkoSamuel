import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { getMessages } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import {
  Sun,
  Moon,
  LogOut,
  Timer,
  Folder,
  MessageSquare,
  Layers,
  Briefcase,
  Settings,
  Tag,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Toaster } from "@/src/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

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

  const showToast = (msg: string) => toast.success(msg);
  const showWriteError = (msg: string) => toast.error(msg, { duration: 5000 });

  const handleLogout = async () => {
    clearAdminSession();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <AdminLogin
          sessionExpired={sessionExpiredNotice}
          onLoginSuccess={() => {
            touchAdminSession();
            setSessionExpiredNotice(false);
            setIsAuthenticated(true);
            toast.success("Logged in successfully");
          }}
          onBackToPortfolio={onBackToPortfolio}
        />
      </>
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

  // Mobile bottom bar mirrors the desktop rail's sections.
  const navItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "categories", label: "Tags", icon: Tag },
    { id: "services", label: "Services", icon: Layers },
    { id: "process", label: "Process", icon: BookOpen },
    { id: "experiences", label: "History", icon: Briefcase },
    { id: "messages", label: "Inbox", icon: MessageSquare },
  ];

  // Dashboard content
  const showOverview = activeTab === "settings";

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Toaster position="top-right" />

        {/* ── Fixed left navigation rail (desktop) ───────────────────────── */}
        <AdminSidebar
          activeTab={activeTab}
          unreadCount={unreadCount}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          onBackToPortfolio={onBackToPortfolio}
        />

        {/* ── Main content, offset by the rail on desktop ────────────────── */}
        <main className="lg:ml-64 flex flex-col min-h-screen">
          {/* Top breadcrumb bar */}
          <header className="sticky top-0 z-30 h-16 px-6 md:px-12 flex items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md transition-colors duration-300">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile brand mark (rail is hidden below lg) */}
              <div className="lg:hidden w-8 h-8 flex items-center justify-center font-extrabold text-xs bg-primary text-primary-foreground border border-primary flex-shrink-0">
                SM
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground hidden sm:inline">
                Admin /
              </span>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground truncate">
                {heading.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Session countdown */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={remainingMs < 5 * 60 * 1000 ? "destructive" : "outline"}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 font-mono text-[11px] tracking-wider"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    {formatRemaining(remainingMs)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Time until automatic sign-out — activity extends it</TooltipContent>
              </Tooltip>

              {/* Admin-only theme toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isLight ? "Switch admin to dark mode" : "Switch admin to light mode"}
                </TooltipContent>
              </Tooltip>

              {/* Sign out is in the rail on desktop; surface it here on mobile */}
              <Button
                onClick={handleLogout}
                className="lg:hidden text-[10px] font-bold uppercase tracking-widest"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </header>

          {/* Canvas — extra bottom padding on mobile to clear the fixed tab bar */}
          <div className="flex-1 p-6 md:p-12 pb-28 lg:pb-12">
            {/* Section title band */}
            <section className="mb-10 md:mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono text-muted-foreground mb-3 flex items-center gap-3">
                {heading.subtitle}
                <span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-foreground animate-pulse" />
                  Live
                </span>
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.9] tracking-display select-none">
                {heading.title}
              </h1>
              <div className="w-16 h-[2px] bg-primary mt-6" />
            </section>

            {/* Overview KPI grid — only on the landing (settings) tab */}
            {showOverview && (
              <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l mb-14">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.label}
                      onClick={() => setActiveTab(card.tab)}
                      className="group cursor-pointer text-left border-r border-b p-6 md:p-8 transition-colors duration-200 hover:bg-accent focus-visible:bg-accent"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-muted-foreground">
                          {card.label}
                        </p>
                        <Icon
                          className="w-4 h-4 text-muted-foreground opacity-40 transition-opacity group-hover:opacity-100"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-5xl md:text-6xl font-extrabold tracking-display leading-none">
                        {card.value}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active tab content */}
            <div className="border-t pt-10 md:pt-12">
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

          {/* Footer */}
          <footer className="hidden lg:flex flex-col sm:flex-row justify-between items-center gap-4 py-8 px-6 md:px-12 mt-auto border-t bg-card">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              © 2026 Samuel Milko Portfolio — Admin
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Changes publish instantly
            </div>
          </footer>
        </main>

        {/* ── Fixed bottom navigation (mobile only) ──────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-50 flex items-stretch border-t bg-card overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
                className={`relative flex flex-col items-center justify-center gap-1 flex-1 min-w-[64px] transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Lit-from-within active edge along the top */}
                {isActive && <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />}
                <span className="relative">
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                  {item.id === "messages" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center bg-destructive text-white text-[8px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}
