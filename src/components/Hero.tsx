import React from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface HeroProps {
  onViewWork: () => void;
  onContact: () => void;
}

export default function Hero({ onViewWork, onContact }: HeroProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings } = useData();

  const heroParagraph = settings?.heroText || "I create eye-catching designs and engaging videos that combine creativity and strategy to help brands stand out and connect with their audience.";
  const heroImg = settings?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy";

  return (
    <section className="relative min-h-[90vh] flex items-center px-6 pt-24 overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Text & CTAs */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <span className={`text-xs uppercase tracking-widest mb-6 block font-mono ${
            isLight ? "text-gray-500" : "text-gray-400"
          }`}>
            Hi, I'm Samuel Milko
          </span>
          <h1 className={`text-5xl md:text-[5.5rem] font-extrabold leading-[0.9] tracking-tighter mb-8 select-none ${
            isLight ? "text-black" : "text-white"
          }`}>
            DESIGNING <br />
            DIGITAL <br />
            EXPERIENCES <br />
            <span className={isLight ? "text-gray-400" : "text-gray-500"}>THAT LAST.</span>
          </h1>
          <p className={`text-lg max-w-md mb-10 leading-relaxed ${
            isLight ? "text-gray-600" : "text-gray-400"
          }`}>
            {heroParagraph}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onViewWork}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 ${
                isLight 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              View My Work
            </button>
            <button 
              onClick={onContact}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95 border ${
                isLight 
                  ? "border-black text-black hover:bg-black/5" 
                  : "border-white/20 hover:border-white text-white hover:bg-white/5"
              }`}
            >
              Let's Work Together
            </button>
          </div>
        </motion.div>

        {/* Right Column: Profile Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative lg:h-full flex justify-end items-end"
        >
          {/* Availability Tag */}
          <div className={`absolute top-10 right-4 z-20 flex items-center space-x-2 backdrop-blur border px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase ${
            isLight 
              ? "bg-white/80 border-black/10 text-black" 
              : "bg-[#131313]/80 border-white/10 text-white"
          }`}>
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className={isLight ? "text-black" : "text-white"}>Available for Remote Work</span>
          </div>

          {/* Hero Image */}
          <div className={`w-full max-w-xl aspect-[4/5] overflow-hidden border shadow-2xl transition-all duration-300 ${
            isLight 
              ? "bg-zinc-200 border-black/5" 
              : "bg-[#262626] border-white/5"
          }`}>
            <img 
              alt="Samuel Milko (Theo)" 
              className="w-full h-full object-cover grayscale brightness-95 opacity-80 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out" 
              referrerPolicy="no-referrer"
              src={heroImg}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
