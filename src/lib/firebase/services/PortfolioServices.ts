import { BaseService } from "./BaseService";

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  images?: string[];
  link?: string;
  tags: string[];
  createdAt: string;
  renderMode?: 'html' | 'markdown' | 'both' | 'none';
  projectType?: 'web' | 'app';
  appPlatform?: 'android' | 'ios' | 'windows' | 'linux' | 'mac' | 'cross-platform';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
  icon?: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface About {
  content: string;
  email: string;
  phone: string;
  location: string;
}

class ProjectService extends BaseService<Project> {
  constructor() {
    super("projects");
  }
}

class SkillService extends BaseService<Skill> {
  constructor() {
    super("skills");
  }
}

class EducationService extends BaseService<Education> {
  constructor() {
    super("education");
  }
}

class AboutService extends BaseService<About> {
  constructor() {
    super("about");
  }
}

// Export singleton instances
export const projectService = new ProjectService();
export const skillService = new SkillService();
export const educationService = new EducationService();
export const aboutService = new AboutService();
