export type TechStack =
  | 'React Native'
  | 'Expo'
  | 'Next.js'
  | 'TypeScript'
  | 'JavaScript'
  | 'Node.js'
  | 'Python'
  | 'PostgreSQL'
  | 'Firebase'
  | 'Supabase'
  | 'AWS'
  | 'Docker'
  | 'GraphQL'
  | 'REST API'
  | 'Tailwind CSS'
  | 'Redux'
  | 'React Query'
  | 'Stripe'
  | 'Socket.io'
  | 'Kubernetes';

export type ProjectCategory =
  | 'Mobile App'
  | 'Web App'
  | 'Full Stack'
  | 'Open Source'
  | 'SaaS'
  | 'E-Commerce'
  | 'AI/ML';

export type ProjectStatus = 'In Production' | 'Beta' | 'Development' | 'Archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  techStack: TechStack[];
  image: string;
  images?: string[]; // Additional screenshots
  liveUrl?: string;
  githubUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  highlights?: string[];
  metrics?: ProjectMetric[];
  collaborators?: Collaborator[];
  testimonial?: Testimonial;
}

export interface ProjectMetric {
  label: string;
  value: string | number;
  change?: string; // e.g., "+25%"
}

export interface Collaborator {
  name: string;
  role: string;
  avatar?: string;
  linkedIn?: string;
}

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  yearsOfExperience: number;
  icon?: string; // Icon name or emoji
  certifications?: Certification[];
}

export type SkillCategory =
  | 'Frontend'
  | 'Mobile'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Tools'
  | 'Design';

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  location: string;
  remote: boolean;
  startDate: string;
  endDate?: string; // undefined means current
  description: string;
  achievements: string[];
  techStack: TechStack[];
  logo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
  relevantCourses?: string[];
}

export interface SocialLink {
  platform:
    | 'GitHub'
    | 'LinkedIn'
    | 'Twitter'
    | 'Dribbble'
    | 'Medium'
    | 'Dev.to'
    | 'YouTube'
    | 'Instagram';
  url: string;
  username: string;
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  avatar: string;
  resume: string; // URL to resume PDF
  availability: 'Available' | 'Busy' | 'Not Available';
  preferredContact: 'Email' | 'LinkedIn' | 'Twitter';
  languages: string[];
}
