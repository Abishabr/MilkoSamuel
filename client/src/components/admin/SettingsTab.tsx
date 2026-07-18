import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { updateSettings } from "../../lib/api";
import { Save, CircleAlert } from "lucide-react";
import { openCloudinaryUpload, AdminTabProps } from "./cloudinaryUpload";

export default function SettingsTab({ showToast, showWriteError }: AdminTabProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, refetch } = useData();

  const [settingsForm, setSettingsForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateSettings(settingsForm);
      await refetch();
      showToast("Global Settings updated successfully");
    } catch (e: any) {
      showWriteError("Failed to update settings: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Global Settings</h2>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Main settings single database row</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Website Title</label>
            <input
              type="text"
              value={settingsForm.website_title || ""}
              onChange={e => setSettingsForm({ ...settingsForm, website_title: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Website Logo Text</label>
            <input
              type="text"
              value={settingsForm.logo || ""}
              onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Hero Section Heading Text</label>
          <textarea
            rows={3}
            value={settingsForm.hero_text || ""}
            onChange={e => setSettingsForm({ ...settingsForm, hero_text: e.target.value })}
            className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Biography Story Paragraph</label>
          <textarea
            rows={4}
            value={settingsForm.biography || ""}
            onChange={e => setSettingsForm({ ...settingsForm, biography: e.target.value })}
            className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Profile Picture URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settingsForm.profile_picture_url || ""}
                onChange={e => setSettingsForm({ ...settingsForm, profile_picture_url: e.target.value })}
                className={`flex-1 p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  openCloudinaryUpload(
                    { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                    (url) => { setUploadError(null); setSettingsForm((prev: any) => ({ ...prev, profile_picture_url: url })); },
                    (err) => { setUploadError('Profile picture upload failed: ' + err); showWriteError('Profile picture upload failed: ' + err); }
                  );
                }}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border flex-shrink-0 cursor-pointer transition-all ${isLight ? "bg-black text-white border-black hover:bg-zinc-800" : "bg-white text-black border-white hover:bg-zinc-200"}`}
              >
                Upload Image
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Resume / CV Document URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settingsForm.resume_url || ""}
                onChange={e => setSettingsForm({ ...settingsForm, resume_url: e.target.value })}
                className={`flex-1 p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  openCloudinaryUpload(
                    { resourceType: 'raw', acceptedFormats: ['pdf'] },
                    (url) => { setUploadError(null); setSettingsForm((prev: any) => ({ ...prev, resume_url: url })); },
                    (err) => { setUploadError('Resume upload failed: ' + err); showWriteError('Resume upload failed: ' + err); }
                  );
                }}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border flex-shrink-0 cursor-pointer transition-all ${isLight ? "bg-black text-white border-black hover:bg-zinc-800" : "bg-white text-black border-white hover:bg-zinc-200"}`}
              >
                Upload PDF
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

        <div className="pt-4 border-t border-dashed border-white/10">
          <h3 className="text-sm font-extrabold uppercase mb-4 tracking-wider">Metrics &amp; Statistics Counter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Years of Experience</label>
              <input
                type="text"
                value={settingsForm.years_experience || ""}
                onChange={e => setSettingsForm({ ...settingsForm, years_experience: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Projects Completed</label>
              <input
                type="text"
                value={settingsForm.projects_completed || ""}
                onChange={e => setSettingsForm({ ...settingsForm, projects_completed: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Happy Clients</label>
              <input
                type="text"
                value={settingsForm.happy_clients || ""}
                onChange={e => setSettingsForm({ ...settingsForm, happy_clients: e.target.value })}
                className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-white/10">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Footer Text</label>
            <input
              type="text"
              value={settingsForm.footer_text || ""}
              onChange={e => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Theme Base Color</label>
            <input
              type="text"
              value={settingsForm.theme_color || ""}
              onChange={e => setSettingsForm({ ...settingsForm, theme_color: e.target.value })}
              placeholder="#000000"
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`px-8 py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 border ${
            isLight
              ? "bg-black text-white hover:bg-zinc-800 border-black"
              : "bg-white text-black hover:bg-zinc-100 border-white"
          } active:scale-95 disabled:opacity-50`}
        >
          <Save className="w-4 h-4" />
          {submitting ? "SAVING SETTINGS..." : "SAVE SITE SETTINGS"}
        </button>
      </form>
    </div>
  );
}
