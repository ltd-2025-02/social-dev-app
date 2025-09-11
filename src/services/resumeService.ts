import { GeminiService } from './geminiService';
import { ResumeData, Education, Experience } from '../types/resume';

const CAREER_ASSISTANT_CONTEXT = `
Você é um "Assistente de Carreira Virtual", uma IA especialista em RH e design de currículos. 
Sua comunicação deve ser amigável, profissional, encorajadora e extremamente clara.
Seu objetivo é guiar o usuário passo a passo para criar um currículo elegante e eficaz.

IMPORTANTE: Sempre responda em português brasileiro, seja cordial e encorajador.
`;

export class ResumeService {
  static async improveJobDescription(originalDescription: string, position: string, company: string): Promise<string[]> {
    try {
      const prompt = `
      ${CAREER_ASSISTANT_CONTEXT}
      
      Aja como um especialista em RH. Melhore a seguinte descrição de cargo para um currículo, 
      usando verbos de ação e focando em resultados quantificáveis quando possível.
      
      Cargo: ${position}
      Empresa: ${company}
      Descrição original: "${originalDescription}"
      
      Forneça 2-3 versões melhoradas, cada uma em uma linha separada, começando com "•".
      Foque em realizações concretas e use linguagem profissional.
      `;

      const response = await GeminiService.sendMessage(prompt);
      
      // Parse the response to extract the improved descriptions
      const lines = response.split('\n').filter(line => line.trim().startsWith('•'));
      
      if (lines.length > 0) {
        return lines.map(line => line.replace('•', '').trim());
      } else {
        // Fallback if the format is different
        return [response.trim()];
      }
    } catch (error) {
      console.error('Erro ao melhorar descrição:', error);
      return [`Responsável por ${originalDescription.toLowerCase()}, contribuindo para o crescimento e sucesso da equipe.`];
    }
  }

  static getEducationLevelDisplay(level: string): string {
    const levels = {
      'fundamental': 'Ensino Fundamental',
      'medio': 'Ensino Médio',
      'tecnico': 'Curso Técnico',
      'superior': 'Ensino Superior',
      'pos-graduacao': 'Pós-graduação/Especialização',
      'mba': 'MBA',
      'mestrado': 'Mestrado',
      'doutorado': 'Doutorado',
      'pos-doutorado': 'Pós-Doutorado'
    };
    return levels[level as keyof typeof levels] || level;
  }

  static getLanguageLevelDisplay(level: string): string {
    const levels = {
      'basico': 'Básico',
      'intermediario': 'Intermediário',
      'avancado': 'Avançado',
      'fluente': 'Fluente'
    };
    return levels[level as keyof typeof levels] || level;
  }

  static generateResumePreview(resumeData: Partial<ResumeData>): string {
    let preview = '';
    
    if (resumeData.personalInfo) {
      preview += `📄 **${resumeData.personalInfo.fullName?.toUpperCase() || 'SEU NOME'}**\n`;
      preview += `📧 ${resumeData.personalInfo.email || '[email]'}\n`;
      preview += `📱 ${resumeData.personalInfo.phone || '[telefone]'}\n`;
      preview += `📍 ${resumeData.personalInfo.address || '[endereço]'}\n`;
      if (resumeData.personalInfo.portfolioUrl) {
        preview += `🌐 ${resumeData.personalInfo.portfolioUrl}\n`;
      }
      preview += '\n';
    }

    if (resumeData.education && resumeData.education.length > 0) {
      preview += '🎓 **FORMAÇÃO ACADÊMICA**\n';
      resumeData.education.forEach(edu => {
        preview += `• ${edu.course} - ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
      });
      preview += '\n';
    }

    if (resumeData.experience && resumeData.experience.length > 0) {
      preview += '💼 **EXPERIÊNCIA PROFISSIONAL**\n';
      resumeData.experience.forEach(exp => {
        preview += `• **${exp.position}** - ${exp.company}\n`;
        preview += `  ${exp.startDate} - ${exp.endDate}\n`;
        if (exp.description) {
          preview += `  ${exp.description}\n`;
        }
        preview += '\n';
      });
    }

    if (resumeData.projects && resumeData.projects.length > 0) {
      preview += '🚀 **PROJETOS**\n';
      resumeData.projects.forEach(project => {
        preview += `• **${project.name}** - ${project.role}\n`;
        preview += `  ${project.startDate} - ${project.endDate}\n`;
        if (project.description) {
          preview += `  ${project.description}\n`;
        }
        preview += '\n';
      });
    }

    if (resumeData.languages && resumeData.languages.length > 0) {
      preview += '🌍 **IDIOMAS**\n';
      resumeData.languages.forEach(lang => {
        preview += `• ${lang.name}: ${this.getLanguageLevelDisplay(lang.level)}\n`;
      });
      preview += '\n';
    }

    if (resumeData.certificates && resumeData.certificates.length > 0) {
      preview += '🏆 **CERTIFICAÇÕES**\n';
      resumeData.certificates.forEach(cert => {
        preview += `• ${cert.name} - ${cert.institution} (${cert.year})\n`;
      });
      preview += '\n';
    }

    if (resumeData.skills && resumeData.skills.length > 0) {
      preview += '⚡ **HABILIDADES**\n';
      preview += `${resumeData.skills.join(' • ')}\n`;
    }

    return preview || '📄 **Seu currículo aparecerá aqui conforme você adiciona informações...**';
  }

  static async generateWelcomeMessage(): Promise<string> {
    return `Olá! 👋 Sou seu assistente de carreira virtual e vou te ajudar a criar um currículo profissional e impactante. 

🎯 **Como funciona:**
• Vou fazer algumas perguntas sobre seus dados, educação e experiência
• A qualquer momento, você pode digitar **"preview"** para ver como o currículo está ficando
• Ao final, você poderá baixar nos formatos PDF, DOC ou DOCX

✨ **Vamos começar?** 

Para começar, me conte: **Qual é o seu nome completo (nome e sobrenome)?**`;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
    return phone;
  }
}