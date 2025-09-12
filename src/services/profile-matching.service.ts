import { Job, JobFilters } from './jobs.service';
import { ExtendedUserProfile, ExtendedProfileSkill } from './profile.service.enhanced';

export interface UserProfileAnalysis {
  experienceLevel: 'junior' | 'pleno' | 'senior' | 'lead';
  primaryTechnologies: string[];
  secondaryTechnologies: string[];
  workPreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryRange: { min: number; max: number };
  careerFocus: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'data';
  yearsOfExperience: number;
  skillMatchingScore: number; // 0-100
  preferredCompanySize: 'startup' | 'medium' | 'large' | 'any';
  industryPreference: string[];
}

export interface JobMatchScore {
  job: Job;
  overallScore: number; // 0-100
  levelMatch: number; // 0-100
  skillMatch: number; // 0-100
  locationMatch: number; // 0-100
  salaryMatch: number; // 0-100
  techMatch: number; // 0-100
  requirementsMatch: number; // 0-100
  matchReasons: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface ProfileBasedFilters extends JobFilters {
  skillMatchThreshold?: number; // Minimum skill match percentage
  experienceRangeFlexibility?: number; // Years flexibility (-/+)
  includeGrowthOpportunities?: boolean; // Include jobs slightly above user level
  prioritizeRemoteWork?: boolean;
  excludeOverqualified?: boolean; // Don't show jobs too junior
}

class ProfileMatchingService {
  
  /**
   * Analyzes user profile to extract relevant job matching criteria
   */
  analyzeUserProfile(profile: ExtendedUserProfile, skills: ExtendedProfileSkill[]): UserProfileAnalysis {
    const experienceLevel = this.calculateExperienceLevel(profile, skills);
    const yearsOfExperience = this.calculateYearsOfExperience(profile);
    const primaryTechnologies = this.extractPrimaryTechnologies(skills);
    const secondaryTechnologies = this.extractSecondaryTechnologies(skills);
    const careerFocus = this.determineCareerFocus(skills, profile);
    const workPreference = this.determineWorkPreference(profile);
    const salaryRange = this.estimateSalaryRange(experienceLevel, careerFocus, profile.location);
    const skillMatchingScore = this.calculateOverallSkillScore(skills);

    return {
      experienceLevel,
      primaryTechnologies,
      secondaryTechnologies,
      workPreference,
      salaryRange,
      careerFocus,
      yearsOfExperience,
      skillMatchingScore,
      preferredCompanySize: this.determineCompanyPreference(profile),
      industryPreference: this.extractIndustryPreferences(profile)
    };
  }

  /**
   * Scores a job based on how well it matches the user's profile
   */
  scoreJobMatch(job: Job, userAnalysis: UserProfileAnalysis): JobMatchScore {
    const levelMatch = this.calculateLevelMatch(job.level, userAnalysis.experienceLevel);
    const skillMatch = this.calculateSkillMatch(job.technologies, job.requirements, userAnalysis);
    const locationMatch = this.calculateLocationMatch(job, userAnalysis);
    const salaryMatch = this.calculateSalaryMatch(job, userAnalysis);
    const techMatch = this.calculateTechnologyMatch(job.technologies, userAnalysis);
    const requirementsMatch = this.calculateRequirementsMatch(job.requirements, userAnalysis);

    // Weighted overall score
    const weights = {
      level: 0.25,
      skill: 0.20,
      location: 0.15,
      salary: 0.10,
      tech: 0.20,
      requirements: 0.10
    };

    const overallScore = Math.round(
      (levelMatch * weights.level) +
      (skillMatch * weights.skill) +
      (locationMatch * weights.location) +
      (salaryMatch * weights.salary) +
      (techMatch * weights.tech) +
      (requirementsMatch * weights.requirements)
    );

    const matchReasons = this.generateMatchReasons(job, userAnalysis, {
      levelMatch, skillMatch, locationMatch, salaryMatch, techMatch, requirementsMatch
    });

    const missingSkills = this.identifyMissingSkills(job, userAnalysis);
    const recommendations = this.generateRecommendations(job, userAnalysis, overallScore);

    return {
      job,
      overallScore,
      levelMatch,
      skillMatch,
      locationMatch,
      salaryMatch,
      techMatch,
      requirementsMatch,
      matchReasons,
      missingSkills,
      recommendations
    };
  }

