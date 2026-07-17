import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface FooterProps {
  onContactClick: () => void;
  onAdminClick?: () => void;
}

export default function Footer({ onContactClick, onAdminClick }: FooterProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className={`pt-24 pb-12 border-t transition-all duration-300 ${
      isLight ? "border-black/10 bg-zinc-100 text-black" : "border-white/10 bg-[#0e0e0e] text-white"
    }`} id="contact-footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          {/* Left: Let's Create */}
          <div className="lg:col-span-6">
            <h2 className={`text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter mb-8 select-none ${
              isLight ? "text-black" : "text-white"
            }`}>
              Let's Create <br /> Something Great.
            </h2>
            <p className={`text-sm max-w-sm mb-8 font-sans leading-relaxed ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Have a project in mind or just want to discuss an ambitious vision? I'd love to hear from you. Let's build something beautiful.
            </p>
            <button 
              onClick={onContactClick}
              className={`inline-flex items-center px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 group cursor-pointer active:scale-95 border ${
                isLight 
                  ? "border-black/30 hover:bg-black hover:text-white hover:border-black text-black" 
                  : "border-white/30 hover:bg-white hover:text-black hover:border-white text-white"
              }`}
            >
              Let's Talk 
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Middle: Contact Details */}
          <div className={`lg:col-span-6 space-y-8 ${isLight ? "text-black" : "text-white"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Email</p>
                  <a className={`text-sm transition-colors font-sans ${isLight ? "hover:text-gray-600" : "hover:text-gray-400"}`} href="mailto:milkosamuel470@gmail.com">
                    milkosamuel470@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Phone</p>
                  <a className={`text-sm transition-colors font-sans ${isLight ? "hover:text-gray-600" : "hover:text-gray-400"}`} href="tel:+251902782218">
                    +251902782218
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Location</p>
                  <p className={`text-sm font-sans ${isLight ? "text-gray-700" : "text-gray-300"}`}>Adiss Ababa, Ethiopia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Globe className="w-5 h-5 text-gray-500 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Website</p>
                  <a className={`text-sm transition-colors font-sans ${isLight ? "hover:text-gray-600" : "hover:text-gray-400"}`} href="#">
                    samuelmilko.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest font-mono ${
          isLight ? "border-black/5 text-gray-500" : "border-white/5 text-gray-500"
        }`}>
          <div>© 2026 Samuel Milko. All Rights Reserved.</div>
          <div className="flex items-center gap-2 text-xs tracking-wider text-gray-600 font-mono">
            <span>Developed with premium precision</span>
            {onAdminClick && (
              <>
                <span>•</span>
                <button 
                  onClick={onAdminClick}
                  className={`underline cursor-pointer transition-colors ${isLight ? "hover:text-black" : "hover:text-white"}`}
                >
                  Admin Console
                </button>
              </>
            )}
          </div>
          <div className="flex gap-6">
            <a className={`transition-colors ${isLight ? "hover:text-black text-gray-500" : "hover:text-white text-gray-400"}`} href="https://t.me/milkosamuel470" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a className={`transition-colors ${isLight ? "hover:text-black text-gray-500" : "hover:text-white text-gray-400"}`} href="https://wa.me/251902782218" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className={`transition-colors ${isLight ? "hover:text-black text-gray-500" : "hover:text-white text-gray-400"}`} href="#">LinkedIn</a>
            <a className={`transition-colors ${isLight ? "hover:text-black text-gray-500" : "hover:text-white text-gray-400"}`} href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
