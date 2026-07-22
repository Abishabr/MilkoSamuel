import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createProject, updateProject, deleteProject } from "../../lib/api";
import { Plus, Trash2, Edit2, CircleAlert, Loader2, ImageIcon, Film } from "lucide-react";
import { openCloudinaryUpload, AdminTabProps } from "./cloudinaryUpload";
import { resolveProjectCover } from "../../lib/youtube";
import { slugify } from "../../lib/slug";
import {
  VideoOrientation,
  DEFAULT_ORIENTATION,
  aspectRatioClass,
  orientationFromDimensions,
  detectVideoOrientation,
  orientationFromYouTubeUrl,
  isPlayableVideoFile,
  projectOrientation,
} from "../../lib/videoOrientation";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";

const labelCls = "text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground";

const orientationLabel: Record<VideoOrientation, string> = {
  landscape: "Landscape · 16:9",
  portrait: "Portrait · 9:16",
  square: "Square · 1:1",
};

interface ProjectForm {
  id: string;
  title: string;
  category_id: string;
  cover_image_url: string;
  video_url: string;
  video_orientation: VideoOrientation;
  description: string;
  is_featured: boolean;
  published: boolean;
  // preserved on edit so legacy case-study fields survive round-trips
  legacy: Record<string, unknown>;
}

const emptyForm: ProjectForm = {
  id: "",
  title: "",
  category_id: "",
  cover_image_url: "",
  video_url: "",
  video_orientation: DEFAULT_ORIENTATION,
  description: "",
  is_featured: false,
  published: true,
  legacy: {},
};

