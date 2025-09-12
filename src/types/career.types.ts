export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  importance: number; // 1-5 scale
  marketDemand: number; // 1-5 scale
  averageSalaryImpact: number; // percentage increase
  relatedSkills: string[];
  learningResources: LearningResource[];
  certifications: Certification[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'tutorial' | 'project' | 'certification' | 'bootcamp';
  url: string;
  provider: string;
  duration: number; // in hours
  price: number;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  description: string;
  validityPeriod: number; // in months
  cost: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  marketValue: number; // 1-5 scale
  prerequisites: string[];
  skills: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: 'development' | 'design' | 'data' | 'devops' | 'management' | 'product';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  averageSalary: {
    min: number;
    max: number;
    currency: string;
    location: string;
  };
  marketDemand: number; // 1-5 scale
  growthProjection: number; // percentage
  requiredSkills: SkillRequirement[];
  optionalSkills: SkillRequirement[];
  roadmap: CareerMilestone[];
  jobTitles: string[];
  companies: string[];
  workStyle: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  icon: string;
  color: string[];
  tags: string[];
}

export interface SkillRequirement {
  skillId: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  importance: number; // 1-5 scale
  timeToLearn: number; // in months
}

export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number; // in months
  requiredSkills: string[];
  outcomes: string[];
  resources: string[];
  projects: ProjectSuggestion[];
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in hours
  technologies: string[];
  skills: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface UserCareerProfile {
  id: string;
  userId: string;
  currentPath?: string;
  targetPath?: string;
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
  yearsOfExperience: number;
  currentRole?: string;
  skills: UserSkill[];
  completedMilestones: string[];
  goals: CareerGoal[];
  preferences: CareerPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkill {
  skillId: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  confidence: number; // 1-5 scale
  experience: number; // in months
  lastUsed: Date;
  verified: boolean;
  certifications: string[];
  projects: string[];
  endorsements: number;
  learningGoal?: {
    targetLevel: 'intermediate' | 'advanced' | 'expert';
    deadline: Date;
    resources: string[];
  };
}

export interface CareerGoal {
  id: string;
  type: 'skill' | 'role' | 'salary' | 'certification' | 'project';
  title: string;
  description: string;
  target: string | number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  milestones: GoalMilestone[];
  completed: boolean;
  createdAt: Date;
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface CareerPreferences {
  preferredLocations: string[];
  remoteWorkPreference: 'full-remote' | 'hybrid' | 'office' | 'no-preference';
  companySizePreference: 'startup' | 'medium' | 'enterprise' | 'no-preference';
  industryPreferences: string[];
  salaryExpectation: {
    min: number;
    max: number;
    currency: string;
  };
  benefitsPreferences: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  timeAvailability: number; // hours per week for learning
}

export interface MarketInsight {
  id: string;
  type: 'skill-demand' | 'salary-trend' | 'job-openings' | 'market-forecast';
  title: string;
  description: string;
  data: any;
  source: string;
  publishedAt: Date;
  relevantPaths: string[];
  relevantSkills: string[];
  impact: 'low' | 'medium' | 'high';
}

export interface CareerAnalytics {
  userId: string;
  skillGrowth: SkillGrowthData[];
  careerProgress: CareerProgressData;
  marketAlignment: MarketAlignmentData;
  learningVelocity: LearningVelocityData;
  salaryProgression: SalaryProgressionData;
  competitiveAnalysis: CompetitiveAnalysisData;
  recommendations: CareerRecommendation[];
  updatedAt: Date;
}

export interface SkillGrowthData {
  skillId: string;
  skillName: string;
  history: {
    date: Date;
    level: number;
    confidence: number;
  }[];
  trend: 'improving' | 'stable' | 'declining';
  projectedGrowth: number;
}

export interface CareerProgressData {
  currentPathId?: string;
  overallProgress: number; // 0-100
  milestonesCompleted: number;
  totalMilestones: number;
  estimatedTimeToNextLevel: number; // in months
  skillGaps: SkillGap[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: string;
  requiredLevel: string;
  importance: number;
  estimatedTimeToClose: number; // in months
  recommendedResources: string[];
}

export interface MarketAlignmentData {
  overallAlignment: number; // 0-100
  skillMarketDemand: {
    skillId: string;
    skillName: string;
    userLevel: string;
    marketDemand: number;
    salaryPotential: number;
  }[];
  emergingSkills: string[];
  decliningSkills: string[];
  recommendations: string[];
}

export interface LearningVelocityData {
  averageTimePerSkill: number; // in months
  completionRate: number; // percentage
  preferredLearningMethods: string[];
  peakLearningTimes: string[];
  strugglingAreas: string[];
  accelerationOpportunities: string[];
}

export interface SalaryProgressionData {
  currentSalaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  projectedSalary: {
    oneYear: number;
    threeYears: number;
    fiveYears: number;
  };
  salaryDrivers: {
    skill: string;
    impact: number;
  }[];
  benchmarkData: {
    percentile: number;
    medianSalary: number;
    location: string;
  };
}

export interface CompetitiveAnalysisData {
  marketPosition: 'below-average' | 'average' | 'above-average' | 'top-tier';
  skillCompetitiveness: {
    skillId: string;
    skillName: string;
    userLevel: number;
    marketAverage: number;
    topTierLevel: number;
    competitiveGap: number;
  }[];
  uniqueStrengths: string[];
  commonWeaknesses: string[];
  differentiationOpportunities: string[];
}

export interface CareerRecommendation {
  id: string;
  type: 'skill' | 'role' | 'path' | 'resource' | 'certification' | 'project';
  title: string;
  description: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  timeline: number; // in months
  actionable: boolean;
  resources: string[];
  successMetrics: string[];
  createdAt: Date;
}

export interface JobMarketData {
  id: string;
  pathId: string;
  location: string;
  openPositions: number;
  averageSalary: number;
  salaryGrowth: number; // yearly percentage
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  topEmployers: string[];
  requiredSkills: {
    skill: string;
    frequency: number; // how often it appears in job postings
  }[];
  emergingRequirements: string[];
  updatedAt: Date;
}

export interface MentorshipOpportunity {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  expertise: string[];
  experience: number;
  rating: number;
  availability: 'full' | 'limited' | 'waitlist';
  price: number; // per hour
  languages: string[];
  timezone: string;
  focusAreas: string[];
  successStories: number;
}