import { supabase } from '../lib/supabase';
import {
  CareerPath,
  Skill,
  UserCareerProfile,
  CareerAnalytics,
  MarketInsight,
  JobMarketData,
  MentorshipOpportunity,
  CareerGoal,
  LearningResource,
  Certification,
  CareerRecommendation
} from '../types/career.types';

export class CareerService {
  // Career Paths
  async getCareerPaths(filters?: {
    category?: string;
    experienceLevel?: string;
    skills?: string[];
  }): Promise<CareerPath[]> {
    try {
      let query = supabase
        .from('career_paths')
        .select(`
          *,
          required_skills:career_path_skills!inner(
            skill_id,
            level,
            importance,
            time_to_learn,
            skills!inner(*)
          ),
          optional_skills:career_path_optional_skills(
            skill_id,
            level,
            importance,
            time_to_learn,
            skills(*)
          ),
          roadmap:career_milestones(*)
        `);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching career paths:', error);
      throw error;
    }
  }

  async getCareerPathById(id: string): Promise<CareerPath | null> {
    try {
      const { data, error } = await supabase
        .from('career_paths')
        .select(`
          *,
          required_skills:career_path_skills(
            skill_id,
            level,
            importance,
            time_to_learn,
            skills(*)
          ),
          optional_skills:career_path_optional_skills(
            skill_id,
            level,
            importance,
            time_to_learn,
            skills(*)
          ),
          roadmap:career_milestones(
            *,
            projects:milestone_projects(*)
          ),
          job_market:job_market_data(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching career path:', error);
      throw error;
    }
  }

  // Skills Management
  async getSkills(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Skill[]> {
    try {
      let query = supabase
        .from('skills')
        .select(`
          *,
          learning_resources:skill_resources(
            resources(*)
          ),
          certifications:skill_certifications(
            certifications(*)
          )
        `);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  }

  async getSkillById(id: string): Promise<Skill | null> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          learning_resources:skill_resources(
            resources(*)
          ),
          certifications:skill_certifications(
            certifications(*)
          ),
          related_skills:skill_relationships(
            related_skill:skills(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching skill:', error);
      throw error;
    }
  }

  // User Career Profile
  async getUserCareerProfile(userId: string): Promise<UserCareerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_career_profiles')
        .select(`
          *,
          skills:user_skills(
            *,
            skill:skills(*)
          ),
          goals:career_goals(
            *,
            milestones:goal_milestones(*)
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user career profile:', error);
      throw error;
    }
  }

  async createUserCareerProfile(profile: Omit<UserCareerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserCareerProfile> {
    try {
      const { data, error } = await supabase
        .from('user_career_profiles')
        .insert([{
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user career profile:', error);
      throw error;
    }
  }

  async updateUserCareerProfile(userId: string, updates: Partial<UserCareerProfile>): Promise<UserCareerProfile> {
    try {
      const { data, error } = await supabase
        .from('user_career_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user career profile:', error);
      throw error;
    }
  }

  // User Skills
  async updateUserSkill(userId: string, skillData: {
    skillId: string;
    level?: string;
    confidence?: number;
    experience?: number;
    lastUsed?: Date;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_skills')
        .upsert([{
          user_id: userId,
          skill_id: skillData.skillId,
          level: skillData.level,
          confidence: skillData.confidence,
          experience: skillData.experience,
          last_used: skillData.lastUsed?.toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user skill:', error);
      throw error;
    }
  }

  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', userId)
        .eq('skill_id', skillId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing user skill:', error);
      throw error;
    }
  }

  // Career Goals
  async createCareerGoal(userId: string, goal: Omit<CareerGoal, 'id' | 'createdAt'>): Promise<CareerGoal> {
    try {
      const { data, error } = await supabase
        .from('career_goals')
        .insert([{
          ...goal,
          user_id: userId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating career goal:', error);
      throw error;
    }
  }

  async updateCareerGoal(goalId: string, updates: Partial<CareerGoal>): Promise<CareerGoal> {
    try {
      const { data, error } = await supabase
        .from('career_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating career goal:', error);
      throw error;
    }
  }

  async deleteCareerGoal(goalId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('career_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting career goal:', error);
      throw error;
    }
  }

  // Career Analytics
  async getCareerAnalytics(userId: string): Promise<CareerAnalytics | null> {
    try {
      // Get user skills history
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills_history')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: true });

      if (skillsError) throw skillsError;

      // Get career progress
      const { data: progressData, error: progressError } = await supabase
        .from('career_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (progressError && progressError.code !== 'PGRST116') throw progressError;

      // Get market alignment data
      const { data: marketData, error: marketError } = await supabase
        .from('market_alignment')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (marketError && marketError.code !== 'PGRST116') throw marketError;

      // Get recommendations
      const { data: recommendations, error: recError } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false })
        .limit(10);

      if (recError) throw recError;

      // Process and return analytics
      return this.processCareerAnalytics(userId, {
        skillsHistory: skillsData || [],
        progress: progressData,
        market: marketData,
        recommendations: recommendations || []
      });
    } catch (error) {
      console.error('Error fetching career analytics:', error);
      throw error;
    }
  }

  private async processCareerAnalytics(userId: string, data: any): Promise<CareerAnalytics> {
    // Process skill growth data
    const skillGrowth = this.calculateSkillGrowth(data.skillsHistory);
    
    // Calculate learning velocity
    const learningVelocity = this.calculateLearningVelocity(data.skillsHistory);
    
    // Generate salary progression estimates
    const salaryProgression = await this.estimateSalaryProgression(userId);
    
    // Perform competitive analysis
    const competitiveAnalysis = await this.performCompetitiveAnalysis(userId);

    return {
      userId,
      skillGrowth,
      careerProgress: data.progress || this.getDefaultCareerProgress(),
      marketAlignment: data.market || this.getDefaultMarketAlignment(),
      learningVelocity,
      salaryProgression,
      competitiveAnalysis,
      recommendations: data.recommendations,
      updatedAt: new Date()
    };
  }

  private calculateSkillGrowth(skillsHistory: any[]): any[] {
    const skillGroups = skillsHistory.reduce((acc, record) => {
      if (!acc[record.skill_id]) {
        acc[record.skill_id] = [];
      }
      acc[record.skill_id].push(record);
      return acc;
    }, {});

    return Object.entries(skillGroups).map(([skillId, history]: [string, any[]]) => {
      const sortedHistory = history.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
      const trend = this.calculateTrend(sortedHistory);
      
      return {
        skillId,
        skillName: sortedHistory[0]?.skill_name || 'Unknown',
        history: sortedHistory.map(record => ({
          date: new Date(record.recorded_at),
          level: record.level_numeric,
          confidence: record.confidence
        })),
        trend,
        projectedGrowth: this.calculateProjectedGrowth(sortedHistory, trend)
      };
    });
  }

  private calculateTrend(history: any[]): 'improving' | 'stable' | 'declining' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-3);
    const earlier = history.slice(0, -3);
    
    const recentAvg = recent.reduce((sum, record) => sum + record.level_numeric, 0) / recent.length;
    const earlierAvg = earlier.length > 0 
      ? earlier.reduce((sum, record) => sum + record.level_numeric, 0) / earlier.length
      : recentAvg;

    if (recentAvg > earlierAvg * 1.1) return 'improving';
    if (recentAvg < earlierAvg * 0.9) return 'declining';
    return 'stable';
  }

  private calculateProjectedGrowth(history: any[], trend: string): number {
    if (trend === 'improving') return Math.random() * 20 + 10; // 10-30%
    if (trend === 'declining') return Math.random() * -10 - 5; // -15% to -5%
    return Math.random() * 10 - 5; // -5% to 5%
  }

  private calculateLearningVelocity(skillsHistory: any[]): any {
    const totalSkills = new Set(skillsHistory.map(record => record.skill_id)).size;
    const timeSpan = skillsHistory.length > 0 
      ? (new Date().getTime() - new Date(skillsHistory[0].recorded_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
      : 1;

    return {
      averageTimePerSkill: timeSpan / Math.max(totalSkills, 1),
      completionRate: 75 + Math.random() * 20, // Mock data
      preferredLearningMethods: ['hands-on', 'documentation', 'video tutorials'],
      peakLearningTimes: ['weekends', 'evenings'],
      strugglingAreas: [],
      accelerationOpportunities: ['structured learning path', 'peer programming']
    };
  }

  private async estimateSalaryProgression(userId: string): Promise<any> {
    // Mock salary progression calculation
    return {
      currentSalaryRange: {
        min: 80000,
        max: 120000,
        currency: 'USD'
      },
      projectedSalary: {
        oneYear: 95000,
        threeYears: 130000,
        fiveYears: 160000
      },
      salaryDrivers: [
        { skill: 'React', impact: 15 },
        { skill: 'TypeScript', impact: 12 },
        { skill: 'Node.js', impact: 10 }
      ],
      benchmarkData: {
        percentile: 70,
        medianSalary: 100000,
        location: 'Remote'
      }
    };
  }

  private async performCompetitiveAnalysis(userId: string): Promise<any> {
    // Mock competitive analysis
    return {
      marketPosition: 'above-average' as const,
      skillCompetitiveness: [
        {
          skillId: '1',
          skillName: 'JavaScript',
          userLevel: 85,
          marketAverage: 70,
          topTierLevel: 95,
          competitiveGap: 10
        }
      ],
      uniqueStrengths: ['Full-stack development', 'Problem solving'],
      commonWeaknesses: ['DevOps', 'System design'],
      differentiationOpportunities: ['Machine Learning', 'Cloud Architecture']
    };
  }

  private getDefaultCareerProgress(): any {
    return {
      currentPathId: null,
      overallProgress: 0,
      milestonesCompleted: 0,
      totalMilestones: 0,
      estimatedTimeToNextLevel: 12,
      skillGaps: [],
      strengths: [],
      areasForImprovement: []
    };
  }

  private getDefaultMarketAlignment(): any {
    return {
      overallAlignment: 50,
      skillMarketDemand: [],
      emergingSkills: [],
      decliningSkills: [],
      recommendations: []
    };
  }

  // Market Insights
  async getMarketInsights(filters?: {
    type?: string;
    relevantPaths?: string[];
    limit?: number;
  }): Promise<MarketInsight[]> {
    try {
      let query = supabase
        .from('market_insights')
        .select('*')
        .order('published_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching market insights:', error);
      throw error;
    }
  }

  // Job Market Data
  async getJobMarketData(pathId?: string, location?: string): Promise<JobMarketData[]> {
    try {
      let query = supabase
        .from('job_market_data')
        .select('*')
        .order('updated_at', { ascending: false });

      if (pathId) {
        query = query.eq('path_id', pathId);
      }

      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching job market data:', error);
      throw error;
    }
  }

  // Learning Resources
  async getLearningResources(filters?: {
    skillId?: string;
    type?: string;
    difficulty?: string;
    maxPrice?: number;
  }): Promise<LearningResource[]> {
    try {
      let query = supabase
        .from('learning_resources')
        .select('*')
        .order('rating', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      throw error;
    }
  }

  // Mentorship
  async getMentorshipOpportunities(filters?: {
    expertise?: string[];
    maxPrice?: number;
    language?: string;
  }): Promise<MentorshipOpportunity[]> {
    try {
      let query = supabase
        .from('mentorship_opportunities')
        .select('*')
        .eq('availability', 'full')
        .order('rating', { ascending: false });

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.language) {
        query = query.contains('languages', [filters.language]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching mentorship opportunities:', error);
      throw error;
    }
  }

  // Recommendations
  async generateCareerRecommendations(userId: string): Promise<CareerRecommendation[]> {
    try {
      // This would typically call an AI service or complex algorithm
      // For now, we'll return mock recommendations
      const recommendations: CareerRecommendation[] = [
        {
          id: '1',
          type: 'skill',
          title: 'Learn TypeScript',
          description: 'TypeScript is in high demand and will boost your marketability',
          reasoning: 'Based on your JavaScript skills and current market trends',
          priority: 'high',
          impact: 'high',
          effort: 'medium',
          timeline: 3,
          actionable: true,
          resources: ['typescript-handbook', 'typescript-course'],
          successMetrics: ['Complete TypeScript certification', 'Build TypeScript project'],
          createdAt: new Date()
        },
        {
          id: '2',
          type: 'certification',
          title: 'AWS Cloud Practitioner',
          description: 'Cloud skills are essential for modern development',
          reasoning: 'Growing demand for cloud expertise in your target roles',
          priority: 'medium',
          impact: 'high',
          effort: 'medium',
          timeline: 6,
          actionable: true,
          resources: ['aws-training', 'cloud-practitioner-course'],
          successMetrics: ['Pass AWS exam', 'Deploy project on AWS'],
          createdAt: new Date()
        }
      ];

      return recommendations;
    } catch (error) {
      console.error('Error generating career recommendations:', error);
      throw error;
    }
  }
}

export const careerService = new CareerService();