  /**
   * Generates intelligent job filters based on user profile
   */
  generateProfileBasedFilters(userAnalysis: UserProfileAnalysis, options: {
    includeGrowthOpportunities?: boolean;
    flexibilityLevel?: 'strict' | 'moderate' | 'flexible';
  } = {}): ProfileBasedFilters {
    const { includeGrowthOpportunities = true, flexibilityLevel = 'moderate' } = options;

    // Base level filtering
    let levelFilter: string | undefined = userAnalysis.experienceLevel;
    
    // Allow growth opportunities
    if (includeGrowthOpportunities) {
      const levelHierarchy: Record<string, string[]> = {
        'junior': ['junior', 'pleno'],
        'pleno': ['junior', 'pleno', 'senior'],
        'senior': ['pleno', 'senior', 'lead'],
        'lead': ['senior', 'lead']
      };
      // For now, keep single level but this logic can be expanded
    }

    // Work type preference
    let typeFilter: string | undefined;
    if (userAnalysis.workPreference !== 'flexible') {
      typeFilter = userAnalysis.workPreference;
    }

    // Technology-based search terms
    const primaryTech = userAnalysis.primaryTechnologies[0];
    let searchTerm = primaryTech || userAnalysis.careerFocus;
    
    // Add career focus to search
    if (userAnalysis.careerFocus !== 'fullstack') {
      searchTerm += ` ${userAnalysis.careerFocus}`;
    }

    return {
      search: searchTerm,
      level: levelFilter as any,
      type: typeFilter as any,
      skillMatchThreshold: flexibilityLevel === 'strict' ? 80 : flexibilityLevel === 'moderate' ? 60 : 40,
      experienceRangeFlexibility: flexibilityLevel === 'strict' ? 1 : flexibilityLevel === 'moderate' ? 2 : 3,
      includeGrowthOpportunities,
      prioritizeRemoteWork: userAnalysis.workPreference === 'remote',
      excludeOverqualified: true
    };
  }

  /**
   * Filters and ranks jobs based on profile matching
   */
  filterAndRankJobs(jobs: Job[], userAnalysis: UserProfileAnalysis, filters: ProfileBasedFilters): JobMatchScore[] {
    // Score all jobs
    const scoredJobs = jobs.map(job => this.scoreJobMatch(job, userAnalysis));

    // Apply filters
    let filteredJobs = scoredJobs;

    // Skill match threshold
    if (filters.skillMatchThreshold) {
      filteredJobs = filteredJobs.filter(match => match.skillMatch >= filters.skillMatchThreshold!);
    }

    // Exclude overqualified positions
    if (filters.excludeOverqualified) {
      filteredJobs = filteredJobs.filter(match => {
        const job = match.job;
        if (userAnalysis.experienceLevel === 'senior' && job.level === 'junior') return false;
        if (userAnalysis.experienceLevel === 'lead' && (job.level === 'junior' || job.level === 'pleno')) return false;
        return true;
      });
    }

    // Prioritize remote work if preferred
    if (filters.prioritizeRemoteWork) {
      filteredJobs.sort((a, b) => {
        if (a.job.type === 'remote' && b.job.type !== 'remote') return -1;
        if (b.job.type === 'remote' && a.job.type !== 'remote') return 1;
        return b.overallScore - a.overallScore;
      });
    } else {
      // Sort by overall match score
      filteredJobs.sort((a, b) => b.overallScore - a.overallScore);
    }

    return filteredJobs;
  }

