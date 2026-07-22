import React from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MyProcess() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { processSteps: dynamicSteps } = useData();

  const fallbackSteps = [
    { step: "01", title: "RESEARCH", description: "Deeply understanding target metrics, customer personas, competitor blindspots, and product requirements." },
    { step: "02", title: "IDEATE", description: "Explorative wireframing, mood boarding, conceptual prototyping, and rough-cut narrative structures." },
    { step: "03", title: "DESIGN", description: "Crafting beautiful high-fidelity mockups, responsive interface grids, and pixel-perfect layouts." },
    { step: "04", title: "EDIT", description: "Polishing dynamic multi-track sequence timelines, transitions, sound designs, color grading, and graphics." },
    { step: "05", title: "DELIVER", description: "Deploying high-quality vector assets, production code elements, and fully rendered video packages." }
  ];

  const steps = dynamicSteps && dynamicSteps.length > 0 ? dynamicSteps : fallbackSteps;

  return (
    <section className={`py-24 md:py-40 transition-colors duration-300 ${
      isLight ? "bg-white text-black" : "bg-[#0e0e0e] text-white"
    }`} id="process-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20"
        >
          <div className="max-w-md">
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 font-mono ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              My Process
            </p>
            <h2 className={`text-4xl font-extrabold uppercase leading-[1.0] tracking-tighter select-none ${
              isLight ? "text-black" : "text-white"
            }`}>
              A Clear Path To Success.
            </h2>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative pt-6">
          {/* Connecting Line (Desktop only) - aligned to center of the 40px number marker (pt-6 padding + 20px = 44px) */}
          <div className={`absolute top-[44px] left-0 w-full h-[1px] hidden md:block transition-colors duration-300 ${
            isLight ? "bg-gray-200" : "bg-white/10"
          }`} />

          <div className="grid md:grid-cols-5 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id || step.step || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE }}
                className="relative flex flex-col items-start"
              >
                {/* Number Marker */}
                <div className={`w-10 h-10 flex items-center justify-center text-xs font-mono font-bold mb-8 transition-colors duration-300 ${
                  isLight ? "bg-black text-white" : "bg-white text-black"
                }`}>
                  {step.number || step.step}
                </div>

                {/* Content */}
                <h4 className={`font-extrabold uppercase text-sm mb-3 tracking-widest ${
                  isLight ? "text-black" : "text-white"
                }`}>
                  {step.title}
                </h4>
                
                <p className={`text-sm leading-relaxed font-sans ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
