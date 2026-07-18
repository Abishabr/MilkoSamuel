import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { createService, updateService, deleteService, createSkill, updateSkill, deleteSkill } from "../../lib/api";
import { Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";

export default function ServicesSkillsTab({ showToast, showWriteError }: AdminTabProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { services, skills, refetch } = useData();

  // Services state
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", icon: "PenTool", display_order: 1 });

  // Skills state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillForm, setSkillForm] = useState({ name: "", percentage: 80, icon: "Award", display_order: 1 });

  // ---------------- SERVICES CRUD ----------------
  const startAddService = () => {
    setIsAddingService(true);
    setEditingService(null);
    setServiceForm({ name: "", description: "", icon: "PenTool", display_order: services.length + 1 });
  };

  const startEditService = (serv: any) => {
    setEditingService(serv);
    setIsAddingService(false);
    setServiceForm({ name: serv.name, description: serv.description, icon: serv.icon || "PenTool", display_order: serv.display_order || 1 });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingService) {
        await createService(serviceForm);
        showToast("Service created successfully");
      } else {
        await updateService(editingService.id, serviceForm);
        showToast("Service updated successfully");
      }
      setIsAddingService(false);
      setEditingService(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingService ? "create" : "update") + " service: " + e.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteService(id);
      showToast("Service deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete service: " + e.message);
    }
  };

  // ---------------- SKILLS CRUD ----------------
  const startAddSkill = () => {
    setIsAddingSkill(true);
    setEditingSkill(null);
    setSkillForm({ name: "", percentage: 80, icon: "Award", display_order: skills.length + 1 });
  };

  const startEditSkill = (sk: any) => {
    setEditingSkill(sk);
    setIsAddingSkill(false);
    setSkillForm({ name: sk.name, percentage: sk.percentage, icon: sk.icon || "Award", display_order: sk.display_order || 1 });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingSkill) {
        await createSkill(skillForm);
        showToast("Skill created successfully");
      } else {
        await updateSkill(editingSkill.id, skillForm);
        showToast("Skill updated successfully");
      }
      setIsAddingSkill(false);
      setEditingSkill(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingSkill ? "create" : "update") + " skill: " + e.message);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteSkill(id);
      showToast("Skill deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete skill: " + e.message);
    }
  };

  return (
    <div className="space-y-12">

      {/* 1. Services section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Services Capabilities</h3>
            <p className="text-xs text-gray-500 font-mono">Capabilities list shown on Capabilities page</p>
          </div>
          {!isAddingService && !editingService && (
            <button onClick={startAddService} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
              + Add Service
            </button>
          )}
        </div>

        {/* Form Service */}
        {(isAddingService || editingService) && (
          <form onSubmit={handleSaveService} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Service Title / Name</label>
                <input type="text" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Lucide Icon name</label>
                <input type="text" required value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Description Paragraph</label>
              <textarea rows={2} required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
              <input type="number" value={serviceForm.display_order} onChange={e => setServiceForm({...serviceForm, display_order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
              <button type="button" onClick={() => { setIsAddingService(false); setEditingService(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
            </div>
          </form>
        )}

        {!isAddingService && !editingService && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 p-4">
            {services.map(s => (
              <div key={s.id} className="p-2 flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500">[{s.icon || "PenTool"}]</span>
                    {s.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEditService(s)} className="p-1 border border-white/5 text-gray-400 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => handleDeleteService(s.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Skills Counter section */}
      <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Expertise Skills</h3>
            <p className="text-xs text-gray-500 font-mono">Percentage progress bars on About Full page</p>
          </div>
          {!isAddingSkill && !editingSkill && (
            <button onClick={startAddSkill} className={`px-3 py-2 text-[10px] font-bold uppercase border cursor-pointer ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
              + Add Skill
            </button>
          )}
        </div>

        {/* Form Skill */}
        {(isAddingSkill || editingSkill) && (
          <form onSubmit={handleSaveSkill} className="space-y-4 p-4 border border-dashed border-white/10 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Skill Name</label>
                <input type="text" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-gray-400 mb-1">Percentage (0-100)</label>
                <input type="number" required min="0" max="100" value={skillForm.percentage} onChange={e => setSkillForm({...skillForm, percentage: parseInt(e.target.value) || 0})} className={`w-full p-2 border text-xs focus:outline-none ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[9px] uppercase font-mono font-bold text-gray-400">Order:</label>
              <input type="number" value={skillForm.display_order} onChange={e => setSkillForm({...skillForm, display_order: parseInt(e.target.value) || 1})} className={`w-16 p-1 text-center font-mono text-xs ${isLight ? "bg-zinc-50 border-black/10" : "bg-zinc-900 border-white/10"}`} />
              <button type="submit" className={`px-4 py-1.5 text-[10px] font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>Save</button>
              <button type="button" onClick={() => { setIsAddingSkill(false); setEditingSkill(null); }} className="text-xs text-gray-500 font-mono">Cancel</button>
            </div>
          </form>
        )}

        {!isAddingSkill && !editingSkill && (
          <div className="border border-white/5 divide-y divide-white/5 p-4">
            {skills.map(sk => (
              <div key={sk.id} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-gray-500">[{sk.percentage}%]</span>
                  <span className="font-bold text-sm uppercase tracking-wider">{sk.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditSkill(sk)} className="p-1 border border-white/5 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteSkill(sk.id)} className="p-1 border border-white/5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
