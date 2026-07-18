import { supabase } from './supabase';
import type {
  Settings,
  Category,
  Project,
  ProjectImage,
  Service,
  Skill,
  Experience,
  Message,
  SocialLink,
  ProcessStep,
  PhilosophyItem,
} from '../types';

// Base URL resolution:
//  - Development: Vite proxies /api/* to the local Express server (vite.config.ts)
//  - Production (split hosting): set VITE_API_URL to the deployed API origin,
//    e.g. https://milkosamuel-api.onrender.com
const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`;

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Fetch wrapper for public (unauthenticated) requests. */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

/** Fetch wrapper for authenticated admin requests. Reads session from Supabase anon client. */
async function authFetch<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token ?? '';
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  // 204 No Content — DELETE responses have no body
  if (method === 'DELETE' && res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  return apiFetch<Settings>('/settings');
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  return authFetch<Settings>('/settings', 'PUT', data);
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  return authFetch<Category>('/categories', 'POST', data);
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return authFetch<Category>(`/categories/${id}`, 'PUT', data);
}

export async function deleteCategory(id: string): Promise<void> {
  return authFetch<void>(`/categories/${id}`, 'DELETE');
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/projects');
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  return authFetch<Project>('/projects', 'POST', data);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  return authFetch<Project>(`/projects/${id}`, 'PUT', data);
}

export async function deleteProject(id: string): Promise<void> {
  return authFetch<void>(`/projects/${id}`, 'DELETE');
}

// ── Project Images ────────────────────────────────────────────────────────────

export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  return apiFetch<ProjectImage[]>(`/projects/${projectId}/images`);
}

/**
 * Fetches all project images across every project.
 * Implemented by fetching all projects first, then requesting each project's
 * images in parallel and flattening the results.
 */
export async function getAllProjectImages(): Promise<ProjectImage[]> {
  const projects = await getProjects();
  const imageArrays = await Promise.all(
    projects.map((p) => getProjectImages(p.id)),
  );
  return imageArrays.flat();
}

export async function createProjectImage(
  data: Omit<ProjectImage, 'id'>,
): Promise<ProjectImage> {
  return authFetch<ProjectImage>(
    `/projects/${data.project_id}/images`,
    'POST',
    data,
  );
}

export async function updateProjectImage(
  id: string,
  data: Partial<ProjectImage>,
): Promise<ProjectImage> {
  return authFetch<ProjectImage>(`/project-images/${id}`, 'PUT', data);
}

export async function deleteProjectImage(id: string): Promise<void> {
  return authFetch<void>(`/project-images/${id}`, 'DELETE');
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services');
}

export async function createService(data: Omit<Service, 'id'>): Promise<Service> {
  return authFetch<Service>('/services', 'POST', data);
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  return authFetch<Service>(`/services/${id}`, 'PUT', data);
}

export async function deleteService(id: string): Promise<void> {
  return authFetch<void>(`/services/${id}`, 'DELETE');
}

// ── Skills ────────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  return apiFetch<Skill[]>('/skills');
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  return authFetch<Skill>('/skills', 'POST', data);
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  return authFetch<Skill>(`/skills/${id}`, 'PUT', data);
}

export async function deleteSkill(id: string): Promise<void> {
  return authFetch<void>(`/skills/${id}`, 'DELETE');
}

// ── Experiences ───────────────────────────────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  return apiFetch<Experience[]>('/experiences');
}

export async function createExperience(
  data: Omit<Experience, 'id'>,
): Promise<Experience> {
  return authFetch<Experience>('/experiences', 'POST', data);
}

export async function updateExperience(
  id: string,
  data: Partial<Experience>,
): Promise<Experience> {
  return authFetch<Experience>(`/experiences/${id}`, 'PUT', data);
}

export async function deleteExperience(id: string): Promise<void> {
  return authFetch<void>(`/experiences/${id}`, 'DELETE');
}

// ── Messages ──────────────────────────────────────────────────────────────────

/** Public: submits a contact form message via POST /api/messages. */
export async function createMessage(
  data: Pick<Message, 'name' | 'email' | 'subject' | 'message'>,
): Promise<Message> {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<Message>;
}

/** Admin-only: fetches all messages ordered by creation date (newest first). */
export async function getMessages(): Promise<Message[]> {
  return authFetch<Message[]>('/messages', 'GET');
}

export async function updateMessage(
  id: string,
  data: Partial<Message>,
): Promise<Message> {
  return authFetch<Message>(`/messages/${id}`, 'PUT', data);
}

export async function deleteMessage(id: string): Promise<void> {
  return authFetch<void>(`/messages/${id}`, 'DELETE');
}

// ── Social Links ──────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<SocialLink[]> {
  return apiFetch<SocialLink[]>('/social-links');
}

export async function createSocialLink(
  data: Omit<SocialLink, 'id'>,
): Promise<SocialLink> {
  return authFetch<SocialLink>('/social-links', 'POST', data);
}

export async function updateSocialLink(
  id: string,
  data: Partial<SocialLink>,
): Promise<SocialLink> {
  return authFetch<SocialLink>(`/social-links/${id}`, 'PUT', data);
}

export async function deleteSocialLink(id: string): Promise<void> {
  return authFetch<void>(`/social-links/${id}`, 'DELETE');
}

// ── Process Steps ─────────────────────────────────────────────────────────────

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return apiFetch<ProcessStep[]>('/process-steps');
}

export async function createProcessStep(
  data: Omit<ProcessStep, 'id'>,
): Promise<ProcessStep> {
  return authFetch<ProcessStep>('/process-steps', 'POST', data);
}

export async function updateProcessStep(
  id: string,
  data: Partial<ProcessStep>,
): Promise<ProcessStep> {
  return authFetch<ProcessStep>(`/process-steps/${id}`, 'PUT', data);
}

export async function deleteProcessStep(id: string): Promise<void> {
  return authFetch<void>(`/process-steps/${id}`, 'DELETE');
}

// ── Philosophy Items ──────────────────────────────────────────────────────────

export async function getPhilosophyItems(): Promise<PhilosophyItem[]> {
  return apiFetch<PhilosophyItem[]>('/philosophy-items');
}

export async function createPhilosophyItem(
  data: Omit<PhilosophyItem, 'id'>,
): Promise<PhilosophyItem> {
  return authFetch<PhilosophyItem>('/philosophy-items', 'POST', data);
}

export async function updatePhilosophyItem(
  id: string,
  data: Partial<PhilosophyItem>,
): Promise<PhilosophyItem> {
  return authFetch<PhilosophyItem>(`/philosophy-items/${id}`, 'PUT', data);
}

export async function deletePhilosophyItem(id: string): Promise<void> {
  return authFetch<void>(`/philosophy-items/${id}`, 'DELETE');
}
