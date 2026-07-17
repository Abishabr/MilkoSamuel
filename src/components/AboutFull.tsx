import React, { useEffect, useState } from "react";
import { Download, Grid, Image, Sparkles, Video, Play, Sliders } from "lucide-react";
import { softwareEcosystem } from "../data";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface AboutFullProps {
  onStartProject: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Grid,
  Image,
  Sparkles,
  Video,
  Play,
  Sliders
};

export default function AboutFull({ onStartProject }: AboutFullProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [animateBars, setAnimateBars] = useState(false);
  const { settings, skills: dynamicSkills } = useData();

  useEffect(() => {
    // Trigger animation of skill percentage bars
    const timer = setTimeout(() => setAnimateBars(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const years = settings?.yearsExperience || "10+";
  const completed = settings?.projectsCompleted || "48";
  const clients = settings?.happyClients || "35";
  const profileImg = settings?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy";
  const bioStory = settings?.biography || "I am Samuel Milko, a multidisciplinary graphic designer and digital visual director based in Addis Ababa, Ethiopia, specializing in high-fidelity experiences that bridge raw human intuition and mathematical precision.";

  const activeStats = [
    { label: "Years Experience", value: years },
    { label: "Projects Completed", value: completed },
    { label: "Happy Clients", value: clients },
    { label: "Visual Outputs", value: "1200+" }
  ];

  const fallbackSkills = [
    { name: "Graphic Design", percentage: 98 },
    { name: "Video Editing", percentage: 96 },
    { name: "Brand Identity Design", percentage: 94 },
    { name: "Motion Graphics", percentage: 92 },
    { name: "Adobe Creative Suite", percentage: 97 }
  ];

  const activeSkills = React.useMemo(() => {
    const list = dynamicSkills && dynamicSkills.length > 0 ? dynamicSkills : fallbackSkills;
    return [...list].sort((a, b) => (a.order || 999) - (b.order || 999));
  }, [dynamicSkills]);

  return (
    <div className="pt-24 pb-20">
      {/* 1. Biography & Profile Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Biography text */}
          <div className="md:col-span-7">
            <span className={`font-mono text-xs block mb-4 tracking-widest uppercase ${
              isLight ? "text-gray-500" : "text-gray-400"
            }`}>
              Biography
            </span>
            <h1 className={`text-4xl md:text-7xl font-extrabold mb-8 leading-none tracking-tighter ${
              isLight ? "text-black" : "text-white"
            }`}>
              ARCHITECTING <br /> DIGITAL ELEGANCE.
            </h1>
            <div className={`space-y-6 text-sm md:text-base font-sans leading-relaxed max-w-xl ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              <p className={`text-lg ${isLight ? "text-black font-semibold" : "text-white"}`}>
                I am Samuel Milko, a multidisciplinary graphic designer and digital visual director based in Addis Ababa, Ethiopia, specializing in high-fidelity experiences that bridge raw human intuition and mathematical precision.
              </p>
              <div className="space-y-4">
                {bioStory.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            
            {/* Download resume CTA */}
            <div className="mt-10">
              <a 
                href={settings?.resumeUrl || "#resume"}
                onClick={(e) => { 
                  if (!settings?.resumeUrl) {
                    e.preventDefault(); 
                    alert("Resume PDF downloaded! (Interactive placeholder)"); 
                  }
                }}
                target={settings?.resumeUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className={`inline-flex items-center gap-4 border px-8 py-4 text-xs font-mono font-bold tracking-widest transition-all group ${
                  isLight 
                    ? "border-black text-black hover:bg-black hover:text-white" 
                    : "border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                DOWNLOAD RESUME
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Portrait columns */}
          <div className="md:col-span-5 relative mt-12 md:mt-0">
            <div className={`aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border shadow-2xl ${
              isLight ? "bg-zinc-100 border-black/10" : "bg-[#1b1b1b] border-white/10"
            }`}>
              <img 
                alt="Samuel Milko Portrait" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out" 
                referrerPolicy="no-referrer"
                src={profileImg}
              />
            </div>
            {/* Decorative hairline bounds */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 border-r border-b hidden md:block pointer-events-none ${
              isLight ? "border-black/20" : "border-white/20"
            }`} />
          </div>
        </div>
      </section>

      {/* 2. Stats Section Block */}
      <section className={`transition-colors duration-300 border-y py-16 my-16 ${
        isLight ? "bg-zinc-200 border-black/5" : "bg-[#262626] border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {activeStats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <span className={`text-4xl md:text-6xl font-extrabold block mb-2 select-none font-mono ${
                  isLight ? "text-black" : "text-white"
                }`}>
                  {stat.value}
                </span>
                <span className="text-xs font-mono tracking-widest text-gray-500 font-bold uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Skillset Expertise Sliders Section */}
      <section className={`py-24 my-16 border-y transition-colors duration-300 ${
        isLight ? "bg-white text-black border-black/10" : "bg-[#0e0e0e] text-white border-white/10"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left columns */}
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-gray-500 block mb-4 tracking-widest uppercase font-bold">
                Expertise
              </span>
              <h2 className={`text-3xl md:text-5xl font-extrabold leading-tight uppercase tracking-tighter ${
                isLight ? "text-black" : "text-white"
              }`}>
                THE SKILLSET <br /> BEHIND THE WORK.
              </h2>
            </div>

            {/* Right expertise bars */}
            <div className="lg:col-span-7 lg:col-start-6 space-y-8">
              {activeSkills.map((skill, idx) => {
                const percentage = skill.percentage || skill.percent || 80;
                return (
                  <div key={skill.name} className="skill-wrapper">
                    <div className="flex justify-between items-end mb-3">
                      <span className={`text-lg font-bold uppercase tracking-tight font-mono ${
                        isLight ? "text-black" : "text-white"
                      }`}>
                        {skill.name}
                      </span>
                      <span className={`text-xs font-mono font-bold ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    {/* 1px bottom border fill as in design */}
                    <div className={`h-[2px] w-full overflow-hidden relative ${
                      isLight ? "bg-black/10" : "bg-white/10"
                    }`}>
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: animateBars ? `${percentage}%` : "0%" }}
                        transition={{ duration: 1.5, delay: idx * 0.1, ease: "easeOut" }}
                        className={`h-full ${isLight ? "bg-black" : "bg-white"}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Software Ecosystem Grid */}
      <section className={`py-20 transition-colors duration-300 ${
        isLight ? "bg-zinc-200 border-y border-black/5" : "bg-[#262626] border-y border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <span className="font-mono text-xs text-gray-500 block mb-12 text-center tracking-widest uppercase">
            SOFTWARE ECOSYSTEM
          </span>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {softwareEcosystem.map((item) => {
              const IconComp = iconMap[item.iconName] || Grid;
              return (
                <div 
                  key={item.name}
                  className={`group border p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-default shadow-md ${
                    isLight 
                      ? "bg-white border-black/10 hover:bg-zinc-50" 
                      : "bg-[#0e0e0e] border-white/5 hover:bg-[#131313]"
                  }`}
                >
                  <IconComp className={`w-10 h-10 mb-4 text-gray-500 transition-all duration-300 ${
                    isLight ? "group-hover:text-black group-hover:scale-110" : "group-hover:text-white group-hover:scale-110"
                  }`} strokeWidth={1.2} />
                  <span className={`font-mono text-xs tracking-widest text-gray-500 transition-colors uppercase font-bold ${
                    isLight ? "group-hover:text-black" : "group-hover:text-white"
                  }`}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA block */}
      <section className={`py-20 transition-colors duration-300 ${
        isLight ? "bg-zinc-200" : "bg-[#0e0e0e]"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="bg-white p-12 md:p-24 text-black text-center shadow-xl">
            <h2 className="text-3xl md:text-6xl font-extrabold mb-10 leading-none uppercase tracking-tighter">
              LET'S CO-CREATE <br /> THE FUTURE.
            </h2>
            <button 
              onClick={onStartProject}
              className="inline-block bg-black text-white px-12 py-5 font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              START A PROJECT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