export default function ProjectsTab({ showToast, showWriteError }: AdminTabProps) {
  const { projects, categories, refetch } = useData();

  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detectingOrientation, setDetectingOrientation] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyForm);

  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setUploadError(null);
    setProjectForm({
      ...emptyForm,
      category_id: categories[0]?.id || "",
    });
  };

  const startEditProject = (proj: any) => {
    setEditingProject(proj);
    setIsAddingProject(false);
    setUploadError(null);
    setProjectForm({
      id: proj.id,
      title: proj.title || "",
      category_id: proj.category_id || "",
      cover_image_url: proj.cover_image_url || "",
      video_url: proj.video_url || "",
      video_orientation: projectOrientation(proj),
      description: proj.description || "",
      is_featured: !!proj.is_featured,
      published: proj.published !== false,
      legacy: {
        client: proj.client ?? null,
        project_date: proj.project_date ?? null,
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        banner_image_url: proj.banner_image_url ?? null,
        creative_process: proj.creative_process ?? null,
        challenges: proj.challenges ?? null,
        final_result: proj.final_result ?? null,
        featured_order: proj.featured_order ?? null,
        testimonial_quote: proj.testimonial_quote ?? null,
        testimonial_author: proj.testimonial_author ?? null,
        testimonial_role: proj.testimonial_role ?? null,
      },
    });
  };

  const closeForm = () => {
    setIsAddingProject(false);
    setEditingProject(null);
  };

  // Apply an uploaded video: record the URL and auto-detect its orientation
  // from the returned dimensions (falling back to a metadata probe).
  const applyVideoUpload = async (url: string, width?: number, height?: number) => {
    setProjectForm((prev) => ({ ...prev, video_url: url }));
    setDetectingOrientation(true);
    try {
      let orientation: VideoOrientation;
      if (width && height) {
        orientation = orientationFromDimensions(width, height);
      } else {
        orientation = await detectVideoOrientation(url);
      }
      setProjectForm((prev) => ({ ...prev, video_orientation: orientation }));
    } finally {
      setDetectingOrientation(false);
    }
  };

  // A pasted YouTube/URL string: detect orientation once the field settles.
  const applyVideoUrl = async (url: string) => {
    setProjectForm((prev) => ({ ...prev, video_url: url }));
    if (!url.trim()) return;
    const ytGuess = orientationFromYouTubeUrl(url);
    if (ytGuess) {
      setProjectForm((prev) => ({ ...prev, video_orientation: ytGuess }));
      return;
    }
    if (isPlayableVideoFile(url)) {
      setDetectingOrientation(true);
      try {
        const orientation = await detectVideoOrientation(url);
        setProjectForm((prev) => ({ ...prev, video_orientation: orientation }));
      } finally {
        setDetectingOrientation(false);
      }
    }
  };

  const persist = async (publishedOverride: boolean) => {
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...projectForm.legacy,
        title: projectForm.title,
        // slug omitted — the DB trigger generates it from the title
        description: projectForm.description,
        cover_image_url: projectForm.cover_image_url || null,
        video_url: projectForm.video_url || null,
        video_orientation: projectForm.video_orientation,
        is_featured: projectForm.is_featured,
        published: publishedOverride,
        category_id: projectForm.category_id || null,
      };

      if (isAddingProject) {
        await createProject(payload as any);
        showToast(publishedOverride ? "Project published" : "Draft saved");
      } else {
        await updateProject(projectForm.id, payload);
        showToast(publishedOverride ? "Project published" : "Draft saved");
      }
      closeForm();
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to save project: " + e.message);
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

  const slugPreview = slugify(projectForm.title) || "project";
  const orientation = projectForm.video_orientation;
  const previewCover = resolveProjectCover({
    cover_image_url: projectForm.cover_image_url || null,
    video_url: projectForm.video_url || null,
  });
  const showVideoPreview = isPlayableVideoFile(projectForm.video_url);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Projects Database</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Add or modify portfolio work</p>
        </div>
        {!isAddingProject && !editingProject && (
          <Button
            onClick={startAddProject}
            className="text-[10px] font-bold uppercase tracking-widest"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </Button>
        )}
      </div>

      {/* Listing Projects */}
      {!isAddingProject && !editingProject && (
        <div className="border divide-y">
          {projects.map((proj) => {
            const o = projectOrientation(proj);
            return (
              <div key={proj.id} className="flex items-center justify-between p-4 group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={resolveProjectCover(proj) ?? ""}
                    alt={proj.title}
                    className="w-16 h-12 object-cover border"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">{proj.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-2 flex-wrap">
                      <span>{categories.find((c) => c.id === proj.category_id)?.name || "Uncategorized"}</span>
                      <Badge variant="outline" className="text-[9px] font-bold font-mono uppercase">{o}</Badge>
                      {proj.is_featured && <Badge variant="secondary" className="text-[9px] font-bold font-sans">FEATURED</Badge>}
                      {proj.published === false && <Badge variant="outline" className="text-[9px] font-bold font-sans text-amber-600 border-amber-600/40">DRAFT</Badge>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon-sm" onClick={() => startEditProject(proj)} title="Edit Project">
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
            );
          })}
        </div>
      )}

      {/* Create/Edit Form */}
      {(isAddingProject || editingProject) && (
        <form onSubmit={(e) => { e.preventDefault(); persist(true); }} className="space-y-6 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              {isAddingProject ? "ADD PROJECT" : `EDITING: ${projectForm.title}`}
            </h3>
            <Button type="button" variant="ghost" size="sm" onClick={closeForm} className="text-xs text-muted-foreground font-mono uppercase">
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Project Title */}
            <div className="space-y-2">
              <Label className={labelCls}>Project Title</Label>
              <Input
                type="text" required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. Nexus Finance"
              />
              <p className="text-[10px] font-mono text-muted-foreground">
                Slug: <span className="text-foreground">/{slugPreview}</span> <span className="opacity-60">(auto-generated)</span>
              </p>
            </div>

            {/* 2. Category */}
            <div className="space-y-2">
              <Label className={labelCls}>Category</Label>
              <select
                value={projectForm.category_id}
                onChange={(e) => setProjectForm({ ...projectForm, category_id: e.target.value })}
                className="w-full h-9 px-3 border bg-transparent text-sm focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Thumbnail Upload */}
            <div className="space-y-2">
              <Label className={labelCls}>Thumbnail</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  className="flex-1"
                  placeholder="Upload an image or paste a URL"
                  value={projectForm.cover_image_url}
                  onChange={(e) => setProjectForm({ ...projectForm, cover_image_url: e.target.value })}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: "image", acceptedFormats: ["jpg", "png", "gif", "webp", "svg"] },
                      (url) => { setUploadError(null); setProjectForm((prev) => ({ ...prev, cover_image_url: url })); },
                      (err) => setUploadError("Thumbnail upload failed: " + err)
                    );
                  }}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Upload
                </Button>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">Optional — falls back to the video thumbnail.</p>
            </div>

            {/* 4. Video Upload */}
            <div className="space-y-2">
              <Label className={labelCls}>Video</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  className="flex-1"
                  placeholder="Upload a video or paste a YouTube URL"
                  value={projectForm.video_url}
                  onChange={(e) => applyVideoUrl(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                  onClick={() => {
                    setUploadError(null);
                    openCloudinaryUpload(
                      { resourceType: "video", acceptedFormats: ["mp4", "webm", "mov", "m4v", "ogv"] },
                      (url, meta) => { setUploadError(null); applyVideoUpload(url, meta?.width, meta?.height); },
                      (err) => setUploadError("Video upload failed: " + err)
                    );
                  }}
                >
                  <Film className="w-3.5 h-3.5" /> Upload
                </Button>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                {detectingOrientation ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Detecting orientation…</>
                ) : projectForm.video_url ? (
                  <>Orientation: <span className="text-foreground font-bold">{orientationLabel[orientation]}</span> <span className="opacity-60">(auto-detected)</span></>
                ) : (
                  <>Orientation is detected automatically after upload.</>
                )}
              </p>
            </div>
          </div>

          {/* Live aspect-ratio preview */}
          {(previewCover || showVideoPreview) && (
            <div className="space-y-2">
              <Label className={labelCls}>Preview ({orientation})</Label>
              <div className="flex justify-center border border-dashed p-6 bg-muted/30">
                <div
                  className={`relative overflow-hidden bg-black rounded-lg ${aspectRatioClass(orientation)} ${
                    orientation === "portrait" ? "h-72" : orientation === "square" ? "h-64" : "w-full max-w-xl"
                  }`}
                >
                  {showVideoPreview ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={projectForm.video_url}
                      muted loop playsInline autoPlay
                      poster={previewCover ?? undefined}
                    />
                  ) : (
                    <img
                      src={previewCover ?? ""}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 text-destructive text-xs font-mono">
              <CircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* 5. Description */}
          <div className="space-y-2">
            <Label className={labelCls}>Description</Label>
            <Textarea
              rows={3} required
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="A short summary of the project."
            />
          </div>

          {/* 6 & 7. Featured + Published toggles */}
          <div className="flex flex-wrap items-center gap-8 p-4 border">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={projectForm.is_featured}
                onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-primary"
              />
              <span className="text-xs uppercase font-mono font-bold">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={projectForm.published}
                onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-primary"
              />
              <span className="text-xs uppercase font-mono font-bold">Published</span>
            </label>
          </div>

          {/* Save Draft + Publish */}
          <div className="flex flex-wrap gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => persist(false)}
              className="px-6 py-5 text-xs font-bold uppercase tracking-widest"
            >
              {submitting ? "Saving…" : "Save Draft"}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="px-6 py-5 text-xs font-bold uppercase tracking-widest"
            >
              {submitting ? "Saving…" : "Publish Project"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
