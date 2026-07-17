export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  duration: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SoftwareItem {
  name: string;
  iconName: string;
}
