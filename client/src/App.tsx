import React, { useState, useEffect } from "react";
import { initError } from "./lib/initError";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedWork from "./components/FeaturedWork";
import AboutMe from "./components/AboutMe";
import Capabilities from "./components/Capabilities";
import MyProcess from "./components/MyProcess";
import Footer from "./components/Footer";
import PortfolioArchive from "./components/PortfolioArchive";
import AboutFull from "./components/AboutFull";
import ContactForm from "./components/ContactForm";
import ProjectModal from "./components/ProjectModal";
import AdminDashboard from "./components/AdminDashboard";
import { Project } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { theme } = useTheme();
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/") || window.location.hash === "#admin";
  });

  // If Supabase failed to initialise, render a visible error instead of a white page.
  // This satisfies Requirements 1.1 and 1.3.
  if (initError) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#c00" }}>
        <strong>Configuration error:</strong> {initError}
        <p style={{ marginTop: "0.5rem", color: "#555", fontSize: "0.9rem" }}>
          Copy <code>.env.example</code> to <code>.env</code> and fill in the required values,
          then restart the dev server.
        </p>
      </div>
    );
  }

  // Scroll to top smoothly when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Sync URL routes
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/") || window.location.hash === "#admin");
    };
    
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const handleStartTalk = () => {
    setSelectedProject(null);
    setActiveTab("contact");
  };

  const handleAdminClick = () => {
    window.history.pushState(null, "", "/admin");
    setIsAdminRoute(true);
    window.scrollTo({ top: 0 });
  };

  if (isAdminRoute) {
    return (
      <div className={`bg-custom-primary text-custom-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === "light" ? "selection:bg-black selection:text-white" : "selection:bg-white selection:text-black"
      }`}>
        <AdminDashboard onBackToPortfolio={() => {
          window.history.pushState(null, "", "/");
          setIsAdminRoute(false);
          setActiveTab("home");
        }} />
      </div>
    );
  }

  return (
    <div className={`bg-custom-primary text-custom-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === "light" ? "selection:bg-black selection:text-white" : "selection:bg-white selection:text-black"
    }`}>
      {/* Navigation Sticky Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content page area with transition effects */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {activeTab === "home" && (
              <>
                <Hero 
                  onViewWork={() => setActiveTab("work")} 
                  onContact={() => setActiveTab("contact")} 
                />
                <FeaturedWork 
                  onSelectProject={setSelectedProject} 
                  onViewAll={() => setActiveTab("work")} 
                />
                <AboutMe onLearnMore={() => setActiveTab("about")} />
                <Capabilities isFullView={false} />
                <MyProcess />
                <Footer onContactClick={() => setActiveTab("contact")} onAdminClick={handleAdminClick} />
              </>
            )}

            {activeTab === "work" && (
              <>
                <PortfolioArchive onSelectProject={setSelectedProject} />
                <Footer onContactClick={() => setActiveTab("contact")} onAdminClick={handleAdminClick} />
              </>
            )}

            {activeTab === "about" && (
              <>
                <AboutFull onStartProject={() => setActiveTab("contact")} />
                <Footer onContactClick={() => setActiveTab("contact")} onAdminClick={handleAdminClick} />
              </>
            )}

            {activeTab === "contact" && (
              <>
                <ContactForm />
                <Footer onContactClick={() => setActiveTab("contact")} onAdminClick={handleAdminClick} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Case Study Detail Overlay Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onStartTalk={handleStartTalk}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ThemeProvider>
  );
}
