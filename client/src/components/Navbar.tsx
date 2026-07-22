import React, { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "work", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  const isLight = theme === "light";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bg-custom-nav backdrop-blur-md border-b transition-colors duration-300 ${
      isLight ? "border-black/10" : "border-white/10"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => {
            setActiveTab("home");
            setIsOpen(false);
          }}
          id="logo-brand"
        >
          <div className={`${
            isLight ? "bg-black text-white" : "bg-white text-black"
          } font-extrabold w-10 h-10 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-105`}>
            SM
          </div>
          <div className="leading-none">
            <p className={`font-extrabold uppercase tracking-widest text-sm ${
              isLight ? "text-black" : "text-white"
            }`}>
              samuel milko
            </p>
            <p className={`text-[10px] uppercase tracking-[0.1em] ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Video editor &amp; motion graphics
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-bold tracking-widest uppercase">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors cursor-pointer relative py-2 group ${
                activeTab === item.id
                  ? (isLight ? "text-black" : "text-white")
                  : (isLight ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white")
              }`}
            >
              {item.label}
              {/* Underline: full on active, grows from left on hover */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                  isLight ? "bg-black" : "bg-white"
                } ${activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </button>
          ))}
        </nav>

        {/* Theme Toggle & CTA Buttons Group */}
        <div className="flex items-center space-x-4">
          {/* Meticulous Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2.5 transition-all duration-300 cursor-pointer border ${
              isLight 
                ? "border-black/10 hover:border-black hover:bg-black/5 text-black" 
                : "border-white/10 hover:border-white hover:bg-white/5 text-white"
            } rounded-none flex items-center justify-center active:scale-95`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 animate-none" strokeWidth={2} />
            ) : (
              <Sun className="w-4 h-4 animate-none" strokeWidth={2} />
            )}
          </button>

          {/* Hamburger Menu Toggle Button (Mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Mobile Menu"
            className={`p-2.5 transition-all duration-300 cursor-pointer border lg:hidden ${
              isLight 
                ? "border-black/10 hover:border-black hover:bg-black/5 text-black" 
                : "border-white/10 hover:border-white hover:bg-white/5 text-white"
            } rounded-none flex items-center justify-center active:scale-95`}
          >
            {isOpen ? (
              <X className="w-4 h-4" strokeWidth={2} />
            ) : (
              <Menu className="w-4 h-4" strokeWidth={2} />
            )}
          </button>

          {/* CTA Button (Desktop only) */}
          <button
            onClick={() => {
              setActiveTab("contact");
              setIsOpen(false);
            }}
            className={`hidden md:block px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border ${
              isLight
                ? "border-black bg-black text-white hover:bg-transparent hover:text-black"
                : "border-white/30 hover:bg-white hover:text-black hover:border-white"
            }`}
            id="cta-talk"
          >
            Let's Talk <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-20 left-0 w-full z-40 flex flex-col p-8 transition-all duration-300 border-b overflow-hidden ${
              isLight ? "bg-white border-black/10 text-black" : "bg-[#131313] border-white/10 text-white"
            } backdrop-blur-md`}
          >
            <nav className="flex flex-col space-y-6 text-center justify-center items-center py-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-xl font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === item.id
                      ? (isLight ? "text-black scale-105" : "text-white scale-105")
                      : (isLight ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white")
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => {
                  setActiveTab("contact");
                  setIsOpen(false);
                }}
                className={`mt-6 px-12 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                  isLight
                    ? "border-black bg-black text-white hover:bg-transparent hover:text-black"
                    : "border-white bg-white text-black hover:bg-transparent hover:text-white"
                }`}
              >
                Let's Talk
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
