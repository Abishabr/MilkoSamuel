import React, { useState } from "react";
import { Mail, Phone, MapPin, Globe, Share2, Linkedin, CheckCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export default function ContactForm() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "New Project",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setSubmitting(true);
    // Simulate real server submit proxies
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "New Project",
      message: ""
    });
    setSubmitted(false);
  };

  return (
    <div className="pt-24 pb-20">
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-8xl font-extrabold uppercase mb-6 leading-none tracking-tighter select-none transition-colors duration-300 ${
            isLight ? "text-black" : "text-white"
          }`}
        >
          START A <br className="md:hidden" /> CONVERSATION
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans transition-colors duration-300 ${
            isLight ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Available for selective brand partnerships, creative consulting, and contract engineering. Whether you have an explicit project scope or just want to introduce yourself, I'd love to connect.
        </motion.p>
      </section>

      {/* 2. Bento Layout Columns - Set with bg-white section background for dynamic alternating contrast */}
      <section className={`py-20 border-t transition-colors duration-300 ${
        isLight ? "bg-zinc-200 border-black/10" : "bg-[#262626] border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Form Card */}
          <div className={`lg:col-span-7 p-8 md:p-12 border relative shadow-xl transition-all duration-300 ${
            isLight ? "bg-white border-black/5 text-black" : "bg-[#131313] border-white/5 text-white"
          }`}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-12"
                >
                  {/* Name */}
                  <div className={`relative border-b transition-colors pb-3 group ${
                    isLight ? "border-black/10 focus-within:border-black" : "border-white/10 focus-within:border-white"
                  }`}>
                    <label className={`block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors font-bold ${
                      isLight ? "text-gray-500 group-focus-within:text-black" : "text-gray-400 group-focus-within:text-white"
                    }`}>
                      Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none font-sans ${
                        isLight ? "text-black placeholder-gray-300" : "text-white placeholder-gray-600"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className={`relative border-b transition-colors pb-3 group ${
                    isLight ? "border-black/10 focus-within:border-black" : "border-white/10 focus-within:border-white"
                  }`}>
                    <label className={`block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors font-bold ${
                      isLight ? "text-gray-500 group-focus-within:text-black" : "text-gray-400 group-focus-within:text-white"
                    }`}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="milkosamuel470@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none font-sans ${
                        isLight ? "text-black placeholder-gray-300" : "text-white placeholder-gray-600"
                      }`}
                    />
                  </div>

                  {/* Subject Select */}
                  <div className={`relative border-b transition-colors pb-3 group ${
                    isLight ? "border-black/10 focus-within:border-black" : "border-white/10 focus-within:border-white"
                  }`}>
                    <label className={`block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors font-bold ${
                      isLight ? "text-gray-500 group-focus-within:text-black" : "text-gray-400 group-focus-within:text-white"
                    }`}>
                      Subject
                    </label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none cursor-pointer font-sans appearance-none ${
                        isLight ? "text-black" : "text-white"
                      }`}
                    >
                      <option className="bg-white text-black">New Project</option>
                      <option className="bg-white text-black">Consulting Strategy</option>
                      <option className="bg-white text-black">Video Editing &amp; Reels</option>
                      <option className="bg-white text-black">General Inquiry</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div className={`relative border-b transition-colors pb-3 group ${
                    isLight ? "border-black/10 focus-within:border-black" : "border-white/10 focus-within:border-white"
                  }`}>
                    <label className={`block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors font-bold ${
                      isLight ? "text-gray-500 group-focus-within:text-black" : "text-gray-400 group-focus-within:text-white"
                    }`}>
                      Message
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Tell me about your vision"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none resize-none font-sans ${
                        isLight ? "text-black placeholder-gray-300" : "text-white placeholder-gray-600"
                      }`}
                    />
                  </div>

                  {/* Action button */}
                  <button 
                    type="submit"
                    disabled={submitting}
                    className={`w-full md:w-auto px-12 py-5 text-xs font-mono font-bold tracking-widest transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer border ${
                      isLight 
                        ? "bg-black border-black text-white hover:bg-zinc-800" 
                        : "bg-white border-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {submitting ? "SENDING MESSAGE..." : "SEND MESSAGE"}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-overlay"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`py-16 text-center flex flex-col items-center justify-center h-full ${
                    isLight ? "text-black" : "text-white"
                  }`}
                >
                  <CheckCircle className={`w-16 h-16 mb-6 animate-bounce ${isLight ? "text-black" : "text-white"}`} strokeWidth={1} />
                  <h3 className={`text-3xl font-extrabold uppercase mb-4 tracking-tighter ${
                    isLight ? "text-black" : "text-white"
                  }`}>
                    MESSAGE DISPATCHED!
                  </h3>
                  <p className={`font-sans max-w-md mx-auto mb-8 text-sm leading-relaxed ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Thank you, <strong className={isLight ? "text-black" : "text-white"}>{formData.name}</strong>. Your inquiry regarding <strong className={isLight ? "text-black" : "text-white"}>"{formData.subject}"</strong> has been encrypted and routed safely. I will review and reply within 24 business hours.
                  </p>
                  <button 
                    onClick={handleReset}
                    className={`px-8 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer border ${
                      isLight 
                        ? "border-black/30 hover:border-black text-black hover:bg-black hover:text-white" 
                        : "border-white/30 hover:border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Details Card (Dark accent card on white background) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={`p-8 md:p-12 border flex flex-col justify-between grow shadow-2xl rounded-none transition-colors duration-300 ${
              isLight 
                ? "bg-black border-black/10 text-white" 
                : "bg-[#131313] border-white/5 text-white"
            }`}>
              <div className="space-y-8 text-white">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 block mb-2 uppercase font-bold">
                    EMAIL
                  </span>
                  <a 
                    href="mailto:milkosamuel470@gmail.com" 
                    className="text-xl md:text-2xl hover:text-gray-300 transition-colors underline decoration-white/10 underline-offset-4 font-sans font-extrabold"
                  >
                    milkosamuel470@gmail.com
                  </a>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 block mb-2 uppercase font-bold">
                    PHONE
                  </span>
                  <a 
                    href="tel:+251902782218" 
                    className="text-xl md:text-2xl hover:text-gray-300 transition-colors underline decoration-white/10 underline-offset-4 font-sans font-extrabold"
                  >
                    +251902782218
                  </a>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 block mb-2 uppercase font-bold">
                    LOCATION
                  </span>
                  <div className="text-xl md:text-2xl font-extrabold font-sans">
                    Adiss Ababa, Ethiopia
                  </div>
                </div>
              </div>

              {/* Micro circular buttons */}
              <div className="mt-12 flex gap-4">
                <a 
                  href="#telegram" 
                  onClick={(e) => { e.preventDefault(); window.open("https://t.me/milkosamuel470", "_blank"); }}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white shadow cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a 
                  href="#whatsapp" 
                  onClick={(e) => { e.preventDefault(); window.open("https://wa.me/251902782218", "_blank"); }}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white shadow cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a 
                  href="#linkedin" 
                  onClick={(e) => { e.preventDefault(); alert("Redirecting to LinkedIn..."); }}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white shadow cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
