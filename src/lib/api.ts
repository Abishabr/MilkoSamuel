import { Project, Service, ProcessStep, Stat } from "../types";
import * as fallbackData from "../data";

// In our full-stack environment, API requests go to relative paths since both reside on the same server/port.
const API_BASE = "";

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // --- SETTINGS ---
  async getSettings() {
    try {
      return await fetchJson(`${API_BASE}/api/settings`);
    } catch (e) {
      console.warn("API: falling back to static settings", e);
      return {
        websiteTitle: "Samuel Milko | Portfolio",
        logo: "SAMUEL MILKO",
        favicon: "",
        themeColor: "#000000",
        footerText: "© 2026 Samuel Milko. All Rights Reserved.",
        biography: "I am Samuel Milko, a multidisciplinary graphic designer and digital visual director based in Addis Ababa, Ethiopia, specializing in high-fidelity experiences that bridge raw human intuition and mathematical precision.",
        heroText: "I create eye-catching designs and engaging videos that combine creativity and strategy to help brands stand out and connect with their audience.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy",
        resumeUrl: "",
        yearsExperience: "12+",
        projectsCompleted: "240",
        happyClients: "185"
      };
    }
  },

  async updateSettings(settings: any) {
    return fetchJson(`${API_BASE}/api/settings`, {
      method: "PUT",
      body: JSON.stringify(settings)
    });
  },

  // --- CRUD HELPERS FOR REUSABILITY ---
  crud(resource: string) {
    return {
      async list(): Promise<any[]> {
        try {
          return await fetchJson(`${API_BASE}/api/${resource}`);
        } catch (e) {
          console.warn(`API: falling back to static list for ${resource}`, e);
          // Fallback mappings
          if (resource === "projects") return fallbackData.projects;
          if (resource === "services") return fallbackData.services;
          if (resource === "process_steps") return fallbackData.processSteps;
          if (resource === "skills") {
            return [
              { id: "1", name: "Graphic Design", percentage: 98, icon: "Paintbrush", order: 1 },
              { id: "2", name: "Video Editing", percentage: 96, icon: "Video", order: 2 },
              { id: "3", name: "Brand Identity Design", percentage: 94, icon: "Award", order: 3 },
              { id: "4", name: "Motion Graphics", percentage: 92, icon: "Zap", order: 4 },
              { id: "5", name: "Adobe Creative Suite", percentage: 97, icon: "Cpu", order: 5 }
            ];
          }
          if (resource === "philosophy_items") {
            return [
              { id: "phil-1", title: "Clarity", description: "Simplicity is not minimalism. It is making the complex feel entirely effortless and transparent.", order: 1 },
              { id: "phil-2", title: "Function", description: "Design must serve a strategic purpose first, removing friction and guiding user interaction naturally.", order: 2 },
              { id: "phil-3", title: "Impact", description: "Great design leaves an indelible, lasting visual memory and drives measurable growth and outcomes.", order: 3 }
            ];
          }
          if (resource === "social_links") {
            return [
              { id: "soc-1", platform: "Telegram", url: "https://t.me/milkosamuel470" },
              { id: "soc-2", platform: "WhatsApp", url: "https://wa.me/251902782218" }
            ];
          }
          if (resource === "experiences") {
            return [
              { id: "exp-1", company: "Aura Creative Studio", position: "Lead Digital Visual Director", description: "Directed brand communication and package architectures for global luxury brands.", startDate: "2022", endDate: "Present", order: 1 },
              { id: "exp-2", company: "Prime Motion Co.", position: "Senior Graphic Designer & Video Editor", description: "Edited commercial campaigns and structured promotional digital identity elements.", startDate: "2019", endDate: "2022", order: 2 }
            ];
          }
          return [];
        }
      },

      async create(data: any): Promise<any> {
        return fetchJson(`${API_BASE}/api/${resource}`, {
          method: "POST",
          body: JSON.stringify(data)
        });
      },

      async update(id: string, data: any): Promise<any> {
        return fetchJson(`${API_BASE}/api/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(data)
        });
      },

      async delete(id: string): Promise<any> {
        return fetchJson(`${API_BASE}/api/${resource}/${id}`, {
          method: "DELETE"
        });
      }
    };
  },

  // --- SHORTCUTS ---
  projects: {
    list: () => api.crud("projects").list(),
    create: (data: any) => api.crud("projects").create(data),
    update: (id: string, data: any) => api.crud("projects").update(id, data),
    delete: (id: string) => api.crud("projects").delete(id)
  },
  categories: {
    list: () => api.crud("categories").list(),
    create: (data: any) => api.crud("categories").create(data),
    update: (id: string, data: any) => api.crud("categories").update(id, data),
    delete: (id: string) => api.crud("categories").delete(id)
  },
  services: {
    list: () => api.crud("services").list(),
    create: (data: any) => api.crud("services").create(data),
    update: (id: string, data: any) => api.crud("services").update(id, data),
    delete: (id: string) => api.crud("services").delete(id)
  },
  skills: {
    list: () => api.crud("skills").list(),
    create: (data: any) => api.crud("skills").create(data),
    update: (id: string, data: any) => api.crud("skills").update(id, data),
    delete: (id: string) => api.crud("skills").delete(id)
  },
  experiences: {
    list: () => api.crud("experiences").list(),
    create: (data: any) => api.crud("experiences").create(data),
    update: (id: string, data: any) => api.crud("experiences").update(id, data),
    delete: (id: string) => api.crud("experiences").delete(id)
  },
  messages: {
    list: () => api.crud("messages").list(),
    create: (data: any) => api.crud("messages").create(data),
    update: (id: string, data: any) => api.crud("messages").update(id, data),
    delete: (id: string) => api.crud("messages").delete(id)
  },
  socialLinks: {
    list: () => api.crud("social_links").list(),
    create: (data: any) => api.crud("social_links").create(data),
    update: (id: string, data: any) => api.crud("social_links").update(id, data),
    delete: (id: string) => api.crud("social_links").delete(id)
  },
  processSteps: {
    list: () => api.crud("process_steps").list(),
    create: (data: any) => api.crud("process_steps").create(data),
    update: (id: string, data: any) => api.crud("process_steps").update(id, data),
    delete: (id: string) => api.crud("process_steps").delete(id)
  },
  philosophyItems: {
    list: () => api.crud("philosophy_items").list(),
    create: (data: any) => api.crud("philosophy_items").create(data),
    update: (id: string, data: any) => api.crud("philosophy_items").update(id, data),
    delete: (id: string) => api.crud("philosophy_items").delete(id)
  },
  projectImages: {
    list: () => api.crud("project_images").list(),
    create: (data: any) => api.crud("project_images").create(data),
    update: (id: string, data: any) => api.crud("project_images").update(id, data),
    delete: (id: string) => api.crud("project_images").delete(id)
  },

  // --- AUTH ---
  async login(credentials: any) {
    return fetchJson(`${API_BASE}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  }
};
