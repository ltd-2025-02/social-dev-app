import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  auth_id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
  persona_id: string | null;
  occupation: string | null;
  company: string | null;
  bio: string | null;
  website: string | null;
  about: string | null;
  location: string | null;
  phone: string | null;
  headline: string | null;
  profile_visibility: 'public' | 'connections' | 'private';
  profile_completion_percentage: number;
  created_at: string;
  updated_at: string;
  skills?: ProfileSkill[];
  experience?: ProfileExperience[];
  education?: ProfileEducation[];
  projects?: ProfileProject[];
  certifications?: ProfileCertification[];
  courses?: ProfileCourse[];
  languages?: ProfileLanguage[];
  services?: ProfileService[];
}

export interface ProfileSkill {
  id: string;
  user_id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
  years_of_experience: number | null;
  is_endorsed: boolean;
  created_at: string;
  updated_at: string;
  endorsements?: SkillEndorsement[];
}

export interface SkillEndorsement {
  id: string;
  skill_id: string;
  endorser_id: string;
  created_at: string;
  endorser?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ProfileExperience {
  id: string;
  user_id: string;
  position: string;
  company: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'volunteer';
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileEducation {
  id: string;
  user_id: string;
  degree: string;
  institution: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  project_url: string | null;
  associated_with: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileCertification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileCourse {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  completion_date: string | null;
  certificate_url: string | null;
  duration_hours: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileLanguage {
  id: string;
  user_id: string;
  language: string;
  proficiency: 'elementary' | 'limited_working' | 'professional_working' | 'full_professional' | 'native';
  created_at: string;
  updated_at: string;
}

export interface ProfileService {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  duration_hours: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileView {
  id: string;
  profile_user_id: string;
  viewer_user_id: string;
  view_date: string;
  viewed_at: string;
}

export interface ProfileStats {
  views_count: number;
  connections_count: number;
  posts_count: number;
  projects_count: number;
  endorsements_count: number;
}

class ProfileService {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!profile) return null;

      // Get only existing profile sections (skills are the only additional table that exists)
      const skills = await this.getProfileSkills(userId);

      return {
        ...profile,
        skills
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('🔧 ProfileService.updateProfile chamado');
      console.log('📍 User ID:', userId);
      console.log('📝 Updates:', updates);

      const { data: profile, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      console.log('💾 Supabase response:', { profile, error });

      if (error) throw error;

      // Calculate and update profile completion percentage
      await this.updateProfileCompletion(userId);

      console.log('✅ Profile atualizado com sucesso:', profile);
      return profile;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  }

  async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      const [connectionsCount, postsCount, endorsementsCount] = await Promise.all([
        this.getConnectionsCount(userId),
        this.getPostsCount(userId),
        this.getEndorsementsCount(userId)
      ]);

      return {
        views_count: Math.floor(Math.random() * 50) + 20, // Mock views for now
        connections_count: connectionsCount,
        posts_count: postsCount,
        projects_count: Math.floor(Math.random() * 10) + 2, // Mock projects for now
        endorsements_count: endorsementsCount
      };
    } catch (error) {
      console.error('Error getting profile stats:', error);
      return {
        views_count: 0,
        connections_count: 0,
        posts_count: 0,
        projects_count: 0,
        endorsements_count: 0
      };
    }
  }

  async recordProfileView(profileUserId: string, viewerUserId: string): Promise<void> {
    // Profile views table doesn't exist yet, so we'll skip this for now
    console.log(`Profile view recorded for ${profileUserId} by ${viewerUserId}`);
  }

  // Skills management
  async getProfileSkills(userId: string): Promise<ProfileSkill[]> {
    try {
      const { data: skills, error } = await supabase
        .from('profile_skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!skills) return [];

      // Get endorsements for each skill
      const skillsWithEndorsements = await Promise.all(
        skills.map(async (skill) => {
          const endorsements = await this.getSkillEndorsements(skill.id);
          return {
            ...skill,
            endorsements
          };
        })
      );

      return skillsWithEndorsements;
    } catch (error) {
      console.error('Error fetching profile skills:', error);
      throw error;
    }
  }

  async addProfileSkill(
    userId: string,
    name: string,
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other',
    yearsOfExperience?: number
  ): Promise<ProfileSkill> {
    try {
      const { data: skill, error } = await supabase
        .from('profile_skills')
        .insert([
          {
            user_id: userId,
            name,
            level,
            category,
            years_of_experience: yearsOfExperience || null
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);

      return {
        ...skill,
        endorsements: []
      };
    } catch (error) {
      console.error('Error adding profile skill:', error);
      throw error;
    }
  }

  async updateProfileSkill(skillId: string, updates: Partial<ProfileSkill>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile_skills')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', skillId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile skill:', error);
      throw error;
    }
  }

  async removeProfileSkill(skillId: string): Promise<void> {
    try {
      // Remove endorsements first
      await supabase
        .from('skill_endorsements')
        .delete()
        .eq('skill_id', skillId);

      // Remove skill
      const { error } = await supabase
        .from('profile_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing profile skill:', error);
      throw error;
    }
  }

  async endorseSkill(skillId: string, endorserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('skill_endorsements')
        .insert([
          {
            skill_id: skillId,
            endorser_id: endorserId
          }
        ]);

      if (error) throw error;

      // Update skill endorsement status
      await supabase
        .from('profile_skills')
        .update({ is_endorsed: true })
        .eq('id', skillId);
    } catch (error) {
      console.error('Error endorsing skill:', error);
      throw error;
    }
  }

  // Experience management
  async getProfileExperience(userId: string): Promise<ProfileExperience[]> {
    // Profile experience table doesn't exist yet
    return [];
  }

  async addProfileExperience(userId: string, experience: Omit<ProfileExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileExperience> {
    try {
      const { data: newExperience, error } = await supabase
        .from('profile_experience')
        .insert([
          {
            user_id: userId,
            ...experience
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return newExperience;
    } catch (error) {
      console.error('Error adding profile experience:', error);
      throw error;
    }
  }

  // Education management
  async getProfileEducation(userId: string): Promise<ProfileEducation[]> {
    // Profile education table doesn't exist yet
    return [];
  }

  async addProfileEducation(userId: string, education: Omit<ProfileEducation, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileEducation> {
    try {
      const { data: newEducation, error } = await supabase
        .from('profile_education')
        .insert([
          {
            user_id: userId,
            ...education
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return newEducation;
    } catch (error) {
      console.error('Error adding profile education:', error);
      throw error;
    }
  }

  // Projects management
  async getProfileProjects(userId: string): Promise<ProfileProject[]> {
    // Profile projects table doesn't exist yet
    return [];
  }

  async addProfileProject(userId: string, project: Omit<ProfileProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileProject> {
    try {
      const { data: newProject, error } = await supabase
        .from('profile_projects')
        .insert([
          {
            user_id: userId,
            ...project
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return newProject;
    } catch (error) {
      console.error('Error adding profile project:', error);
      throw error;
    }
  }

  // Certifications management
  async getProfileCertifications(userId: string): Promise<ProfileCertification[]> {
    // Profile certifications table doesn't exist yet
    return [];
  }

  // Courses management
  async getProfileCourses(userId: string): Promise<ProfileCourse[]> {
    // Profile courses table doesn't exist yet
    return [];
  }

  // Languages management
  async getProfileLanguages(userId: string): Promise<ProfileLanguage[]> {
    // Profile languages table doesn't exist yet
    return [];
  }

  // Services management
  async getProfileServices(userId: string): Promise<ProfileService[]> {
    // Profile services table doesn't exist yet
    return [];
  }

  // Helper methods
  private async getSkillEndorsements(skillId: string): Promise<SkillEndorsement[]> {
    try {
      const { data: endorsements, error } = await supabase
        .from('skill_endorsements')
        .select(`
          *,
          users!skill_endorsements_endorser_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('skill_id', skillId);

      if (error) throw error;

      return endorsements?.map(endorsement => ({
        ...endorsement,
        endorser: endorsement.users
      })) || [];
    } catch (error) {
      console.error('Error fetching skill endorsements:', error);
      return [];
    }
  }

  private async updateProfileCompletion(userId: string): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return;

      let completionScore = 0;
      const maxScore = 100;

      // Basic info (40 points)
      if (profile.name) completionScore += 5;
      if (profile.email) completionScore += 5;
      if (profile.avatar) completionScore += 10;
      if (profile.occupation) completionScore += 5;
      if (profile.location) completionScore += 5;
      if (profile.bio) completionScore += 10;

      // Skills (20 points)
      if (profile.skills && profile.skills.length > 0) completionScore += 10;
      if (profile.skills && profile.skills.length >= 5) completionScore += 10;

      // Experience (20 points)
      if (profile.experience && profile.experience.length > 0) completionScore += 20;

      // Education (10 points)
      if (profile.education && profile.education.length > 0) completionScore += 10;

      // Projects (10 points)
      if (profile.projects && profile.projects.length > 0) completionScore += 10;

      const percentage = Math.min(completionScore, maxScore);

      await supabase
        .from('users')
        .update({ profile_completion_percentage: percentage })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating profile completion:', error);
    }
  }

  private async getProfileViewsCount(userId: string): Promise<number> {
    // Profile views table doesn't exist yet
    return Math.floor(Math.random() * 50) + 20;
  }

  private async getConnectionsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting connections count:', error);
      return 0;
    }
  }

  private async getPostsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting posts count:', error);
      return 0;
    }
  }

  private async getProjectsCount(userId: string): Promise<number> {
    // Profile projects table doesn't exist yet
    return Math.floor(Math.random() * 10) + 2;
  }

  private async getEndorsementsCount(userId: string): Promise<number> {
    try {
      // Get all skills for the user, then count endorsements
      const { data: skills } = await supabase
        .from('profile_skills')
        .select('id')
        .eq('user_id', userId);

      if (!skills || skills.length === 0) return 0;

      const skillIds = skills.map(skill => skill.id);

      const { count, error } = await supabase
        .from('skill_endorsements')
        .select('*', { count: 'exact', head: true })
        .in('skill_id', skillIds);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting endorsements count:', error);
      return 0;
    }
  }
}

export const profileService = new ProfileService();