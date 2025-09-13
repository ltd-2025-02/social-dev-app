import { supabase } from '../lib/supabase';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  occupation?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  persona_id?: string;
  avatar?: string;
  socialLinks?: SocialLink[];
  experiences?: Experience[];
  education?: Education[];
  projects?: Project[];
  skills?: Skill[];
  languages?: Language[];
  certificates?: Certificate[];
  courses?: Course[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  field: string;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  url?: string;
  repository?: string;
}

interface Skill {
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
  category: string;
}

interface Language {
  language: string;
  proficiency: 'Básico' | 'Intermediário' | 'Avançado' | 'Nativo';
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

interface Course {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  duration: string;
  certificate?: string;
}

export class EnhancedProfileService {
  /**
   * Buscar perfil completo do usuário
   */
  async getFullProfile(userId: string): Promise<ProfileData | null> {
    try {
      console.log('🔍 Buscando perfil completo...');
      
      // Buscar dados básicos do perfil
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      if (!profile) {
        return null;
      }

      // Buscar dados adicionais em paralelo
      const [
        socialLinksData,
        experiencesData,
        educationData,
        projectsData,
        skillsData,
        languagesData,
        certificatesData,
        coursesData
      ] = await Promise.all([
        this.getSocialLinks(userId),
        this.getExperiences(userId),
        this.getEducation(userId),
        this.getProjects(userId),
        this.getSkills(userId),
        this.getLanguages(userId),
        this.getCertificates(userId),
        this.getCourses(userId),
      ]);

      return {
        ...profile,
        socialLinks: socialLinksData,
        experiences: experiencesData,
        education: educationData,
        projects: projectsData,
        skills: skillsData,
        languages: languagesData,
        certificates: certificatesData,
        courses: coursesData,
      };

    } catch (error) {
      console.error('Erro ao buscar perfil completo:', error);
      throw error;
    }
  }

  /**
   * Atualizar perfil completo
   */
  async updateFullProfile(userId: string, profileData: ProfileData): Promise<void> {
    try {
      console.log('💾 Salvando perfil completo...');

      // Começar transação
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          occupation: profileData.occupation,
          company: profileData.company,
          location: profileData.location,
          bio: profileData.bio,
          website: profileData.website,
          persona_id: profileData.persona_id,
          avatar: profileData.avatar,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        throw profileError;
      }

      // Salvar dados adicionais em paralelo
      await Promise.all([
        this.updateSocialLinks(userId, profileData.socialLinks || []),
        this.updateExperiences(userId, profileData.experiences || []),
        this.updateEducation(userId, profileData.education || []),
        this.updateProjects(userId, profileData.projects || []),
        this.updateSkills(userId, profileData.skills || []),
        this.updateLanguages(userId, profileData.languages || []),
        this.updateCertificates(userId, profileData.certificates || []),
        this.updateCourses(userId, profileData.courses || []),
      ]);

      console.log('✅ Perfil salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error;
    }
  }

  /**
   * Upload de avatar
   */
  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      console.log('📸 Fazendo upload do avatar...');

