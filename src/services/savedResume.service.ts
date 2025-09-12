import { supabase } from '../lib/supabase';
import { ResumeData } from '../types/resume';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export interface SavedResume {
  id: string;
  user_id: string;
  template_id?: string;
  title: string;
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
    website?: string;
    profileImage?: string;
  };
  summary?: string;
  objective?: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    achievements: string[];
  }>;
  technical_skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
  }>;
  soft_skills: Array<{
    name: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: string;
    endDate?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  awards: any[];
  publications: any[];
  volunteer_work: any[];
  interests: string[];
  styling: {
    colorScheme: string;
    font: string;
    fontSize: number;
    layout: string;
    sectionOrder: string[];
  };
  status: 'draft' | 'completed' | 'archived';
  is_public: boolean;
  download_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'classic';
  preview_image_url?: string;
  template_data: {
    layout: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    sections: string[];
    fonts: {
      primary: string;
      secondary: string;
    };
  };
  is_premium: boolean;
}

class SavedResumeService {
  
  /**
   * Salva um currículo completo no banco de dados
   */
  async saveResume(
    userId: string, 
    resumeData: ResumeData, 
    title: string,
    templateId?: string
  ): Promise<SavedResume> {
    try {
      console.log('💾 Salvando currículo no banco de dados...');

      const resumeToSave = {
        user_id: userId,
        template_id: templateId,
        title,
        personal_info: resumeData.personalInfo,
        summary: resumeData.summary,
        objective: resumeData.objective,
        experience: resumeData.experience,
        education: resumeData.education,
        technical_skills: resumeData.skills.filter(s => s.category !== 'soft'),
        soft_skills: resumeData.skills.filter(s => s.category === 'soft'),
        projects: resumeData.projects,
        certifications: resumeData.certificates,
        languages: resumeData.languages,
        awards: [],
        publications: [],
        volunteer_work: [],
        interests: [],
        styling: {
          colorScheme: 'blue',
          font: 'Inter',
          fontSize: 12,
          layout: 'traditional',
          sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
        },
        status: 'completed' as const
      };

      const { data, error } = await supabase
        .from('user_resumes')
        .insert(resumeToSave)
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar currículo:', error);
        throw new Error(`Erro ao salvar currículo: ${error.message}`);
      }

      console.log('✅ Currículo salvo com sucesso!');
      return data as SavedResume;

    } catch (error) {
      console.error('Erro no SavedResumeService.saveResume:', error);
      throw error;
    }
  }

  /**
   * Busca todos os currículos do usuário
   */
  async getUserResumes(userId: string): Promise<SavedResume[]> {
    try {
      console.log('📄 Buscando currículos do usuário...');

      const { data, error } = await supabase
        .from('user_resumes')
        .select(`
          *,
          template:resume_templates(name, category, preview_image_url)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar currículos:', error);
        throw new Error(`Erro ao buscar currículos: ${error.message}`);
      }

      console.log(`📄 ${data?.length || 0} currículos encontrados`);
      return data || [];

    } catch (error) {
      console.error('Erro no SavedResumeService.getUserResumes:', error);
      throw error;
    }
  }

  /**
   * Busca um currículo específico por ID
   */
  async getResumeById(resumeId: string): Promise<SavedResume | null> {
    try {
      const { data, error } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (error) {
        console.error('Erro ao buscar currículo:', error);
        return null;
      }

      return data as SavedResume;

    } catch (error) {
      console.error('Erro no SavedResumeService.getResumeById:', error);
      return null;
    }
  }

  /**
   * Atualiza um currículo existente
   */
  async updateResume(resumeId: string, updates: Partial<SavedResume>): Promise<SavedResume> {
    try {
      const { data, error } = await supabase
        .from('user_resumes')
        .update(updates)
        .eq('id', resumeId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar currículo:', error);
        throw new Error(`Erro ao atualizar currículo: ${error.message}`);
      }

      return data as SavedResume;

    } catch (error) {
      console.error('Erro no SavedResumeService.updateResume:', error);
      throw error;
    }
  }

  /**
   * Remove um currículo
   */
  async deleteResume(resumeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_resumes')
        .delete()
        .eq('id', resumeId);

      if (error) {
        console.error('Erro ao remover currículo:', error);
        throw new Error(`Erro ao remover currículo: ${error.message}`);
      }

      console.log('🗑️ Currículo removido com sucesso');

    } catch (error) {
      console.error('Erro no SavedResumeService.deleteResume:', error);
      throw error;
    }
  }

  /**
   * Busca templates disponíveis
   */
  async getResumeTemplates(): Promise<ResumeTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar templates:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Erro no SavedResumeService.getResumeTemplates:', error);
      return [];
    }
  }

  /**
   * Gera e faz download do currículo em PDF
   */
  async downloadResume(
    resume: SavedResume, 
    format: 'pdf' | 'docx' | 'html' = 'pdf'
  ): Promise<void> {
    try {
      console.log(`📥 Iniciando download do currículo em ${format.toUpperCase()}...`);

      // Registrar download no banco
      await this.trackDownload(resume.id, resume.user_id, format);

      // Gerar conteúdo HTML do currículo
      const htmlContent = this.generateResumeHTML(resume);

      // Criar arquivo temporário
      const fileName = `${resume.title.replace(/\s+/g, '_')}_${Date.now()}.${format === 'html' ? 'html' : 'pdf'}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      if (format === 'html') {
        // Salvar HTML
        await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } else {
        // Para PDF, seria necessário uma biblioteca como react-native-html-to-pdf
        // Por enquanto, salvamos como HTML
        await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format === 'html' ? 'text/html' : 'application/pdf',
          dialogTitle: `Compartilhar ${resume.title}`
        });
      } else {
        Alert.alert('Sucesso', `Currículo salvo em: ${fileUri}`);
      }

      // Atualizar contador de downloads
      await this.updateResume(resume.id, {
        download_count: resume.download_count + 1
      });

      console.log('✅ Download concluído com sucesso!');

    } catch (error) {
      console.error('Erro ao fazer download:', error);
      Alert.alert('Erro', 'Não foi possível fazer o download do currículo.');
      throw error;
    }
  }

  /**
   * Compartilha um currículo
   */
  async shareResume(resumeId: string, userId: string, shareType: 'link' | 'email' | 'whatsapp' = 'link'): Promise<string> {
    try {
      console.log(`🔗 Criando link de compartilhamento...`);

      const { data, error } = await supabase
        .from('resume_shares')
        .insert({
          resume_id: resumeId,
          user_id: userId,
          share_type: shareType,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        })
        .select('share_token')
        .single();

      if (error) {
        console.error('Erro ao criar compartilhamento:', error);
        throw new Error(`Erro ao criar compartilhamento: ${error.message}`);
      }

      const shareUrl = `https://socialdev.app/resume/${data.share_token}`;
      
      // Atualizar contador de compartilhamentos
      await supabase
        .from('user_resumes')
        .update({
          share_count: supabase.rpc('increment_share_count', { resume_id: resumeId })
        })
        .eq('id', resumeId);

      console.log('✅ Link de compartilhamento criado!');
      return shareUrl;

    } catch (error) {
      console.error('Erro no SavedResumeService.shareResume:', error);
      throw error;
    }
  }

  /**
   * Registra um download no sistema de analytics
   */
  private async trackDownload(resumeId: string, userId: string, format: string): Promise<void> {
    try {
      await supabase
        .from('resume_downloads')
        .insert({
          resume_id: resumeId,
          user_id: userId,
          format,
          file_size: 0 // Seria calculado no mundo real
        });
    } catch (error) {
      console.error('Erro ao registrar download:', error);
      // Não propagar o erro, é apenas para analytics
    }
  }

  /**
   * Gera HTML do currículo para visualização/download
   */
  private generateResumeHTML(resume: SavedResume): string {
    const { personal_info, experience, education, technical_skills, projects, certifications } = resume;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .name { font-size: 2.5em; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
        .contact { font-size: 1.1em; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 1.4em; font-weight: bold; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; }
        .experience-item, .education-item, .project-item { margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .item-title { font-weight: bold; color: #2c3e50; }
        .item-company { color: #3498db; font-weight: 600; }
        .item-date { color: #666; font-style: italic; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .skill-item { background: #e3f2fd; padding: 8px 12px; border-radius: 20px; text-align: center; }
        .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personal_info.fullName}</div>
        <div class="contact">
            ${personal_info.email} ${personal_info.phone ? '• ' + personal_info.phone : ''}<br>
            ${personal_info.address || ''}
            ${personal_info.linkedin ? '<br>LinkedIn: ' + personal_info.linkedin : ''}
            ${personal_info.github ? '<br>GitHub: ' + personal_info.github : ''}
        </div>
    </div>

    ${resume.summary ? `
    <div class="section">
        <div class="section-title">Resumo Profissional</div>
        <div class="summary">${resume.summary}</div>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Experiência Profissional</div>
        ${experience.map(exp => `
        <div class="experience-item">
            <div class="item-title">${exp.position}</div>
            <div class="item-company">${exp.company}</div>
            <div class="item-date">${exp.startDate} - ${exp.current ? 'Atual' : exp.endDate}</div>
            <p style="margin-top: 10px;">${exp.description}</p>
            ${exp.achievements.length > 0 ? `
            <ul style="margin-top: 10px;">
                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Formação Acadêmica</div>
        ${education.map(edu => `
        <div class="education-item">
            <div class="item-title">${edu.degree} em ${edu.field}</div>
            <div class="item-company">${edu.institution}</div>
            <div class="item-date">${edu.startDate} - ${edu.current ? 'Em andamento' : edu.endDate}</div>
            ${edu.gpa ? `<p style="margin-top: 5px;">GPA: ${edu.gpa}</p>` : ''}
        </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Habilidades Técnicas</div>
        <div class="skills-grid">
            ${technical_skills.map(skill => `
            <div class="skill-item">${skill.name} (${skill.level})</div>
            `).join('')}
        </div>
    </div>

    ${projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projetos</div>
        ${projects.map(project => `
        <div class="project-item">
            <div class="item-title">${project.name}</div>
            <div class="item-date">${project.startDate} - ${project.endDate || 'Atual'}</div>
            <p style="margin-top: 10px;">${project.description}</p>
            <p style="margin-top: 5px;"><strong>Tecnologias:</strong> ${project.technologies.join(', ')}</p>
            ${project.url ? `<p><strong>URL:</strong> <a href="${project.url}">${project.url}</a></p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certificações</div>
        ${certifications.map(cert => `
        <div class="experience-item">
            <div class="item-title">${cert.name}</div>
            <div class="item-company">${cert.issuer}</div>
            <div class="item-date">${cert.issueDate}${cert.expirationDate ? ' - ' + cert.expirationDate : ''}</div>
            ${cert.credentialId ? `<p><strong>ID:</strong> ${cert.credentialId}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
        Currículo gerado pelo SocialDev - ${new Date().toLocaleDateString('pt-BR')}
    </div>
</body>
</html>
    `;
  }

  /**
   * Obtém estatísticas dos currículos do usuário
   */
  async getUserStats(userId: string): Promise<{
    totalResumes: number;
    completedResumes: number;
    draftResumes: number;
    totalDownloads: number;
    totalShares: number;
    lastActivity: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_resume_summary', { p_user_id: userId });

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
          totalResumes: 0,
          completedResumes: 0,
          draftResumes: 0,
          totalDownloads: 0,
          totalShares: 0,
          lastActivity: null
        };
      }

      const stats = data[0] || {};
      return {
        totalResumes: stats.total_count || 0,
        completedResumes: stats.completed_count || 0,
        draftResumes: stats.draft_count || 0,
        totalDownloads: stats.total_downloads || 0,
        totalShares: stats.total_shares || 0,
        lastActivity: stats.last_activity || null
      };

    } catch (error) {
      console.error('Erro no SavedResumeService.getUserStats:', error);
      return {
        totalResumes: 0,
        completedResumes: 0,
        draftResumes: 0,
        totalDownloads: 0,
        totalShares: 0,
        lastActivity: null
      };
    }
  }
}

export const savedResumeService = new SavedResumeService();