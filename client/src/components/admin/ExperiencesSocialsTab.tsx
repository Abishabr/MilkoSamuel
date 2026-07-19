import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createExperience, updateExperience, deleteExperience, createSocialLink, updateSocialLink, deleteSocialLink } from "../../lib/api";
import { Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";

export default function ExperiencesSocialsTab({ showToast, showWriteError }: AdminTabProps) {
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
            <p className="text-xs text-muted-foreground font-mono">Curriculum Vitae block on About page</p>
          </div>
          {!isAddingExp && !editingExp && (
            <Button onClick={startAddExp} size="sm" className="text-[10px] font-bold uppercase">
              + Add Work
            </Button>
          )}
        </div>

        {/* Form Experience */}
        {(isAddingExp || editingExp) && (
          <form onSubmit={handleSaveExp} className="space-y-4 p-4 border border-dashed max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Company</Label>
                <Input type="text" required value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Position</Label>
                <Input type="text" required value={expForm.position} onChange={e => setExpForm({...expForm, position: e.target.value})} className="text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Start Date/Year</Label>
                <Input type="text" required value={expForm.start_date} onChange={e => setExpForm({...expForm, start_date: e.target.value})} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">End Date/Year</Label>
                <Input type="text" value={expForm.end_date} onChange={e => setExpForm({...expForm, end_date: e.target.value})} className="text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Position details / Description</Label>
              <Textarea rows={2} value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className="text-xs" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Order:</Label>
              <Input type="number" value={expForm.display_order} onChange={e => setExpForm({...expForm, display_order: parseInt(e.target.value) || 1})} className="w-16 text-center font-mono text-xs" />
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingExp(false); setEditingExp(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingExp && !editingExp && (
          <div className="border divide-y p-4">
            {experiences.map(exp => (
              <div key={exp.id} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-muted-foreground mr-4">[{exp.start_date} - {exp.end_date || "Present"}]</span>
                  <span className="font-bold text-sm tracking-wide uppercase">{exp.position}</span>
                  <span className="text-xs font-mono ml-3 text-yellow-500">@ {exp.company}</span>
                  <p className="text-xs text-muted-foreground mt-1 pl-12">{exp.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon-xs" onClick={() => startEditExp(exp)} className="text-muted-foreground"><Edit2 /></Button>
                  <Button variant="outline" size="icon-xs" onClick={() => handleDeleteExp(exp.id)} className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Social Links */}
      <div className="space-y-6 pt-6 border-t border-dashed">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Social Platform Links</h3>
            <p className="text-xs text-muted-foreground font-mono">Footer links</p>
          </div>
          {!isAddingSocial && !editingSocial && (
            <Button onClick={startAddSocial} size="sm" className="text-[10px] font-bold uppercase">
              + Add Link
            </Button>
          )}
        </div>

        {/* Form Social */}
        {(isAddingSocial || editingSocial) && (
          <form onSubmit={handleSaveSocial} className="space-y-4 p-4 border border-dashed max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Platform Name</Label>
                <Input type="text" required placeholder="e.g. Telegram, WhatsApp" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Direct URL</Label>
                <Input type="text" required value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} className="text-xs" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingSocial(false); setEditingSocial(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingSocial && !editingSocial && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4">
            {socialLinks.map(soc => (
              <div key={soc.id} className="p-2 border flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs uppercase">{soc.platform}</p>
                  <a href={soc.url} target="_blank" rel="noreferrer" className="text-[10px] text-muted-foreground truncate block max-w-[120px]">{soc.url}</a>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon-xs" onClick={() => startEditSocial(soc)} className="text-muted-foreground hover:text-foreground"><Edit2 /></Button>
                  <Button variant="ghost" size="icon-xs" onClick={() => handleDeleteSocial(soc.id)} className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
