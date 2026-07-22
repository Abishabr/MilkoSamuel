import React from "react";
import { 
  PenTool, 
  Globe, 
  Video, 
  Zap, 
  BookOpen, 
  Fingerprint, 
  Maximize2, 
  Layout, 
  Square, 
  Activity, 
  Film, 
  Megaphone, 
  Palette,
  Sliders,
  Play,
  Sparkles,
  Grid,
  Award,
  Settings,
  Folder
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface CapabilitiesProps {
  isFullView?: boolean;
  onContactClick?: () => void;
  onJournalClick?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Map string icon names to Lucide elements
const iconMap: Record<string, React.ComponentType<any>> = {
  PenTool,
  Globe,
  Video,
  Zap,
  BookOpen,
  Fingerprint,
  Maximize2,
  Layout,
  Square,
  Activity,
  Film,
  Megaphone,
  Palette,
  Sliders,
  Play,
  Sparkles,
  Grid,
  Award,
  Settings,
  Folder
};

export default function Capabilities({ isFullView = false, onContactClick, onJournalClick }: CapabilitiesProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { services: dynamicServices } = useData();

  // Static fallback list matching prior design
  const fallbackServices = [
    { id: "1", name: "VIDEO EDITING", description: "Polishing dynamic short-form videos, commercials, visual loops, and multi-track timelines with rhythmic cuts.", icon: "Video", display_order: 1 },
    { id: "2", name: "MOTION GRAPHICS", description: "Breathing life into visual assets with kinetic type, elegant title transitions, and logo animations.", icon: "Zap", display_order: 2 },
    { id: "3", name: "COLOR GRADING", description: "Shaping mood and cinematic tone with precise color correction, LUT workflows, and consistent grade passes.", icon: "Sliders", display_order: 3 },
    { id: "4", name: "SOUND DESIGN", description: "Syncing cuts to the beat, cleaning dialogue, and layering soundscapes that make every edit land harder.", icon: "Activity", display_order: 4 },
    { id: "5", name: "SOCIAL CONTENT", description: "Producing platform-native reels, shorts, and promos cut for retention, with captions and motion hooks.", icon: "Play", display_order: 5 }
  ];

  const activeServices = React.useMemo(() => {
    const list = dynamicServices && dynamicServices.length > 0 ? dynamicServices : fallbackServices;
    return [...list].sort((a, b) => (a.display_order || 999) - (b.display_order || 999));
  }, [dynamicServices]);

  if (isFullView) {
    // Full Page Services view
    return (
      <div className="pt-32 pb-12">
        {/* Services Hero Header */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col"
          >
            <span className={`font-mono text-xs tracking-widest uppercase self-start px-3 py-1 transition-colors duration-300 ${
              isLight ? "bg-black/5 text-black" : "bg-white/5 text-white"
            }`}>
              Our Capabilities
            </span>
            <h1 className={`text-4xl md:text-7xl font-extrabold uppercase leading-none mt-6 tracking-display ${
              isLight ? "text-black" : "text-white"
            }`}>
              CUTTING MOTION <br /> INTO MEANING.
            </h1>
            <p className={`text-lg max-w-2xl mt-6 leading-relaxed ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              A complete post-production toolkit — rhythmic editing, expressive motion graphics, cinematic color, and sound that lands — built to make every frame earn attention.
            </p>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto py-16">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t transition-colors duration-300 ${
            isLight ? "border-black/10 bg-zinc-200" : "border-white/10 bg-[#0e0e0e]"
          }`}>
            {activeServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || PenTool;
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
                  className={`p-10 border-r border-b flex flex-col gap-6 group transition-all duration-300 ${
                    isLight ? "border-black/10 hover:bg-black/5" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <IconComponent className={`w-8 h-8 group-hover:scale-110 transition-all duration-300 ${
                    isLight ? "text-black group-hover:text-gray-700" : "text-white group-hover:text-gray-300"
                  }`} strokeWidth={1.5} />
                  <div className="flex flex-col gap-4">
                    <h3 className={`font-extrabold text-xl uppercase tracking-tight transition-colors ${
                      isLight ? "text-black" : "text-white"
                    }`}>
                      {service.name}
                    </h3>
                    <p className={`text-sm leading-relaxed font-sans transition-colors ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Dynamic CTA block matching images */}
        <section className={`border-t transition-colors duration-300 ${
          isLight ? "border-black/10 bg-zinc-200" : "border-white/10 bg-[#262626]"
        } overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex flex-col gap-8"
            >
              <h2 className={`text-3xl md:text-5xl font-extrabold uppercase tracking-display leading-[1.1] ${
                isLight ? "text-black" : "text-white"
              }`}>
                Ready to refine <br /> your brand?
              </h2>
              <div className="flex gap-4">
                <button 
                  onClick={onContactClick}
                  className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95 border ${
                    isLight
                      ? "bg-black border-black text-white hover:bg-transparent hover:text-black"
                      : "bg-white border-white text-black hover:bg-transparent hover:text-white"
                  }`}
                >
                  Start a Project
                </button>
                <button 
                  onClick={onJournalClick}
                  className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95 border ${
                    isLight 
                      ? "border-black text-black hover:bg-black/5" 
                      : "border-white/20 hover:border-white text-white hover:bg-white/5"
                  }`}
                >
                  View Journal
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
              className={`relative h-[300px] overflow-hidden border transition-colors ${
              isLight ? "border-black/10" : "border-white/5"
            }`}>
              <img
                alt="Brutalist architectural detail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVXsVo7rbGESsGF3-0ykLaVNQ6CI3wTH5Cw9TjayRBYG0H-JPhqy67oEt0spd_0fCF9GUP-35e3R-kRZtObe-LU98yavS7ouPJ7webbK1yKy5wFo5Q61BnJKQ4N5ERzbptuSltzN9fm0XkyMaqayIODeUyWe9J9gvPxF1muyiyOMG81a6jNmGlc0MLrYlnKgZaghmWR8GYK4mfDGIyl5gM2JOu1u_xJv96JoRH4qPcpKycAI0MIHatd02Z4PLJdiAmGrzavnQ6DQ"
              />
              <div className={`absolute inset-0 bg-gradient-to-r pointer-events-none transition-all duration-300 ${
                isLight ? "from-zinc-200" : "from-[#262626]"
              } to-transparent`} />
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Quick horizontal Capabilities preview for Home Tab
  return (
    <section className={`py-24 md:py-40 border-y transition-colors duration-300 ${
      isLight ? "bg-zinc-200 border-black/10" : "bg-[#262626] border-white/10"
    }`} id="capabilities-quick">
      <div className="max-w-7xl mx-auto px-6">
        <p className={`text-xs font-bold uppercase tracking-[0.3em] mb-16 font-mono ${
          isLight ? "text-gray-600" : "text-gray-400"
        }`}>
          Capabilities
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {activeServices.slice(0, 5).map((service, idx) => {
            const IconComponent = iconMap[service.icon] || PenTool;
            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE }}
                className="space-y-6"
              >
                <IconComponent className={`w-8 h-8 transition-colors ${
                  isLight ? "text-black/50" : "text-white/50"
                }`} strokeWidth={1.5} />
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${
                    isLight ? "text-black" : "text-white"
                  }`}>
                    {service.name}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
