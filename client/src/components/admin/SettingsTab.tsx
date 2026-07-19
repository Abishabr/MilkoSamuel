import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { updateSettings } from "../../lib/api";
import { Save, CircleAlert, Upload } from "lucide-react";
import { openCloudinaryUpload, AdminTabProps } from "./cloudinaryUpload";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";

const labelCls = "text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground";

export default function SettingsTab({ showToast, showWriteError }: AdminTabProps) {
  const { settings, projects, refetch } = useData();

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
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={labelCls}>Website Title</Label>
            <Input
              type="text"
              value={settingsForm.website_title || ""}
              onChange={e => setSettingsForm({ ...settingsForm, website_title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelCls}>Website Logo Text</Label>
            <Input
              type="text"
              value={settingsForm.logo || ""}
              onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Hero Section Heading Text</Label>
          <Textarea
            rows={3}
            value={settingsForm.hero_text || ""}
            onChange={e => setSettingsForm({ ...settingsForm, hero_text: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Biography Story Paragraph</Label>
          <Textarea
            rows={4}
            value={settingsForm.biography || ""}
            onChange={e => setSettingsForm({ ...settingsForm, biography: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={labelCls}>Profile Picture URL</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                value={settingsForm.profile_picture_url || ""}
                onChange={e => setSettingsForm({ ...settingsForm, profile_picture_url: e.target.value })}
              />
              <Button
                type="button"
                variant="secondary"
                className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                onClick={() => {
                  setUploadError(null);
                  openCloudinaryUpload(
                    { resourceType: 'image', acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'svg'] },
                    (url) => { setUploadError(null); setSettingsForm((prev: any) => ({ ...prev, profile_picture_url: url })); },
                    (err) => { setUploadError('Profile picture upload failed: ' + err); showWriteError('Profile picture upload failed: ' + err); }
                  );
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Image
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className={labelCls}>Resume / CV Document URL</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                value={settingsForm.resume_url || ""}
                onChange={e => setSettingsForm({ ...settingsForm, resume_url: e.target.value })}
              />
              <Button
                type="button"
                variant="secondary"
                className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
                onClick={() => {
                  setUploadError(null);
                  openCloudinaryUpload(
                    { resourceType: 'raw', acceptedFormats: ['pdf'] },
                    (url) => { setUploadError(null); setSettingsForm((prev: any) => ({ ...prev, resume_url: url })); },
                    (err) => { setUploadError('Resume upload failed: ' + err); showWriteError('Resume upload failed: ' + err); }
                  );
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload PDF
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

        <Separator className="border-dashed" />

        <div>
          <h3 className="text-sm font-extrabold uppercase mb-4 tracking-wider">Metrics &amp; Statistics Counter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelCls}>Years of Experience</Label>
              <Input
                type="text"
                value={settingsForm.years_experience || ""}
                onChange={e => setSettingsForm({ ...settingsForm, years_experience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Projects Completed</Label>
              {/* Derived live from the database — the number of projects in the portfolio. */}
              <div className="w-full h-9 px-3 border bg-muted text-sm flex items-center justify-between">
                <span className="font-bold">{projects.length}</span>
                <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  Auto-counted
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Happy Clients</Label>
              <Input
                type="text"
                value={settingsForm.happy_clients || ""}
                onChange={e => setSettingsForm({ ...settingsForm, happy_clients: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Separator className="border-dashed" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={labelCls}>Footer Text</Label>
            <Input
              type="text"
              value={settingsForm.footer_text || ""}
              onChange={e => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelCls}>Theme Base Color</Label>
            <Input
              type="text"
              value={settingsForm.theme_color || ""}
              onChange={e => setSettingsForm({ ...settingsForm, theme_color: e.target.value })}
              placeholder="#000000"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="px-8 py-6 text-xs font-bold uppercase tracking-widest"
        >
          <Save className="w-4 h-4" />
          {submitting ? "SAVING SETTINGS..." : "SAVE SITE SETTINGS"}
        </Button>
      </form>
    </div>
  );
}
