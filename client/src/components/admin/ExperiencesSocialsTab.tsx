import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { createExperience, updateExperience, deleteExperience, createSocialLink, updateSocialLink, deleteSocialLink } from "../../lib/api";
import { Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";

export default function ExperiencesSocialsTab({ showToast, showWriteError }: AdminTabProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { experiences, socialLinks, refetch } = useData();

  // Experiences state
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expForm, setExpForm] = useState({ company: "", position: "", description: "", start_date: "", end_date: "", display_order: 1 });

  // Social links state
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState<any | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "", url: "" });

  // ---------------- EXPERIENCES CRUD ----------------
  const startAddExp = () => {
    setIsAddingExp(true);
    setEditingExp(null);
    setExpForm({ company: "", position: "", description: "", start_date: "", end_date: "", display_order: experiences.length + 1 });
  };

  const startEditExp = (exp: any) => {
    setEditingExp(exp);
    setIsAddingExp(false);
    setExpForm({ company: exp.company, position: exp.position, description: exp.description, start_date: exp.start_date, end_date: exp.end_date || "", display_order: exp.display_order || 1 });
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        company: expForm.company,
        position: expForm.position,
        description: expForm.description || null,
        start_date: expForm.start_date,
        end_date: expForm.end_date || null,
        display_order: expForm.display_order,
      };
      if (isAddingExp) {
        await createExperience(payload as any);
        showToast("Experience added");
      } else {
        await updateExperience(editingExp.id, payload);
        showToast("Experience updated");
      }
      setIsAddingExp(false);
      setEditingExp(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingExp ? "create" : "update") + " experience: " + e.message);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteExperience(id);
      showToast("Experience deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete experience: " + e.message);
    }
  };

  // ---------------- SOCIALS CRUD ----------------
  const startAddSocial = () => {
    setIsAddingSocial(true);
    setEditingSocial(null);
    setSocialForm({ platform: "", url: "" });
  };

  const startEditSocial = (soc: any) => {
    setEditingSocial(soc);
    setIsAddingSocial(false);
    setSocialForm({ platform: soc.platform, url: soc.url });
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingSocial) {
        await createSocialLink(socialForm);
        showToast("Social Link added");
      } else {
        await updateSocialLink(editingSocial.id, socialForm);
        showToast("Social Link updated");
      }
      setIsAddingSocial(false);
      setEditingSocial(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingSocial ? "create" : "update") + " social link: " + e.message);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteSocialLink(id);
      showToast("Social Link deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete social link: " + e.message);
    }
  };

  return (
    <div className="space-y-12">

      {/* 1. Experiences */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Work History Experience</h3>
            <p className="text-xs text-gray-500 font-mono">Curriculum Vitae block on About page</p>
          </div>
          {!isAddingExp && !editingExp && (
            <button onClick={startAddExp} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
              + Add Work
            </button>
          )}
        </div>

        {/* Form Experience */}
        {(isAddingExp || editingExp) && (
          <form onSubmit={handleSaveExp} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Company</label>
                <input type="text" required value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Position</label>
                <input type="text" required value={expForm.position} onChange={e => setExpForm({...expForm, position: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Start Date/Year</label>
                <input type="text" required value={expForm.start_date} onChange={e => setExpForm({...expForm, start_date: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">End Date/Year</label>
                <input type="text" value={expForm.end_date} onChange={e => setExpForm({...expForm, end_date: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Position details / Description</label>
              <textarea rows={2} value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
              <input type="number" value={expForm.display_order} onChange={e => setExpForm({...expForm, display_order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
              <button type="button" onClick={() => { setIsAddingExp(false); setEditingExp(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
            </div>
          </form>
        )}

        {!isAddingExp && !editingExp && (
          <div className="border border-white/5 divide-y divide-white/5 p-4">
            {experiences.map(exp => (
              <div key={exp.id} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-gray-500 mr-4">[{exp.start_date} - {exp.end_date || "Present"}]</span>
                  <span className="font-bold text-sm tracking-wide uppercase">{exp.position}</span>
                  <span className="text-xs font-mono ml-3 text-yellow-500">@ {exp.company}</span>
                  <p className="text-xs text-gray-500 mt-1 pl-12">{exp.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditExp(exp)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteExp(exp.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Social Links */}
      <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Social Platform Links</h3>
            <p className="text-xs text-gray-500 font-mono">Footer links</p>
          </div>
          {!isAddingSocial && !editingSocial && (
            <button onClick={startAddSocial} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
              + Add Link
            </button>
          )}
        </div>

        {/* Form Social */}
        {(isAddingSocial || editingSocial) && (
          <form onSubmit={handleSaveSocial} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Platform Name</label>
                <input type="text" required placeholder="e.g. Telegram, WhatsApp" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Direct URL</label>
                <input type="text" required value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
              <button type="button" onClick={() => { setIsAddingSocial(false); setEditingSocial(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
            </div>
          </form>
        )}

        {!isAddingSocial && !editingSocial && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-white/5 p-4">
            {socialLinks.map(soc => (
              <div key={soc.id} className="p-2 border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs uppercase">{soc.platform}</p>
                  <a href={soc.url} target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 truncate block max-w-[120px]">{soc.url}</a>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEditSocial(soc)} className="p-1 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteSocial(soc.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
