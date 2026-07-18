import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { createProject, updateProject, deleteProject } from "../../lib/api";
import { Plus, Trash2, Edit2, CircleAlert } from "lucide-react";
import { openCloudinaryUpload, AdminTabProps } from "./cloudinaryUpload";

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
  const { theme } = useTheme();
  const isLight = theme === "light";
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
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Add or modify case studies</p>
        </div>
        {!isAddingProject && !editingProject && (
          <button
            onClick={startAddProject}
            className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border cursor-pointer transition-all ${
              isLight
                ? "bg-black text-white border-black hover:bg-zinc-800"
                : "bg-white text-black border-white hover:bg-zinc-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        )}
      </div>

      {/* Listing Projects */}
      {!isAddingProject && !editingProject && (
        <div className="border border-white/5 divide-y divide-white/5">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center justify-between p-4 group hover:bg-zinc-50/5 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={proj.cover_image_url || ""}
                  alt={proj.title}
                  className="w-16 h-12 object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-sm tracking-tight">{proj.title}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {proj.client} — {proj.project_date}
                    {proj.is_featured && <span className="ml-2.5 text-[9px] bg-yellow-400/20 text-yellow-500 px-1.5 py-0.5 rounded font-bold font-sans">FEATURED</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEditProject(proj)}
                  className="p-2 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="p-2 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-500 cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form */}
      {(isAddingProject || editingProject) && (
        <form onSubmit={handleSaveProject} className="space-y-6 pt-4 border-t border-dashed border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-yellow-500">
              {isAddingProject ? "CREATE NEW CASE STUDY" : `EDITING: ${projectForm.title}`}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-xs text-gray-500 hover:text-white font-mono uppercase"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Title</label>
              <input
                type="text" required
                value={projectForm.title}
                onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Slug (URL ID)</label>
              <input
                type="text" required
                value={projectForm.slug}
                onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Client / Company Name</label>
              <input
                type="text" required
                value={projectForm.client}
                onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Project Date / Year</label>
              <input
                type="text" required
                value={projectForm.project_date}
                onChange={e => setProjectForm({ ...projectForm, project_date: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Folder</label>
              <select
                value={projectForm.category_id}
                onChange={e => setProjectForm({ ...projectForm, category_id: e.target.value })}
                className={`w-full p-3.5 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text" required
                  value={projectForm.cover_image_url}
                  onChange={e => setProjectForm({ ...projectForm, cover_image_url: e.target.value })}
                  className={`flex-1 p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                      (url) => { setUploadError(null); setProjectForm((prev: any) => ({ ...prev, cover_image_url: url })); },
                      (err) => { setUploadError('Cover image upload failed: ' + err); }
                    );
                  }}
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border flex-shrink-0 cursor-pointer transition-all ${isLight ? "bg-black text-white border-black hover:bg-zinc-800" : "bg-white text-black border-white hover:bg-zinc-200"}`}
                >
                  Upload
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Banner Image URL (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectForm.banner_image_url}
                  onChange={e => setProjectForm({ ...projectForm, banner_image_url: e.target.value })}
                  className={`flex-1 p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                      (url) => { setUploadError(null); setProjectForm((prev: any) => ({ ...prev, banner_image_url: url })); },
                      (err) => { setUploadError('Banner image upload failed: ' + err); }
                    );
                  }}
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border flex-shrink-0 cursor-pointer transition-all ${isLight ? "bg-black text-white border-black hover:bg-zinc-800" : "bg-white text-black border-white hover:bg-zinc-200"}`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
          {uploadError && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-mono mt-1">
              <CircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Video Embed URL (Optional — plain YouTube URL, not Cloudinary)</label>
            <input
              type="text"
              value={projectForm.video_url}
              onChange={e => setProjectForm({ ...projectForm, video_url: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Technologies (comma-separated, e.g. FIGMA, PREMIERE, VIDEO)</label>
            <input
              type="text"
              value={projectForm.technologies}
              onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
              placeholder="BRANDING, PACKAGING, ADOBE CC"
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Intro Description Summary</label>
            <textarea
              rows={2} required
              value={projectForm.description}
              onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed border-white/10">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Creative Process (Solution)</label>
              <textarea
                rows={4}
                value={projectForm.creative_process}
                onChange={e => setProjectForm({ ...projectForm, creative_process: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Key Challenges Faced</label>
              <textarea
                rows={4}
                value={projectForm.challenges}
                onChange={e => setProjectForm({ ...projectForm, challenges: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Final Results &amp; Impact</label>
              <textarea
                rows={4}
                value={projectForm.final_result}
                onChange={e => setProjectForm({ ...projectForm, final_result: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-white/10 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Client Testimonial (Optional)</h4>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Quote</label>
              <textarea
                rows={2}
                value={projectForm.testimonial_quote}
                onChange={e => setProjectForm({ ...projectForm, testimonial_quote: e.target.value })}
                placeholder="e.g. Samuel's geometric precision completely redefined our presence. He brought a rare level of craft and vision..."
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Author Name</label>
                <input
                  type="text"
                  value={projectForm.testimonial_author}
                  onChange={e => setProjectForm({ ...projectForm, testimonial_author: e.target.value })}
                  placeholder="e.g. Dr. Helena Vanta"
                  className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Testimonial Author Role / Position</label>
                <input
                  type="text"
                  value={projectForm.testimonial_role}
                  onChange={e => setProjectForm({ ...projectForm, testimonial_role: e.target.value })}
                  placeholder="e.g. Founder & Creative Director, Vanta Skin"
                  className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 border border-white/5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={projectForm.is_featured}
                onChange={e => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                className="w-4 h-4 rounded-none cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-xs uppercase font-mono cursor-pointer font-bold select-none">Feature on Homepage</label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] uppercase font-mono font-bold">Display Order:</label>
              <input
                type="number"
                value={projectForm.featured_order}
                onChange={e => setProjectForm({ ...projectForm, featured_order: parseInt(e.target.value) || 1 })}
                className={`w-16 p-1 border text-center font-mono ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                isLight ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {submitting ? "SAVING..." : "SAVE CASE STUDY"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all cursor-pointer`}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
