import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createService, updateService, deleteService, createSkill, updateSkill, deleteSkill } from "../../lib/api";
import { Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

export default function ServicesSkillsTab({ showToast, showWriteError }: AdminTabProps) {
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
            <p className="text-xs text-muted-foreground font-mono">Capabilities list shown on Capabilities page</p>
          </div>
          {!isAddingService && !editingService && (
            <Button onClick={startAddService} size="sm" className="text-[10px] font-bold uppercase">
              + Add Service
            </Button>
          )}
        </div>

        {/* Form Service */}
        {(isAddingService || editingService) && (
          <form onSubmit={handleSaveService} className="space-y-4 p-4 border border-dashed max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Service Title / Name</Label>
                <Input type="text" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="text-xs" />
              </div>
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Lucide Icon name</Label>
                <Input type="text" required value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} className="text-xs" />
              </div>
            </div>
            <div>
              <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Description Paragraph</Label>
              <Textarea rows={2} required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="text-xs" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Order:</Label>
              <Input type="number" value={serviceForm.display_order} onChange={e => setServiceForm({...serviceForm, display_order: parseInt(e.target.value) || 1})} className="w-16 text-center font-mono text-xs" />
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingService(false); setEditingService(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingService && !editingService && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border divide-y md:divide-y-0 md:divide-x p-4">
            {services.map(s => (
              <div key={s.id} className="p-2 flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">[{s.icon || "PenTool"}]</span>
                    {s.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEditService(s)} className="size-6 border text-muted-foreground hover:text-foreground"><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteService(s.id)} className="size-6 border text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Skills Counter section */}
      <div className="space-y-6 pt-6 border-t border-dashed">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Expertise Skills</h3>
            <p className="text-xs text-muted-foreground font-mono">Percentage progress bars on About Full page</p>
          </div>
          {!isAddingSkill && !editingSkill && (
            <Button onClick={startAddSkill} size="sm" className="text-[10px] font-bold uppercase">
              + Add Skill
            </Button>
          )}
        </div>

        {/* Form Skill */}
        {(isAddingSkill || editingSkill) && (
          <form onSubmit={handleSaveSkill} className="space-y-4 p-4 border border-dashed max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Skill Name</Label>
                <Input type="text" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="text-xs" />
              </div>
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Percentage (0-100)</Label>
                <Input type="number" required min="0" max="100" value={skillForm.percentage} onChange={e => setSkillForm({...skillForm, percentage: parseInt(e.target.value) || 0})} className="text-xs" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Order:</Label>
              <Input type="number" value={skillForm.display_order} onChange={e => setSkillForm({...skillForm, display_order: parseInt(e.target.value) || 1})} className="w-16 text-center font-mono text-xs" />
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingSkill(false); setEditingSkill(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingSkill && !editingSkill && (
          <div className="border divide-y p-4">
            {skills.map(sk => (
              <div key={sk.id} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">[{sk.percentage}%]</span>
                  <span className="font-bold text-sm uppercase tracking-wider">{sk.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditSkill(sk)} className="size-7 border text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(sk.id)} className="size-7 border text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
