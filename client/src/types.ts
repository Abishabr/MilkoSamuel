export interface Settings {
  id: string;
  website_title: string;
  logo: string;
  theme_color: string;
  footer_text: string;
  biography: string;
  hero_text: string;
  profile_picture_url: string | null;
  resume_url: string | null;
  years_experience: string;
  projects_completed: string;
  happy_clients: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  project_date: string | null;
  description: string | null;
  technologies: string[];
  cover_image_url: string | null;
  banner_image_url: string | null;
  video_url: string | null;
  creative_process: string | null;
  challenges: string | null;
  final_result: string | null;
  is_featured: boolean;
  featured_order: number | null;
  category_id: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_role: string | null;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  icon: string;
  display_order: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  display_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  display_order: number;
}

export interface PhilosophyItem {
  id: string;
  title: string;
  description: string;
  display_order: number;
}
