import React, { useState } from "react";
import { Globe, Share2, Linkedin, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { createMessage } from "../lib/api";

// ── Pure validation function (re-exported from pure module for testability) ───
export type { ContactFormData, ContactFormErrors, ContactFormValidationResult } from "../lib/validateContactForm";
export { validateContactForm } from "../lib/validateContactForm";
import { validateContactForm } from "../lib/validateContactForm";
import type { ContactFormData, ContactFormErrors } from "../lib/validateContactForm";

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactForm() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "New Project",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setFieldErrors({});
    setSubmitError(null);

    // Validate
    const { isValid, errors } = validateContactForm(formData);
    if (!isValid) {
      setFieldErrors(errors);
      return; // do NOT call Supabase
    }

    // All fields valid — disable form and submit
    setSubmitting(true);

    try {
      await createMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      // Success: show confirmation and clear fields
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "New Project", message: "" });
    } catch (err: unknown) {
      // Error: re-enable form, preserve field values, show error
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "New Project", message: "" });
    setFieldErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  // Shared border class for each field group
  const fieldBorder = (hasError: boolean) =>
    `relative border-b transition-colors pb-3 group ${
      hasError
        ? "border-red-500"
        : isLight
        ? "border-black/10 focus-within:border-black"
        : "border-white/10 focus-within:border-white"
    }`;

  const labelClass = `block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors font-bold ${
    isLight ? "text-gray-600 group-focus-within:text-black" : "text-gray-400 group-focus-within:text-white"
  }`;

  const inputClass = `w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none font-sans ${
    isLight ? "text-black placeholder-gray-500" : "text-white placeholder-gray-400"
  }`;

  const errorText = `mt-1 text-xs font-mono ${isLight ? "text-red-600" : "text-red-400"}`;

  const inlineError = (msg: string | undefined) =>
    msg ? (
      <p className={errorText} role="alert">
        {msg}
      </p>
    ) : null;

  return (
    <div className="pt-24 pb-20">
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`text-4xl md:text-8xl font-extrabold uppercase mb-6 leading-none tracking-tighter select-none transition-colors duration-300 ${
            isLight ? "text-black" : "text-white"
          }`}
        >
          START A <br className="md:hidden" /> CONVERSATION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans transition-colors duration-300 ${
            isLight ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Available for selective brand partnerships, creative consulting, and contract engineering.
          Whether you have an explicit project scope or just want to introduce yourself, I'd love to connect.
        </motion.p>
      </section>

      {/* 2. Bento Layout Columns */}
      <section
        className={`py-20 border-t transition-colors duration-300 ${
          isLight ? "bg-zinc-200 border-black/10" : "bg-[#262626] border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Form Card */}
          <div
            className={`lg:col-span-7 p-8 md:p-12 border relative shadow-xl transition-all duration-300 ${
              isLight
                ? "bg-white border-black/5 text-black"
                : "bg-[#131313] border-white/5 text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  onSubmit={handleSubmit}
                  className="space-y-12"
                  noValidate
                >
                  {/* Name */}
                  <div className={fieldBorder(!!fieldErrors.name)}>
                    <label htmlFor="contact-name" className={labelClass}>Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={submitting}
                      className={inputClass}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "error-name" : undefined}
                    />
                    {fieldErrors.name && (
                      <p id="error-name" className={errorText} role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className={fieldBorder(!!fieldErrors.email)}>
                    <label htmlFor="contact-email" className={labelClass}>Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={submitting}
                      className={inputClass}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "error-email" : undefined}
                    />
                    {fieldErrors.email && (
                      <p id="error-email" className={errorText} role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Select */}
                  <div className={fieldBorder(!!fieldErrors.subject)}>
                    <label htmlFor="contact-subject" className={labelClass}>Subject</label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      disabled={submitting}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none cursor-pointer font-sans appearance-none ${
                        isLight ? "text-black" : "text-white"
                      }`}
                      aria-invalid={!!fieldErrors.subject}
                      aria-describedby={fieldErrors.subject ? "error-subject" : undefined}
                    >
                      <option className="bg-white text-black">New Project</option>
                      <option className="bg-white text-black">Consulting Strategy</option>
                      <option className="bg-white text-black">Video Editing &amp; Reels</option>
                      <option className="bg-white text-black">General Inquiry</option>
                    </select>
                    {fieldErrors.subject && (
                      <p id="error-subject" className={errorText} role="alert">
                        {fieldErrors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div className={fieldBorder(!!fieldErrors.message)}>
                    <label htmlFor="contact-message" className={labelClass}>Message</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Tell me about your project — goals, timeline, budget"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={submitting}
                      className={`w-full bg-transparent border-none p-0 text-xl focus:ring-0 focus:outline-none resize-none font-sans ${
                        isLight ? "text-black placeholder-gray-500" : "text-white placeholder-gray-400"
                      }`}
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? "error-message" : undefined}
                    />
                    {fieldErrors.message && (
                      <p id="error-message" className={errorText} role="alert">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submission error */}
                  {submitError && (
                    <p
                      className={`text-sm font-mono ${isLight ? "text-red-600" : "text-red-400"}`}
                      role="alert"
                    >
                      Your message didn't send — {submitError} Please try again, or email me directly at milkosamuel470@gmail.com.
                    </p>
                  )}

                  {/* Action button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className={`w-full md:w-auto px-12 py-5 text-xs font-mono font-bold tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-wait active:scale-95 cursor-pointer border ${
                      isLight
                        ? "bg-black border-black text-white hover:bg-zinc-800"
                        : "bg-white border-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {submitting ? "SENDING…" : "SEND MESSAGE"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-overlay"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={`py-16 text-center flex flex-col items-center justify-center h-full ${
                    isLight ? "text-black" : "text-white"
                  }`}
                  role="status"
                >
                  <CheckCircle
                    className={`w-16 h-16 mb-6 ${isLight ? "text-black" : "text-white"}`}
                    strokeWidth={1}
                  />
                  <h3
                    className={`text-3xl font-extrabold uppercase mb-4 tracking-tighter ${
                      isLight ? "text-black" : "text-white"
                    }`}
                  >
                    MESSAGE SENT
                  </h3>
                  <p
                    className={`font-sans max-w-md mx-auto mb-8 text-sm leading-relaxed ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Thanks for reaching out — I'll reply within 24 business hours.
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

          {/* Right: Details Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`p-8 md:p-12 border flex flex-col justify-between grow shadow-2xl rounded-none transition-colors duration-300 ${
                isLight
                  ? "bg-black border-black/10 text-white"
                  : "bg-[#131313] border-white/5 text-white"
              }`}
            >
              <div className="space-y-8 text-white">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-gray-400 block mb-2 uppercase font-bold">
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
                  <span className="font-mono text-[10px] tracking-widest text-gray-400 block mb-2 uppercase font-bold">
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
                  <span className="font-mono text-[10px] tracking-widest text-gray-400 block mb-2 uppercase font-bold">
                    LOCATION
                  </span>
                  <div className="text-xl md:text-2xl font-extrabold font-sans">
                    Addis Ababa, Ethiopia
                  </div>
                </div>
              </div>

              {/* Micro square buttons */}
              <div className="mt-12 flex gap-4">
                <a
                  href="https://t.me/milkosamuel470"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message me on Telegram"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white hover:-translate-y-0.5 transition-all duration-300 text-white cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/251902782218"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message me on WhatsApp"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white hover:-translate-y-0.5 transition-all duration-300 text-white cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#linkedin"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to LinkedIn...");
                  }}
                  aria-label="Connect on LinkedIn"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white hover:-translate-y-0.5 transition-all duration-300 text-white cursor-pointer"
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