  // Private helper methods
  private calculateExperienceLevel(profile: ExtendedUserProfile, skills: ExtendedProfileSkill[]): 'junior' | 'pleno' | 'senior' | 'lead' {
    const yearsOfExperience = this.calculateYearsOfExperience(profile);
    const expertSkillsCount = skills.filter(skill => skill.level === 'expert').length;
    const advancedSkillsCount = skills.filter(skill => skill.level === 'advanced').length;

    // Complex algorithm considering multiple factors
    if (yearsOfExperience >= 8 || expertSkillsCount >= 3) {
      return 'lead';
    } else if (yearsOfExperience >= 5 || (expertSkillsCount >= 1 && advancedSkillsCount >= 3)) {
      return 'senior';
    } else if (yearsOfExperience >= 2 || advancedSkillsCount >= 2) {
      return 'pleno';
    } else {
      return 'junior';
    }
  }

  private calculateYearsOfExperience(profile: ExtendedUserProfile): number {
    // Calculate from experiences or use a default based on profile completeness
    if (profile.experiences && profile.experiences.length > 0) {
      const totalMonths = profile.experiences.reduce((total, exp) => {
        const start = new Date(exp.start_date);
        const end = exp.is_current ? new Date() : new Date(exp.end_date || new Date());
        const months = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        return total + months;
      }, 0);
      return Math.round(totalMonths / 12);
    }
    
    // Fallback estimation
    return profile.skills && profile.skills.length > 5 ? 3 : 1;
  }

  private extractPrimaryTechnologies(skills: ExtendedProfileSkill[]): string[] {
    return skills
      .filter(skill => skill.level === 'expert' || skill.level === 'advanced')
      .sort((a, b) => {
        const levelWeight = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
        return (levelWeight[b.level] || 0) - (levelWeight[a.level] || 0);
      })
      .slice(0, 3)
      .map(skill => skill.name);
  }

  private extractSecondaryTechnologies(skills: ExtendedProfileSkill[]): string[] {
    return skills
      .filter(skill => skill.level === 'intermediate')
      .slice(0, 5)
      .map(skill => skill.name);
  }

