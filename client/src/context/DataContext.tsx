import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getSettings,
  getCategories,
  getProjects,
  getAllProjectImages,
  getServices,
  getSkills,
  getExperiences,
  getSocialLinks,
  getProcessSteps,
  getPhilosophyItems,
} from "../lib/api";
import type {
  Settings,
  Category,
  Project,
  ProjectImage,
  Service,
  Skill,
  Experience,
  SocialLink,
  ProcessStep,
  PhilosophyItem,
} from "../types";

interface DataContextType {
  settings: Settings | null;
  projects: Project[];
  categories: Category[];
  projectImages: ProjectImage[];
  services: Service[];
  skills: Skill[];
  experiences: Experience[];
  socialLinks: SocialLink[];
  processSteps: ProcessStep[];
  philosophyItems: PhilosophyItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [philosophyItems, setPhilosophyItems] = useState<PhilosophyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);

    const [
      settingsRes,
      categoriesRes,
      projectsRes,
      projectImagesRes,
      servicesRes,
      skillsRes,
      experiencesRes,
      socialLinksRes,
      processStepsRes,
      philosophyItemsRes,
    ] = await Promise.allSettled([
      getSettings(),
      getCategories(),
      getProjects(),
      getAllProjectImages(),
      getServices(),
      getSkills(),
      getExperiences(),
      getSocialLinks(),
      getProcessSteps(),
      getPhilosophyItems(),
    ]);

    const errors: string[] = [];

    if (settingsRes.status === "fulfilled") {
      setSettings(settingsRes.value);
      // Keep the browser tab title in sync with the admin-configured site title
      if (settingsRes.value?.website_title) {
        document.title = settingsRes.value.website_title;
      }
    } else {
      errors.push(`Failed to load settings: ${settingsRes.reason?.message ?? settingsRes.reason}`);
    }

    if (categoriesRes.status === "fulfilled") {
      setCategories(categoriesRes.value);
    } else {
      errors.push(`Failed to load categories: ${categoriesRes.reason?.message ?? categoriesRes.reason}`);
    }

    if (projectsRes.status === "fulfilled") {
      setProjects(projectsRes.value);
    } else {
      errors.push(`Failed to load projects: ${projectsRes.reason?.message ?? projectsRes.reason}`);
    }

    if (projectImagesRes.status === "fulfilled") {
      setProjectImages(projectImagesRes.value);
    } else {
      errors.push(`Failed to load project_images: ${projectImagesRes.reason?.message ?? projectImagesRes.reason}`);
    }

    if (servicesRes.status === "fulfilled") {
      setServices(servicesRes.value);
    } else {
      errors.push(`Failed to load services: ${servicesRes.reason?.message ?? servicesRes.reason}`);
    }

    if (skillsRes.status === "fulfilled") {
      setSkills(skillsRes.value);
    } else {
      errors.push(`Failed to load skills: ${skillsRes.reason?.message ?? skillsRes.reason}`);
    }

    if (experiencesRes.status === "fulfilled") {
      setExperiences(experiencesRes.value);
    } else {
      errors.push(`Failed to load experiences: ${experiencesRes.reason?.message ?? experiencesRes.reason}`);
    }

    if (socialLinksRes.status === "fulfilled") {
      setSocialLinks(socialLinksRes.value);
    } else {
      errors.push(`Failed to load social_links: ${socialLinksRes.reason?.message ?? socialLinksRes.reason}`);
    }

    if (processStepsRes.status === "fulfilled") {
      setProcessSteps(processStepsRes.value);
    } else {
      errors.push(`Failed to load process_steps: ${processStepsRes.reason?.message ?? processStepsRes.reason}`);
    }

    if (philosophyItemsRes.status === "fulfilled") {
      setPhilosophyItems(philosophyItemsRes.value);
    } else {
      errors.push(`Failed to load philosophy_items: ${philosophyItemsRes.reason?.message ?? philosophyItemsRes.reason}`);
    }

    setError(errors.length > 0 ? errors.join("\n") : null);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        settings,
        projects,
        categories,
        projectImages,
        services,
        skills,
        experiences,
        socialLinks,
        processSteps,
        philosophyItems,
        loading,
        error,
        refetch: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
