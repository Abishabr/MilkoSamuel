import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../lib/api";

interface DataContextType {
  settings: any;
  projects: any[];
  categories: any[];
  services: any[];
  skills: any[];
  experiences: any[];
  socialLinks: any[];
  processSteps: any[];
  philosophyItems: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  submitContactMessage: (msg: any) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [philosophyItems, setPhilosophyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        settingsRes,
        projectsRes,
        categoriesRes,
        servicesRes,
        skillsRes,
        experiencesRes,
        socialLinksRes,
        processStepsRes,
        philosophyItemsRes
      ] = await Promise.allSettled([
        api.getSettings(),
        api.projects.list(),
        api.categories.list(),
        api.services.list(),
        api.skills.list(),
        api.experiences.list(),
        api.socialLinks.list(),
        api.processSteps.list(),
        api.philosophyItems.list()
      ]);

      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);
      if (projectsRes.status === "fulfilled") setProjects(projectsRes.value);
      if (categoriesRes.status === "fulfilled") setCategories(categoriesRes.value);
      if (servicesRes.status === "fulfilled") setServices(servicesRes.value);
      if (skillsRes.status === "fulfilled") setSkills(skillsRes.value);
      if (experiencesRes.status === "fulfilled") setExperiences(experiencesRes.value);
      if (socialLinksRes.status === "fulfilled") setSocialLinks(socialLinksRes.value);
      if (processStepsRes.status === "fulfilled") setProcessSteps(processStepsRes.value);
      if (philosophyItemsRes.status === "fulfilled") setPhilosophyItems(philosophyItemsRes.value);

      setError(null);
    } catch (e: any) {
      console.error("Failed to fetch full dynamic data suite:", e);
      setError("Failed to synchronize with server. Falling back to secure offline content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitContactMessage = async (msg: any) => {
    return api.messages.create(msg);
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        projects,
        categories,
        services,
        skills,
        experiences,
        socialLinks,
        processSteps,
        philosophyItems,
        loading,
        error,
        refetch: fetchData,
        submitContactMessage
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
