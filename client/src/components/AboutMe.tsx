import React from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface AboutMeProps {
  onLearnMore: () => void;
}

export default function AboutMe({ onLearnMore }: AboutMeProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, philosophyItems } = useData();

  const bioStory = settings?.biography || `I'm Samuel Milko, a Graphic Designer and Video Editor focused on creating visually compelling designs and engaging video content that bring ideas to life.

I combine raw creativity with surgical attention to detail to deliver impactful branding, social media systems, motion visuals, and professional video edits that leave a lasting mark.

I help forward-thinking brands and ambitious creators turn chaotic ideas into clean, eye-catching, and high-performance realities.`;

  // Render paragraphs for multi-line support
  const bioParagraphs = bioStory.split("\n\n").map(p => p.trim()).filter(Boolean);

  const defaultPhilosophy = [
    { id: "1", title: "Clarity", description: "Simplicity is not minimalism. It is making the complex feel entirely effortless and transparent." },
    { id: "2", title: "Function", description: "Design must serve a strategic purpose first, removing friction and guiding user interaction naturally." },
    { id: "3", title: "Impact", description: "Great design leaves an indelible, lasting visual memory and drives measurable growth and outcomes." }
  ];

  const activePhilosophy = philosophyItems && philosophyItems.length > 0 ? philosophyItems : defaultPhilosophy;

  return (
    <section className={`py-24 transition-colors duration-300 ${
      isLight ? "bg-white text-black" : "bg-[#0e0e0e] text-white"
    }`} id="about-intro-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Story */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <p className={`text-xs font-bold uppercase tracking-widest mb-6 font-mono ${
              isLight ? "text-gray-500" : "text-gray-400"
            }`}>
              About Me
            </p>
            <h2 className={`text-4xl md:text-5xl font-extrabold uppercase leading-[1.0] tracking-tighter mb-8 ${
              isLight ? "text-black" : "text-white"
            }`}>
              Design is thinking <br /> made visible.
            </h2>
            <div className={`space-y-6 text-sm leading-relaxed font-sans ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              {bioParagraphs.map((para, i) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>
            <button 
              onClick={onLearnMore}
              className={`mt-10 px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center group transition-all duration-300 cursor-pointer active:scale-95 border ${
                isLight 
                  ? "border-black/20 hover:border-black hover:bg-black hover:text-white text-black" 
                  : "border-white/20 hover:border-white hover:bg-white hover:text-black text-white"
              }`}
            >
              More About Me 
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>

          {/* Right Column: Philosophy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <p className={`text-xs font-bold uppercase tracking-widest mb-6 lg:text-left font-mono ${
              isLight ? "text-gray-500" : "text-gray-400"
            }`}>
              My Philosophy
            </p>
            <div className="space-y-10">
              {activePhilosophy.map((item, index) => {
                const isLast = index === activePhilosophy.length - 1;
                const formattedIndex = String(index + 1).padStart(2, "0");
                return (
                  <div 
                    key={item.id || index} 
                    className={`pb-6 transition-colors ${
                      !isLast 
                        ? (isLight ? "border-b border-black/10 hover:border-black/30" : "border-b border-white/10 hover:border-white/30") 
                        : ""
                    }`}
                  >
                    <h4 className={`font-extrabold uppercase text-base mb-2 tracking-widest ${
                      isLight ? "text-black" : "text-white"
                    }`}>
                      {formattedIndex}. {item.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
