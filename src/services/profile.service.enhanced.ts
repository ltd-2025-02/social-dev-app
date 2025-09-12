import { supabase } from '../lib/supabase';

// ===============================================
// INTERFACES PARA O NOVO PERFIL ESTENDIDO
// ===============================================

export interface ExtendedUserProfile {
  id: string;
  auth_id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
  persona_id: string | null;
  occupation: string | null;
  company: string | null;
  bio: string | null;
  description: string | null; // Descrição principal igual ao LinkedIn
  website: string | null;
  about: string | null;
  location: string | null;
  phone: string | null;
  headline: string | null;
  profile_visibility: 'public' | 'connections' | 'private';
  profile_completion_percentage: number;
  resume_url: string | null;
  
  // Redes Sociais
  github_url: string | null;
  linkedin_url: string | null;
  indeed_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  portfolio_url: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Dados relacionados
  skills?: ExtendedProfileSkill[];
  experiences?: ProfileExperience[];
  education?: ProfileEducation[];
  projects?: ProfileProject[];
  certifications?: ProfileCertification[];
  courses?: ProfileCourse[];
  languages?: ProfileLanguage[];
  organizations?: ProfileOrganization[];
  services?: ProfileService[];
  interests?: ProfileInterest[];
  recommendations?: ProfileRecommendation[];
}

export interface ExtendedProfileSkill {
  id: string;
  user_id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
  years_of_experience: number | null;
  is_endorsed: boolean;
  is_featured: boolean;
  icon_name: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  endorsements?: SkillEndorsement[];
}

export interface ProfileExperience {
  id: string;
  user_id: string;
  position: string;
  company: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | 'volunteer';
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
  institution: string;
  degree: string;
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
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  technologies: string[] | null;
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

export interface ProfileOrganization {
  id: string;
  user_id: string;
  name: string;
  position: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  organization_url: string | null;
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
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInterest {
  id: string;
  user_id: string;
  name: string;
  category: 'person' | 'technology' | 'company' | 'government' | 'topic' | 'other';
  description: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileRecommendation {
  id: string;
  recommended_user_id: string;
  recommender_user_id: string;
  relationship: string | null;
  recommendation_text: string;
  created_at: string;
  updated_at: string;
  recommender?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
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

// ===============================================
// SERVIÇO DE PERFIL ESTENDIDO
// ===============================================

class EnhancedProfileService {
  // ===============================================
  // MÉTODOS PRINCIPAIS DO PERFIL
  // ===============================================
  
  async getCompleteProfile(userId: string): Promise<ExtendedUserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!profile) return null;

      // Carregar todos os dados relacionados em paralelo
      const [
        skills,
        experiences,
        education,
        projects,
        certifications,
        courses,
        languages,
        organizations,
        services,
        interests,
        recommendations
      ] = await Promise.all([
        this.getProfileSkills(userId),
        this.getProfileExperiences(userId),
        this.getProfileEducation(userId),
        this.getProfileProjects(userId),
        this.getProfileCertifications(userId),
        this.getProfileCourses(userId),
        this.getProfileLanguages(userId),
        this.getProfileOrganizations(userId),
        this.getProfileServices(userId),
        this.getProfileInterests(userId),
        this.getProfileRecommendations(userId)
      ]);

      return {
        ...profile,
        skills,
        experiences,
        education,
        projects,
        certifications,
        courses,
        languages,
        organizations,
        services,
        interests,
        recommendations
      };
    } catch (error) {
      console.error('Error fetching complete profile:', error);
      throw error;
    }
  }

  async updateBasicProfile(userId: string, updates: Partial<ExtendedUserProfile>): Promise<ExtendedUserProfile> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      // Recalcular percentual de conclusão
      await this.updateProfileCompletion(userId);

