// lib/data.ts

import type {
  Education,
  Experience,
  PersonalInfo,
  Project,
  ProjectCategory,
  Skill,
  SkillCategory,
  SocialLink,
} from '@/lib/types';

import { skills } from '@/lib/data/skills';
import { projects } from '@/lib/data/projects';
import { experience } from '@/lib/data/experience';

/**
 * Data Constants
 */

export const personalInfo: PersonalInfo = {
  name: 'Michael Dadi',
  title: 'Senior Software Engineer',
  tagline: 'React Native & Full Stack Developer',
  bio: `Passionate software engineer with expertise in building cross-platform mobile applications 
        and modern web experiences. Specializing in React Native, Expo, and full-stack development 
        with a focus on creating performant, user-friendly applications.`,
  email: 'michaeldadi@pm.me',
  location: 'New York, NY',
  timezone: 'EST (UTC-5)',
  avatar: '/images/avatar.jpg',
  resume: '/resume.pdf',
  availability: 'Available',
  preferredContact: 'Email',
  languages: ['English', 'Hebrew'],
};

export const education: Education[] = [
  {
    id: 'bs-computer-science',
    institution: 'Pace University, New York',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2017-09-01',
    endDate: '2022-05-15',
    relevantCourses: [
      'Mobile Application Development',
      'Distributed Systems',
      'Machine Learning',
      'Software Engineering',
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/michaeldadi',
    username: 'michaeldadi',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/michael-dadi-a56465121',
    username: 'Michael Dadi',
  },
];

// ============================================
// Helper Functions
// ============================================

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

export const getProjectsByCategory = (category: ProjectCategory): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter(
    project => project.status === 'In Production' || project.status === 'Beta'
  );
};

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skills.filter(skill => skill.category === category);
};

export const getTopSkills = (limit: number = 6): Skill[] => {
  return skills
    .toSorted((a, b) => b.proficiency - a.proficiency || b.yearsOfExperience - a.yearsOfExperience)
    .slice(0, limit);
};

export const getCurrentExperience = (): Experience | undefined => {
  return experience.find(exp => !exp.endDate);
};

export const getTotalYearsOfExperience = (): number => {
  const startDate = new Date(experience[experience.length - 1]?.startDate || new Date());
  const now = new Date();
  return Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
};

export const getProjectCount = (): number => {
  return projects.length;
};

// ============================================
// SEO & Meta Data Helpers
// ============================================

export const generateProjectMetadata = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  return {
    title: `${project.title} - ${personalInfo.name}`,
    description: project.longDescription || project.description,
    keywords: project.techStack.join(', '),
    image: project.image,
    author: personalInfo.name,
  };
};

// ============================================
// Form & Contact Helpers
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: ProjectCategory;
  budget?: string;
  timeline?: string;
}

export const projectInquiryTemplates = {
  'Mobile App': {
    subject: 'Mobile App Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI'm interested in discussing a mobile app project...`,
  },
  'Web App': {
    subject: 'Web Application Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI have a web application project in mind...`,
  },
  'Full Stack': {
    subject: 'Full Stack Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI need help with a full stack application...`,
  },
};

// ============================================
// Analytics & Tracking Events
// ============================================

export const analyticsEvents = {
  PROJECT_VIEW: 'project_view',
  RESUME_DOWNLOAD: 'resume_download',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  SOCIAL_LINK_CLICK: 'social_link_click',
  LIVE_DEMO_CLICK: 'live_demo_click',
  GITHUB_CLICK: 'github_click',
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];