      // Converter URI para blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileName = `avatar_${userId}_${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('✅ Avatar enviado com sucesso!');
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      throw error;
    }
  }

  // Métodos auxiliares para seções específicas

  private async getSocialLinks(userId: string): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('user_social_links')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  private async updateSocialLinks(userId: string, socialLinks: SocialLink[]): Promise<void> {
    // Deletar links existentes
    await supabase
      .from('user_social_links')
      .delete()
      .eq('user_id', userId);

    // Inserir novos links
    if (socialLinks.length > 0) {
      const { error } = await supabase
        .from('user_social_links')
        .insert(
          socialLinks.map(link => ({
            user_id: userId,
            ...link
          }))
        );

      if (error) throw error;
    }
  }

  private async getExperiences(userId: string): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('user_experiences')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data?.map(exp => ({
      id: exp.id,
      position: exp.position,
      company: exp.company,
      startDate: exp.start_date,
      endDate: exp.end_date,
      current: exp.current,
      description: exp.description,
      location: exp.location,
    })) || [];
  }

  private async updateExperiences(userId: string, experiences: Experience[]): Promise<void> {
    // Deletar experiências existentes
    await supabase
      .from('user_experiences')
      .delete()
      .eq('user_id', userId);

    // Inserir novas experiências
    if (experiences.length > 0) {
      const { error } = await supabase
        .from('user_experiences')
        .insert(
          experiences.map(exp => ({
            id: exp.id,
            user_id: userId,
            position: exp.position,
            company: exp.company,
            start_date: exp.startDate,
            end_date: exp.endDate,
            current: exp.current,
            description: exp.description,
            location: exp.location,
          }))
        );

      if (error) throw error;
    }
  }

  private async getEducation(userId: string): Promise<Education[]> {
    const { data, error } = await supabase
      .from('user_education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data?.map(edu => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.start_date,
      endDate: edu.end_date,
      current: edu.current,
      field: edu.field,
      gpa: edu.gpa,
    })) || [];
  }

  private async updateEducation(userId: string, education: Education[]): Promise<void> {
    // Deletar educação existente
    await supabase
      .from('user_education')
      .delete()
      .eq('user_id', userId);

    // Inserir nova educação
    if (education.length > 0) {
      const { error } = await supabase
        .from('user_education')
        .insert(
          education.map(edu => ({
            id: edu.id,
            user_id: userId,
            degree: edu.degree,
            institution: edu.institution,
            start_date: edu.startDate,
            end_date: edu.endDate,
            current: edu.current,
            field: edu.field,
            gpa: edu.gpa,
          }))
        );

      if (error) throw error;
    }
  }

  private async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data?.map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies || [],
      startDate: proj.start_date,
      endDate: proj.end_date,
      url: proj.url,
      repository: proj.repository,
    })) || [];
  }

  private async updateProjects(userId: string, projects: Project[]): Promise<void> {
    // Deletar projetos existentes
    await supabase
      .from('user_projects')
      .delete()
      .eq('user_id', userId);

    // Inserir novos projetos
    if (projects.length > 0) {
      const { error } = await supabase
        .from('user_projects')
        .insert(
          projects.map(proj => ({
            id: proj.id,
            user_id: userId,
            name: proj.name,
            description: proj.description,
            technologies: proj.technologies,
            start_date: proj.startDate,
            end_date: proj.endDate,
            url: proj.url,
            repository: proj.repository,
          }))
        );

      if (error) throw error;
    }
  }

  private async getSkills(userId: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  private async updateSkills(userId: string, skills: Skill[]): Promise<void> {
    // Deletar skills existentes
    await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', userId);

    // Inserir novas skills
    if (skills.length > 0) {
      const { error } = await supabase
        .from('user_skills')
        .insert(
          skills.map(skill => ({
            user_id: userId,
            ...skill
          }))
        );

      if (error) throw error;
    }
  }

  private async getLanguages(userId: string): Promise<Language[]> {
    const { data, error } = await supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  private async updateLanguages(userId: string, languages: Language[]): Promise<void> {
    // Deletar idiomas existentes
    await supabase
      .from('user_languages')
      .delete()
      .eq('user_id', userId);

    // Inserir novos idiomas
    if (languages.length > 0) {
      const { error } = await supabase
        .from('user_languages')
        .insert(
          languages.map(lang => ({
            user_id: userId,
            ...lang
          }))
        );

      if (error) throw error;
    }
  }

  private async getCertificates(userId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('user_certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issue_date,
      expiryDate: cert.expiry_date,
      credentialId: cert.credential_id,
      url: cert.url,
    })) || [];
  }

  private async updateCertificates(userId: string, certificates: Certificate[]): Promise<void> {
    // Deletar certificados existentes
    await supabase
      .from('user_certificates')
      .delete()
      .eq('user_id', userId);

    // Inserir novos certificados
    if (certificates.length > 0) {
      const { error } = await supabase
        .from('user_certificates')
        .insert(
          certificates.map(cert => ({
            id: cert.id,
            user_id: userId,
            name: cert.name,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            expiry_date: cert.expiryDate,
            credential_id: cert.credentialId,
            url: cert.url,
          }))
        );

      if (error) throw error;
    }
  }

  private async getCourses(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', userId)
      .order('completion_date', { ascending: false });

    if (error) throw error;
    return data?.map(course => ({
      id: course.id,
      name: course.name,
      provider: course.provider,
      completionDate: course.completion_date,
      duration: course.duration,
      certificate: course.certificate,
    })) || [];
  }

  private async updateCourses(userId: string, courses: Course[]): Promise<void> {
    // Deletar cursos existentes
    await supabase
      .from('user_courses')
      .delete()
      .eq('user_id', userId);

    // Inserir novos cursos
    if (courses.length > 0) {
      const { error } = await supabase
        .from('user_courses')
        .insert(
          courses.map(course => ({
            id: course.id,
            user_id: userId,
            name: course.name,
            provider: course.provider,
            completion_date: course.completionDate,
            duration: course.duration,
            certificate: course.certificate,
          }))
        );

      if (error) throw error;
    }
  }

  /**
   * Buscar estatísticas do perfil
   */
  async getProfileStats(userId: string) {
    try {
      const [
        experiencesCount,
        educationCount,
        projectsCount,
        skillsCount,
        certificatesCount
      ] = await Promise.all([
        supabase.from('user_experiences').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_education').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_projects').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_skills').select('name', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_certificates').select('id', { count: 'exact' }).eq('user_id', userId),
      ]);

      return {
        experiences: experiencesCount.count || 0,
        education: educationCount.count || 0,
        projects: projectsCount.count || 0,
        skills: skillsCount.count || 0,
        certificates: certificatesCount.count || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        experiences: 0,
        education: 0,
        projects: 0,
        skills: 0,
        certificates: 0,
      };
    }
  }
}

export const enhancedProfileService = new EnhancedProfileService();