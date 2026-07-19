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
  ExternalLink,
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

  // Dashboard content
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Toaster position="top-right" />

        {/* ── Top header bar ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center font-extrabold text-sm bg-primary text-primary-foreground flex-shrink-0">
                SM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider truncate">Admin Console</p>
                <p className="text-[10px] font-mono uppercase tracking-widest truncate text-muted-foreground">
                  Samuel Milko Portfolio
                </p>
              </div>
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
                <TooltipContent>
                  Time until automatic sign-out — activity extends it
                </TooltipContent>
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

              {onBackToPortfolio && (
                <Button
                  variant="outline"
                  onClick={onBackToPortfolio}
                  className="hidden md:flex text-[10px] font-bold uppercase tracking-widest"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Site
                </Button>
              )}

              <Button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* ── Overview stat cards ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.label}
                  onClick={() => setActiveTab(card.tab)}
                  className="group cursor-pointer py-0 transition-all duration-200 hover:border-foreground/40 hover:shadow-lg"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground">
                        {card.label}
                      </p>
                      <Icon className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </div>
                    <p className="text-3xl font-extrabold tracking-tighter mt-3 font-sans">
                      {card.value}
                    </p>
                  </CardContent>
                </Card>
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
              <Card className="min-h-[600px] py-0 gap-0">
                {/* Section heading strip */}
                <div className="px-8 py-5 border-b flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-extrabold tracking-tighter uppercase font-sans">
                      {heading.title}
                    </h1>
                    <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5 text-muted-foreground">
                      {heading.subtitle}
                    </p>
                  </div>
                  <span className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
