export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  portfolioUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  startDate: string;
  endDate: string;
  level: 'fundamental' | 'medio' | 'tecnico' | 'superior' | 'pos-graduacao' | 'mba' | 'mestrado' | 'doutorado' | 'pos-doutorado';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob?: boolean;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'basico' | 'intermediario' | 'avancado' | 'fluente';
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  languages: Language[];
  certificates: Certificate[];
  skills: string[];
}

export type ResumeStep = 
  | 'intro'
  | 'personal'
  | 'education'
  | 'experience'
  | 'projects'
  | 'languages'
  | 'certificates'
  | 'skills'
  | 'review'
  | 'complete';

export type ConversationState = {
  currentStep: ResumeStep;
  currentSubStep?: string;
  isCollectingMultiple?: boolean;
  tempData?: any;
  resumeData: Partial<ResumeData>;
};