  private determineCareerFocus(skills: ExtendedProfileSkill[], profile: ExtendedUserProfile): 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'data' {
    const skillNames = skills.map(s => s.name.toLowerCase());
    
    // Technology categorization
    const frontendTechs = ['react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'javascript', 'typescript'];
    const backendTechs = ['node.js', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'c#', 'django', 'laravel', 'spring'];
    const mobileTechs = ['react native', 'flutter', 'swift', 'kotlin', 'ionic', 'xamarin', 'android', 'ios'];
    const devopsTechs = ['docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'terraform', 'ansible'];
    const dataTechs = ['python', 'r', 'sql', 'pandas', 'tensorflow', 'pytorch', 'spark', 'hadoop'];

    const counts = {
      frontend: skillNames.filter(skill => frontendTechs.some(tech => skill.includes(tech))).length,
      backend: skillNames.filter(skill => backendTechs.some(tech => skill.includes(tech))).length,
      mobile: skillNames.filter(skill => mobileTechs.some(tech => skill.includes(tech))).length,
      devops: skillNames.filter(skill => devopsTechs.some(tech => skill.includes(tech))).length,
      data: skillNames.filter(skill => dataTechs.some(tech => skill.includes(tech))).length,
    };

    // Determine focus based on skill distribution
    const maxCount = Math.max(...Object.values(counts));
    const dominantAreas = Object.entries(counts).filter(([_, count]) => count === maxCount);

    if (dominantAreas.length === 1) {
      return dominantAreas[0][0] as any;
    }

    // Check for fullstack (both frontend and backend)
    if (counts.frontend > 0 && counts.backend > 0) {
      return 'fullstack';
    }

    // Default based on profile or most common
    return Object.entries(counts).reduce((a, b) => counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b)[0] as any;
  }

  private determineWorkPreference(profile: ExtendedUserProfile): 'remote' | 'hybrid' | 'onsite' | 'flexible' {
    // This could be enhanced with user preferences or current experience
    // For now, assume flexible unless specified
    return 'flexible';
  }

  private estimateSalaryRange(level: string, focus: string, location?: string): { min: number; max: number } {
    // Brazilian market salary ranges (in BRL)
    const baseSalaries = {
      junior: { min: 3000, max: 6000 },
      pleno: { min: 5000, max: 10000 },
      senior: { min: 8000, max: 16000 },
      lead: { min: 12000, max: 25000 }
    };

    const focusMultipliers = {
      frontend: 1.0,
      backend: 1.1,
      fullstack: 1.15,
      mobile: 1.2,
      devops: 1.25,
      data: 1.3
    };

    const locationMultipliers: Record<string, number> = {
      'são paulo': 1.2,
      'rio de janeiro': 1.1,
      'belo horizonte': 0.9,
      'remote': 1.0
    };

    const base = baseSalaries[level as keyof typeof baseSalaries] || baseSalaries.pleno;
    const focusMultiplier = focusMultipliers[focus as keyof typeof focusMultipliers] || 1.0;
    const locationMultiplier = location ? (locationMultipliers[location.toLowerCase()] || 0.8) : 1.0;

    return {
      min: Math.round(base.min * focusMultiplier * locationMultiplier),
      max: Math.round(base.max * focusMultiplier * locationMultiplier)
    };
  }

  private calculateOverallSkillScore(skills: ExtendedProfileSkill[]): number {
    if (skills.length === 0) return 0;

    const levelScores = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    const totalScore = skills.reduce((sum, skill) => sum + (levelScores[skill.level] || 0), 0);
    
    return Math.round(totalScore / skills.length);
  }

  private determineCompanyPreference(profile: ExtendedUserProfile): 'startup' | 'medium' | 'large' | 'any' {
    // This could be enhanced with user preferences
    return 'any';
  }

  private extractIndustryPreferences(profile: ExtendedUserProfile): string[] {
    // Extract from interests, experiences, etc.
    const industries: string[] = [];
    
    if (profile.interests) {
      profile.interests.forEach(interest => {
        if (interest.category === 'Companies') {
          industries.push(interest.name);
        }
      });
    }

    return industries.slice(0, 5);
  }

  private calculateLevelMatch(jobLevel: string, userLevel: string): number {
    const levelHierarchy = ['junior', 'pleno', 'senior', 'lead'];
    const jobIndex = levelHierarchy.indexOf(jobLevel);
    const userIndex = levelHierarchy.indexOf(userLevel);

    if (jobIndex === userIndex) return 100;
    if (Math.abs(jobIndex - userIndex) === 1) return 80;
    if (Math.abs(jobIndex - userIndex) === 2) return 60;
    return 40;
  }

  private calculateSkillMatch(jobTechs: string[], jobReqs: string[], userAnalysis: UserProfileAnalysis): number {
    const userTechs = [...userAnalysis.primaryTechnologies, ...userAnalysis.secondaryTechnologies];
    const allJobSkills = [...jobTechs, ...jobReqs].map(skill => skill.toLowerCase());
    const userSkills = userTechs.map(skill => skill.toLowerCase());

    if (allJobSkills.length === 0) return 50; // Default if no requirements

    const matches = allJobSkills.filter(jobSkill => 
      userSkills.some(userSkill => 
        userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
      )
    );

    return Math.min(100, Math.round((matches.length / allJobSkills.length) * 100));
  }

  private calculateLocationMatch(job: Job, userAnalysis: UserProfileAnalysis): number {
    const jobLocation = job.location.toLowerCase();
    const jobType = job.type;

    // Remote work preference
    if (userAnalysis.workPreference === 'remote') {
      if (jobType === 'remote') return 100;
      if (jobType === 'hybrid') return 70;
      return 40;
    }

    // Hybrid preference
    if (userAnalysis.workPreference === 'hybrid') {
      if (jobType === 'hybrid') return 100;
      if (jobType === 'remote') return 90;
      if (jobType === 'onsite') return 70;
    }

    // Location-based matching (simplified)
    if (jobType === 'remote') return 90; // Remote is always good
    
    return 75; // Default for location flexibility
  }

  private calculateSalaryMatch(job: Job, userAnalysis: UserProfileAnalysis): number {
    if (!job.salary_range) return 70; // Default if no salary info

    // Extract salary numbers (simplified)
    const salaryText = job.salary_range.toLowerCase();
    const numbers = salaryText.match(/\d+[\d.,]*/g);
    
    if (!numbers || numbers.length < 2) return 70;

    const jobMin = parseInt(numbers[0].replace(/[.,]/g, ''));
    const jobMax = parseInt(numbers[1].replace(/[.,]/g, ''));
    
    const { min: userMin, max: userMax } = userAnalysis.salaryRange;

    // Check if there's overlap
    if (jobMax >= userMin && jobMin <= userMax) {
      return 100;
    }

    // Check if close
    const distance = Math.min(
      Math.abs(jobMin - userMax),
      Math.abs(jobMax - userMin)
    );

    if (distance <= userMax * 0.2) return 80;
    if (distance <= userMax * 0.4) return 60;
    
    return 40;
  }

  private calculateTechnologyMatch(jobTechs: string[], userAnalysis: UserProfileAnalysis): number {
    const userTechs = userAnalysis.primaryTechnologies.map(t => t.toLowerCase());
    const jobTechsLower = jobTechs.map(t => t.toLowerCase());

    if (jobTechsLower.length === 0) return 50;

    const primaryMatches = jobTechsLower.filter(tech =>
      userTechs.some(userTech => userTech.includes(tech) || tech.includes(userTech))
    );

    const matchPercentage = (primaryMatches.length / Math.max(jobTechsLower.length, 1)) * 100;
    return Math.min(100, Math.round(matchPercentage));
  }

  private calculateRequirementsMatch(jobReqs: string[], userAnalysis: UserProfileAnalysis): number {
    const allUserTechs = [...userAnalysis.primaryTechnologies, ...userAnalysis.secondaryTechnologies];
    
    if (jobReqs.length === 0) return 80;

    const matches = jobReqs.filter(req => {
      const reqLower = req.toLowerCase();
      return allUserTechs.some(tech => 
        tech.toLowerCase().includes(reqLower) || reqLower.includes(tech.toLowerCase())
      );
    });

    return Math.round((matches.length / jobReqs.length) * 100);
  }

  private generateMatchReasons(job: Job, userAnalysis: UserProfileAnalysis, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.levelMatch >= 80) {
      reasons.push(`Nível ${job.level} alinha com sua experiência`);
    }

    if (scores.techMatch >= 70) {
      reasons.push(`Tecnologias (${job.technologies.slice(0, 2).join(', ')}) combinam com suas skills`);
    }

    if (scores.locationMatch >= 80 && job.type === 'remote') {
      reasons.push('Trabalho remoto disponível');
    }

    if (scores.salaryMatch >= 80) {
      reasons.push('Faixa salarial compatível');
    }

    return reasons.slice(0, 3);
  }

  private identifyMissingSkills(job: Job, userAnalysis: UserProfileAnalysis): string[] {
    const userTechs = [...userAnalysis.primaryTechnologies, ...userAnalysis.secondaryTechnologies]
      .map(t => t.toLowerCase());
    
    const missingTechs = job.technologies.filter(tech => 
      !userTechs.some(userTech => userTech.includes(tech.toLowerCase()) || tech.toLowerCase().includes(userTech))
    );

    return missingTechs.slice(0, 3);
  }

  private generateRecommendations(job: Job, userAnalysis: UserProfileAnalysis, overallScore: number): string[] {
    const recommendations: string[] = [];

    if (overallScore >= 80) {
      recommendations.push('Excelente match! Considere aplicar imediatamente.');
    } else if (overallScore >= 60) {
      recommendations.push('Boa oportunidade. Revise os requisitos antes de aplicar.');
    } else {
      recommendations.push('Considere desenvolver skills adicionais antes de aplicar.');
    }

    return recommendations;
  }
}

export const profileMatchingService = new ProfileMatchingService();