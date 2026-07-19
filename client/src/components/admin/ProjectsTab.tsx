import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createProject, updateProject, deleteProject } from "../../lib/api";
import { Plus, Trash2, Edit2, CircleAlert } from "lucide-react";
import { openCloudinaryUpload, AdminTabProps } from "./cloudinaryUpload";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";

const labelCls = "text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground";

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  client: "",
  project_date: "",
  description: "",
  cover_image_url: "",
  banner_image_url: "",
  video_url: "",
  creative_process: "",
  challenges: "",
  final_result: "",
  is_featured: false,
  featured_order: 1,
  category_id: "",
  technologies: "",
  testimonial_quote: "",
  testimonial_author: "",
  testimonial_role: ""
};

export default function ProjectsTab({ showToast, showWriteError }: AdminTabProps) {
  const { projects, categories, refetch } = useData();

  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(emptyForm);

  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setProjectForm({
      ...emptyForm,
      project_date: new Date().getFullYear().toString(),
      featured_order: projects.length + 1,
      category_id: categories[0]?.id || "",
    });
  };

  const startEditProject = (proj: any) => {
    setEditingProject(proj);
    setIsAddingProject(false);
    setProjectForm({
      id: proj.id,
      title: proj.title || "",
      slug: proj.slug || "",
      client: proj.client || "",
      project_date: proj.project_date || "",
      description: proj.description || "",
      cover_image_url: proj.cover_image_url || "",
      banner_image_url: proj.banner_image_url || "",
      video_url: proj.video_url || "",
      creative_process: proj.creative_process || "",
      challenges: proj.challenges || "",
      final_result: proj.final_result || "",
      is_featured: !!proj.is_featured,
      featured_order: proj.featured_order || 1,
      category_id: proj.category_id || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : "",
      testimonial_quote: proj.testimonial_quote || "",
      testimonial_author: proj.testimonial_author || "",
      testimonial_role: proj.testimonial_role || ""
    });
  };

  const closeForm = () => {
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: projectForm.title,
        slug: projectForm.slug,
        client: projectForm.client,
        project_date: projectForm.project_date,
        description: projectForm.description,
        cover_image_url: projectForm.cover_image_url,
        banner_image_url: projectForm.banner_image_url,
        video_url: projectForm.video_url,
        creative_process: projectForm.creative_process,
        challenges: projectForm.challenges,
        final_result: projectForm.final_result,
        is_featured: projectForm.is_featured,
        featured_order: projectForm.featured_order,
        category_id: projectForm.category_id || null,
        technologies: projectForm.technologies.split(",").map((t: string) => t.trim()).filter(Boolean),
        testimonial_quote: projectForm.testimonial_quote || null,
        testimonial_author: projectForm.testimonial_author || null,
        testimonial_role: projectForm.testimonial_role || null,
      };

      if (isAddingProject) {
        await createProject(payload as any);
        showToast("Project created successfully");
      } else {
        await updateProject(projectForm.id, payload);
        showToast("Project updated successfully");
      }
      closeForm();
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingProject ? "create" : "update") + " project: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      showToast("Project deleted successfully");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete project: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Projects Database</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Add or modify case studies</p>
        </div>
        {!isAddingProject && !editingProject && (
          <Button
            onClick={startAddProject}
            className="text-[10px] font-bold uppercase tracking-widest"
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </Button>
        )}
      </div>

      {/* Listing Projects */}
      {!isAddingProject && !editingProject && (
        <div className="border divide-y">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center justify-between p-4 group hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={proj.cover_image_url || ""}
                  alt={proj.title}
                  className="w-16 h-12 object-cover border"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-sm tracking-tight">{proj.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {proj.client} — {proj.project_date}
                    {proj.is_featured && <Badge variant="secondary" className="ml-2.5 text-[9px] font-bold font-sans">FEATURED</Badge>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => startEditProject(proj)}
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteProject(proj.id)}
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form */}
      {(isAddingProject || editingProject) && (
        <form onSubmit={handleSaveProject} className="space-y-6 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              {isAddingProject ? "CREATE NEW CASE STUDY" : `EDITING: ${projectForm.title}`}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeForm}
              className="text-xs text-muted-foreground font-mono uppercase"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelCls}>Project Title</Label>
              <Input
                type="text" required
                value={projectForm.title}
                onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Project Slug (URL ID)</Label>
              <Input
                type="text" required
                value={projectForm.slug}
                onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelCls}>Client / Company Name</Label>
              <Input
                type="text" required
                value={projectForm.client}
                onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Project Date / Year</Label>
              <Input
                type="text" required
                value={projectForm.project_date}
                onChange={e => setProjectForm({ ...projectForm, project_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Category Folder</Label>
              <select
                value={projectForm.category_id}
                onChange={e => setProjectForm({ ...projectForm, category_id: e.target.value })}
                className="w-full h-9 px-3 border bg-transparent text-sm focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelCls}>Cover Image URL</Label>
              <div className="flex gap-2">
                <Input
                  type="text" required
                  className="flex-1"
                  value={projectForm.cover_image_url}
                  onChange={e => setProjectForm({ ...projectForm, cover_image_url: e.target.value })}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                      (url) => { setUploadError(null); setProjectForm((prev: any) => ({ ...prev, cover_image_url: url })); },
                      (err) => { setUploadError('Cover image upload failed: ' + err); }
                    );
                  }}
                >
                  Upload
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Banner Image URL (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  className="flex-1"
                  value={projectForm.banner_image_url}
                  onChange={e => setProjectForm({ ...projectForm, banner_image_url: e.target.value })}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                      (url) => { setUploadError(null); setProjectForm((prev: any) => ({ ...prev, banner_image_url: url })); },
                      (err) => { setUploadError('Banner image upload failed: ' + err); }
                    );
                  }}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
          {uploadError && (
            <div className="flex items-center gap-2 text-destructive text-xs font-mono mt-1">
              <CircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label className={labelCls}>Video Embed URL (Optional — plain YouTube URL, not Cloudinary)</Label>
            <Input
              type="text"
              value={projectForm.video_url}
              onChange={e => setProjectForm({ ...projectForm, video_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Technologies (comma-separated, e.g. FIGMA, PREMIERE, VIDEO)</Label>
            <Input
              type="text"
              value={projectForm.technologies}
              onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
              placeholder="BRANDING, PACKAGING, ADOBE CC"
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Intro Description Summary</Label>
            <Textarea
              rows={2} required
              value={projectForm.description}
              onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed">
            <div className="space-y-2">
              <Label className={labelCls}>Creative Process (Solution)</Label>
              <Textarea
                rows={4}
                value={projectForm.creative_process}
                onChange={e => setProjectForm({ ...projectForm, creative_process: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Key Challenges Faced</Label>
              <Textarea
                rows={4}
                value={projectForm.challenges}
                onChange={e => setProjectForm({ ...projectForm, challenges: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Final Results &amp; Impact</Label>
              <Textarea
                rows={4}
                value={projectForm.final_result}
                onChange={e => setProjectForm({ ...projectForm, final_result: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-dashed space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Client Testimonial (Optional)</h4>
            <div className="space-y-2">
              <Label className={labelCls}>Testimonial Quote</Label>
              <Textarea
                rows={2}
                value={projectForm.testimonial_quote}
                onChange={e => setProjectForm({ ...projectForm, testimonial_quote: e.target.value })}
                placeholder="e.g. Samuel's geometric precision completely redefined our presence. He brought a rare level of craft and vision..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={labelCls}>Testimonial Author Name</Label>
                <Input
                  type="text"
                  value={projectForm.testimonial_author}
                  onChange={e => setProjectForm({ ...projectForm, testimonial_author: e.target.value })}
                  placeholder="e.g. Dr. Helena Vanta"
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Testimonial Author Role / Position</Label>
                <Input
                  type="text"
                  value={projectForm.testimonial_role}
                  onChange={e => setProjectForm({ ...projectForm, testimonial_role: e.target.value })}
                  placeholder="e.g. Founder & Creative Director, Vanta Skin"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 border">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={projectForm.is_featured}
                onChange={e => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-primary"
              />
              <Label htmlFor="is_featured" className="text-xs uppercase font-mono cursor-pointer font-bold select-none">Feature on Homepage</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-[10px] uppercase font-mono font-bold">Display Order:</Label>
              <Input
                type="number"
                value={projectForm.featured_order}
                onChange={e => setProjectForm({ ...projectForm, featured_order: parseInt(e.target.value) || 1 })}
                className="w-16 h-8 px-1 text-center font-mono"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={submitting}
              className="px-6 py-5 text-xs font-bold uppercase tracking-widest"
            >
              {submitting ? "SAVING..." : "SAVE CASE STUDY"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeForm}
              className="px-6 py-5 text-xs font-bold uppercase tracking-widest"
            >
              CANCEL
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