      return profile;
    } catch (error) {
      console.error('Error updating basic profile:', error);
      throw error;
    }
  }

  // ===============================================
  // HABILIDADES (SKILLS)
  // ===============================================
  
  async getProfileSkills(userId: string): Promise<ExtendedProfileSkill[]> {
    try {
      const { data: skills, error } = await supabase
        .from('profile_skills')
        .select('*')
        .eq('user_id', userId)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!skills) return [];

      // Carregar endorsements para cada skill
      const skillsWithEndorsements = await Promise.all(
        skills.map(async (skill) => {
          const endorsements = await this.getSkillEndorsements(skill.id);
          return { ...skill, endorsements };
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
    skillData: {
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
      years_of_experience?: number;
      icon_name?: string;
      color?: string;
      is_featured?: boolean;
    }
  ): Promise<ExtendedProfileSkill> {
    try {
      const { data: skill, error } = await supabase
        .from('profile_skills')
        .insert([{ user_id: userId, ...skillData }])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);

      return { ...skill, endorsements: [] };
    } catch (error) {
      console.error('Error adding profile skill:', error);
      throw error;
    }
  }

  async updateProfileSkill(skillId: string, updates: Partial<ExtendedProfileSkill>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile_skills')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', skillId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile skill:', error);
      throw error;
    }
  }

  async removeProfileSkill(skillId: string): Promise<void> {
    try {
      // Remover endorsements primeiro
      await supabase
        .from('skill_endorsements')
        .delete()
        .eq('skill_id', skillId);

      // Remover skill
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

  // ===============================================
  // EXPERIÊNCIAS PROFISSIONAIS
  // ===============================================
  
  async getProfileExperiences(userId: string): Promise<ProfileExperience[]> {
    try {
      const { data: experiences, error } = await supabase
        .from('profile_experiences')
        .select('*')
        .eq('user_id', userId)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return experiences || [];
    } catch (error) {
      console.error('Error fetching profile experiences:', error);
      return [];
    }
  }

  async addProfileExperience(userId: string, experienceData: Omit<ProfileExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileExperience> {
    try {
      const { data: experience, error } = await supabase
        .from('profile_experiences')
        .insert([{ user_id: userId, ...experienceData }])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return experience;
    } catch (error) {
      console.error('Error adding profile experience:', error);
      throw error;
    }
  }

  // ===============================================
  // EDUCAÇÃO
  // ===============================================
  
  async getProfileEducation(userId: string): Promise<ProfileEducation[]> {
    try {
      const { data: education, error } = await supabase
        .from('profile_education')
        .select('*')
        .eq('user_id', userId)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return education || [];
    } catch (error) {
      console.error('Error fetching profile education:', error);
      return [];
    }
  }

  async addProfileEducation(userId: string, educationData: Omit<ProfileEducation, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileEducation> {
    try {
      const { data: education, error } = await supabase
        .from('profile_education')
        .insert([{ user_id: userId, ...educationData }])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return education;
    } catch (error) {
      console.error('Error adding profile education:', error);
      throw error;
    }
  }

  // ===============================================
  // PROJETOS
  // ===============================================
  
  async getProfileProjects(userId: string): Promise<ProfileProject[]> {
    try {
      const { data: projects, error } = await supabase
        .from('profile_projects')
        .select('*')
        .eq('user_id', userId)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return projects || [];
    } catch (error) {
      console.error('Error fetching profile projects:', error);
      return [];
    }
  }

  async addProfileProject(userId: string, projectData: Omit<ProfileProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileProject> {
    try {
      const { data: project, error } = await supabase
        .from('profile_projects')
        .insert([{ user_id: userId, ...projectData }])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return project;
    } catch (error) {
      console.error('Error adding profile project:', error);
      throw error;
    }
  }

  // ===============================================
  // CERTIFICAÇÕES
  // ===============================================
  
  async getProfileCertifications(userId: string): Promise<ProfileCertification[]> {
    try {
      const { data: certifications, error } = await supabase
        .from('profile_certifications')
        .select('*')
        .eq('user_id', userId)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return certifications || [];
    } catch (error) {
      console.error('Error fetching profile certifications:', error);
      return [];
    }
  }

  async addProfileCertification(userId: string, certificationData: Omit<ProfileCertification, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ProfileCertification> {
    try {
      const { data: certification, error } = await supabase
        .from('profile_certifications')
        .insert([{ user_id: userId, ...certificationData }])
        .select('*')
        .single();

      if (error) throw error;

      await this.updateProfileCompletion(userId);
      return certification;
    } catch (error) {
      console.error('Error adding profile certification:', error);
      throw error;
    }
  }

  // ===============================================
  // CURSOS
  // ===============================================
  
  async getProfileCourses(userId: string): Promise<ProfileCourse[]> {
    try {
      const { data: courses, error } = await supabase
        .from('profile_courses')
        .select('*')
        .eq('user_id', userId)
        .order('completion_date', { ascending: false });

      if (error) throw error;
      return courses || [];
    } catch (error) {
      console.error('Error fetching profile courses:', error);
      return [];
    }
  }

  // ===============================================
  // IDIOMAS
  // ===============================================
  
  async getProfileLanguages(userId: string): Promise<ProfileLanguage[]> {
    try {
      const { data: languages, error } = await supabase
        .from('profile_languages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return languages || [];
    } catch (error) {
      console.error('Error fetching profile languages:', error);
      return [];
    }
  }

  // ===============================================
  // ORGANIZAÇÕES
  // ===============================================
  
  async getProfileOrganizations(userId: string): Promise<ProfileOrganization[]> {
    try {
      const { data: organizations, error } = await supabase
        .from('profile_organizations')
        .select('*')
        .eq('user_id', userId)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return organizations || [];
    } catch (error) {
      console.error('Error fetching profile organizations:', error);
      return [];
    }
  }

  // ===============================================
  // SERVIÇOS
  // ===============================================
  
  async getProfileServices(userId: string): Promise<ProfileService[]> {
    try {
      const { data: services, error } = await supabase
        .from('profile_services')
        .select('*')
        .eq('user_id', userId)
        .order('is_active', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return services || [];
    } catch (error) {
      console.error('Error fetching profile services:', error);
      return [];
    }
  }

  // ===============================================
  // INTERESSES
  // ===============================================
  
  async getProfileInterests(userId: string): Promise<ProfileInterest[]> {
    try {
      const { data: interests, error } = await supabase
        .from('profile_interests')
        .select('*')
        .eq('user_id', userId)
        .order('category')
        .order('name');

      if (error) throw error;
      return interests || [];
    } catch (error) {
      console.error('Error fetching profile interests:', error);
      return [];
    }
  }

  // ===============================================
  // RECOMENDAÇÕES
  // ===============================================
  
  async getProfileRecommendations(userId: string): Promise<ProfileRecommendation[]> {
    try {
      const { data: recommendations, error } = await supabase
        .from('profile_recommendations')
        .select(`
          *,
          users!profile_recommendations_recommender_user_id_fkey (
            id,
            name,
            avatar,
            occupation
          )
        `)
        .eq('recommended_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return recommendations?.map(rec => ({
        ...rec,
        recommender: rec.users ? {
          id: rec.users.id,
          name: rec.users.name,
          avatar: rec.users.avatar,
          occupation: rec.users.occupation
        } : undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching profile recommendations:', error);
      return [];
    }
  }

  // ===============================================
  // MÉTODOS AUXILIARES
  // ===============================================
  
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
        endorser: endorsement.users ? {
          id: endorsement.users.id,
          name: endorsement.users.name,
          avatar: endorsement.users.avatar
        } : undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching skill endorsements:', error);
      return [];
    }
  }

  private async updateProfileCompletion(userId: string): Promise<void> {
    try {
      const profile = await this.getCompleteProfile(userId);
      if (!profile) return;

      let completionScore = 0;
      const maxScore = 100;

      // Informações básicas (30 pontos)
      if (profile.name) completionScore += 5;
      if (profile.email) completionScore += 3;
      if (profile.avatar) completionScore += 8;
      if (profile.occupation) completionScore += 4;
      if (profile.location) completionScore += 3;
      if (profile.description || profile.bio) completionScore += 7;

      // Habilidades (15 pontos)
      if (profile.skills && profile.skills.length > 0) completionScore += 8;
      if (profile.skills && profile.skills.length >= 5) completionScore += 7;

      // Experiência (20 pontos)
      if (profile.experiences && profile.experiences.length > 0) completionScore += 20;

      // Educação (10 pontos)
      if (profile.education && profile.education.length > 0) completionScore += 10;

      // Projetos (10 pontos)
      if (profile.projects && profile.projects.length > 0) completionScore += 10;

      // Redes sociais (5 pontos)
      if (profile.linkedin_url || profile.github_url) completionScore += 5;

      // Certificações (5 pontos)
      if (profile.certifications && profile.certifications.length > 0) completionScore += 5;

      // Idiomas (5 pontos)
      if (profile.languages && profile.languages.length > 0) completionScore += 5;

      const percentage = Math.min(completionScore, maxScore);

      await supabase
        .from('users')
        .update({ profile_completion_percentage: percentage })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating profile completion:', error);
    }
  }
}

export const enhancedProfileService = new EnhancedProfileService();