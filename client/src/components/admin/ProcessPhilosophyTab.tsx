import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createProcessStep, updateProcessStep, deleteProcessStep, createPhilosophyItem, updatePhilosophyItem, deletePhilosophyItem } from "../../lib/api";
import { Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

export default function ProcessPhilosophyTab({ showToast, showWriteError }: AdminTabProps) {
  const { processSteps, philosophyItems, refetch } = useData();

  // Process state
  const [isAddingProcess, setIsAddingProcess] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any | null>(null);
  const [processForm, setProcessForm] = useState({ number: "01", title: "", description: "", display_order: 1 });

  // Philosophy state
  const [isAddingPhilosophy, setIsAddingPhilosophy] = useState(false);
  const [editingPhilosophy, setEditingPhilosophy] = useState<any | null>(null);
  const [philosophyForm, setPhilosophyForm] = useState({ title: "", description: "", display_order: 1 });

  // ---------------- PROCESS STEPS CRUD ----------------
  const startAddProcess = () => {
    setIsAddingProcess(true);
    setEditingProcess(null);
    setProcessForm({ number: `0${processSteps.length + 1}`, title: "", description: "", display_order: processSteps.length + 1 });
  };

  const startEditProcess = (step: any) => {
    setEditingProcess(step);
    setIsAddingProcess(false);
    setProcessForm({ number: step.number || "01", title: step.title, description: step.description, display_order: step.display_order || 1 });
  };

  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        number: processForm.number,
        title: processForm.title,
        description: processForm.description,
        display_order: processForm.display_order,
      };
      if (isAddingProcess) {
        await createProcessStep(payload as any);
        showToast("Process step added");
      } else {
        await updateProcessStep(editingProcess.id, payload);
        showToast("Process step updated");
      }
      setIsAddingProcess(false);
      setEditingProcess(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingProcess ? "create" : "update") + " process step: " + e.message);
    }
  };

  const handleDeleteProcess = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteProcessStep(id);
      showToast("Process step deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete process step: " + e.message);
    }
  };

  // ---------------- PHILOSOPHY ITEMS CRUD ----------------
  const startAddPhilosophy = () => {
    setIsAddingPhilosophy(true);
    setEditingPhilosophy(null);
    setPhilosophyForm({ title: "", description: "", display_order: philosophyItems.length + 1 });
  };

  const startEditPhilosophy = (phil: any) => {
    setEditingPhilosophy(phil);
    setIsAddingPhilosophy(false);
    setPhilosophyForm({ title: phil.title, description: phil.description, display_order: phil.display_order || 1 });
  };

  const handleSavePhilosophy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingPhilosophy) {
        await createPhilosophyItem(philosophyForm as any);
        showToast("Philosophy item added");
      } else {
        await updatePhilosophyItem(editingPhilosophy.id, philosophyForm);
        showToast("Philosophy item updated");
      }
      setIsAddingPhilosophy(false);
      setEditingPhilosophy(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingPhilosophy ? "create" : "update") + " philosophy item: " + e.message);
    }
  };

  const handleDeletePhilosophy = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deletePhilosophyItem(id);
      showToast("Philosophy item deleted");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete philosophy item: " + e.message);
    }
  };

  return (
    <div className="space-y-12">

      {/* 1. Process Steps */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">Process Roadmaps</h3>
            <p className="text-xs text-muted-foreground font-mono">My Process timeline steps on homepage</p>
          </div>
          {!isAddingProcess && !editingProcess && (
            <Button onClick={startAddProcess} size="sm" className="text-[10px] font-bold uppercase">
              + Add Step
            </Button>
          )}
        </div>

        {/* Form Process */}
        {(isAddingProcess || editingProcess) && (
          <form onSubmit={handleSaveProcess} className="space-y-4 p-4 border border-dashed max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Number (e.g. 01, 02)</Label>
                <Input type="text" required value={processForm.number} onChange={e => setProcessForm({...processForm, number: e.target.value})} className="text-xs" />
              </div>
              <div>
                <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Title</Label>
                <Input type="text" required value={processForm.title} onChange={e => setProcessForm({...processForm, title: e.target.value})} className="text-xs" />
              </div>
            </div>
            <div>
              <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Description</Label>
              <Textarea rows={2} required value={processForm.description} onChange={e => setProcessForm({...processForm, description: e.target.value})} className="text-xs" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Order:</Label>
              <Input type="number" value={processForm.display_order} onChange={e => setProcessForm({...processForm, display_order: parseInt(e.target.value) || 1})} className="w-16 text-center font-mono text-xs" />
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingProcess(false); setEditingProcess(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingProcess && !editingProcess && (
          <div className="border divide-y p-4">
            {processSteps.map(step => (
              <div key={step.id} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-yellow-500 mr-4">[{step.number}]</span>
                  <span className="font-bold text-sm tracking-wide uppercase">{step.title}</span>
                  <p className="text-xs text-muted-foreground mt-1 pl-12">{step.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditProcess(step)} className="size-7 border text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProcess(step.id)} className="size-7 border text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Philosophy Items */}
      <div className="space-y-6 pt-6 border-t border-dashed">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold tracking-tight uppercase font-sans">My Philosophy Principles</h3>
            <p className="text-xs text-muted-foreground font-mono">Philosophy columns on homepage about block</p>
          </div>
          {!isAddingPhilosophy && !editingPhilosophy && (
            <Button onClick={startAddPhilosophy} size="sm" className="text-[10px] font-bold uppercase">
              + Add Philosophy
            </Button>
          )}
        </div>

        {/* Form Philosophy */}
        {(isAddingPhilosophy || editingPhilosophy) && (
          <form onSubmit={handleSavePhilosophy} className="space-y-4 p-4 border border-dashed max-w-md">
            <div>
              <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Philosophy Title</Label>
              <Input type="text" required value={philosophyForm.title} onChange={e => setPhilosophyForm({...philosophyForm, title: e.target.value})} className="text-xs" />
            </div>
            <div>
              <Label className="block text-[9px] uppercase font-mono font-bold text-muted-foreground mb-1">Philosophy Description Summary</Label>
              <Textarea rows={2} required value={philosophyForm.description} onChange={e => setPhilosophyForm({...philosophyForm, description: e.target.value})} className="text-xs" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Order:</Label>
              <Input type="number" value={philosophyForm.display_order} onChange={e => setPhilosophyForm({...philosophyForm, display_order: parseInt(e.target.value) || 1})} className="w-16 text-center font-mono text-xs" />
              <Button type="submit" size="sm" className="text-[10px] font-bold uppercase">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingPhilosophy(false); setEditingPhilosophy(null); }} className="text-xs text-muted-foreground font-mono">Cancel</Button>
            </div>
          </form>
        )}

        {!isAddingPhilosophy && !editingPhilosophy && (
          <div className="border divide-y p-4">
            {philosophyItems.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-extrabold text-sm tracking-wide uppercase font-sans">{item.title}</span>
                  <p className="text-xs text-muted-foreground mt-1 pr-12">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditPhilosophy(item)} className="size-7 border text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePhilosophy(item.id)} className="size-7 border text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
