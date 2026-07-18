import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getMessages } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { Check, CircleAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

export default function AdminDashboard({ onBackToPortfolio }: AdminDashboardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Active section in Admin Panel
  const [activeTab, setActiveTab] = useState<string>("settings");

  // Toast / error banners shared across all tabs
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  // Messages list state (fetched separately inside admin)
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

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

  useEffect(() => {
    // Check if Supabase session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessagesData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showWriteError = (msg: string) => {
    setWriteError(msg);
    setTimeout(() => setWriteError(null), 5000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    showToast("Logged out successfully");
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => { setIsAuthenticated(true); showToast("Logged in successfully"); }}
        onBackToPortfolio={onBackToPortfolio}
      />
    );
  }

  const tabProps = { showToast, showWriteError };

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

      {/* Write Error Banner */}
      <AnimatePresence>
        {writeError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-5 py-3 shadow-2xl flex items-center gap-3 font-mono text-xs max-w-sm"
          >
            <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{writeError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column navigation panel */}
        <AdminSidebar
          activeTab={activeTab}
          unreadCount={messages.filter(m => !m.is_read).length}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          onBackToPortfolio={onBackToPortfolio}
        />

        {/* Right column main content dashboard view */}
        <div className="lg:col-span-9">
          <div className={`p-8 border min-h-[600px] transition-colors duration-300 relative ${
            isLight ? "bg-white border-black/10 text-black" : "bg-[#111111] border-white/10 text-white"
          }`}>
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
  );
}
