import React from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onViewWork: () => void;
  onContact: () => void;
}

// Exponential ease-out — snappy start, long elegant settle
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ onViewWork, onContact }: HeroProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings } = useData();

  const heroParagraph = settings?.hero_text || "I create eye-catching designs and engaging videos that combine creativity and strategy to help brands stand out and connect with their audience.";
  const heroImg = settings?.profile_picture_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy";

  // Staggered line-by-line reveal for the display heading
  const headlineLines = ["DESIGNING", "DIGITAL", "EXPERIENCES"];

  return (
    <section className="relative min-h-[90vh] flex items-center px-6 pt-24 overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Text & CTAs */}
        <div className="z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className={`text-xs uppercase tracking-widest mb-6 block font-mono ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Hi, I'm Samuel Milko
          </motion.span>

          {/* Fluid display scale: 3rem → 5.5rem, tracking floor -0.04em */}
          <h1
            className={`font-extrabold leading-[0.92] tracking-display mb-8 select-none text-[clamp(3rem,8vw,5.5rem)] ${
              isLight ? "text-black" : "text-white"
            }`}
          >
            {headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className={`block ${isLight ? "text-gray-500" : "text-gray-500"}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + headlineLines.length * 0.09, ease: EASE }}
              >
                THAT LAST.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className={`text-lg max-w-md mb-10 leading-relaxed ${
              isLight ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {heroParagraph}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={onViewWork}
              className={`group px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98] inline-flex items-center gap-2 ${
                isLight
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              View My Work
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={onContact}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-[0.98] border ${
                isLight
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-white/20 hover:border-white text-white hover:bg-white/5"
              }`}
            >
              Let's Work Together
            </button>
          </motion.div>
        </div>

        {/* Right Column: Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="relative lg:h-full flex justify-end items-end"
        >
          {/* Availability Tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
            className={`absolute top-10 right-4 z-20 flex items-center space-x-2 backdrop-blur border px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase ${
              isLight
                ? "bg-white/80 border-black/10 text-black"
                : "bg-[#131313]/80 border-white/10 text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>Available for Remote Work</span>
          </motion.div>

          {/* Hero Image — grayscale at rest, color on hover: the signature reveal */}
          <div
            className={`w-full max-w-xl aspect-[4/5] overflow-hidden border shadow-2xl transition-all duration-300 ${
              isLight
                ? "bg-zinc-200 border-black/5"
                : "bg-[#262626] border-white/5"
            }`}
          >
            <img
              alt="Samuel Milko, graphic designer and video editor"
              className="w-full h-full object-cover grayscale hover:grayscale-0 brightness-95 opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out"
              referrerPolicy="no-referrer"
              src={heroImg}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
