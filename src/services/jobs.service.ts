import axios from 'axios';

const SERP_API_KEY = '32c2077982745b4e01ebd5bd31b71d0b515e394647a09e0bbfa9ee0911802b0d';
const SERP_API_BASE_URL = 'https://serpapi.com/search.json';

export interface JobFilters {
  search?: string;
  location?: string;
  type?: 'remote' | 'hybrid' | 'onsite' | '';
  level?: 'junior' | 'pleno' | 'senior' | 'lead' | '';
  salary_min?: number;
  salary_max?: number;
  company?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  level: 'junior' | 'pleno' | 'senior' | 'lead';
  salary_range?: string;
  description: string;
  requirements: string[];
  technologies: string[];
  created_at: string;
  applications_count: number;
  applied_by_user: boolean;
  is_featured: boolean;
  company_logo?: string;
  apply_url?: string;
  employment_type?: string;
  posted_date?: string;
}

class JobsService {
  private jobsCache: Map<string, Job> = new Map();

  async testAPI(): Promise<boolean> {
    try {
      const params = {
        engine: 'google_jobs',
        q: 'desenvolvedor',
        location: 'Brazil',
        hl: 'en',
        api_key: SERP_API_KEY
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      console.log('API Test Response:', response.status, Object.keys(response.data));
      
      return response.status === 200 && !response.data.error;
    } catch (error: any) {
      console.error('API Test Failed:', error.response?.status, error.response?.data);
      return false;
    }
  }
  async searchJobs(filters: JobFilters = {}, page = 1): Promise<Job[]> {
    try {
      // Build tech-focused search query
      let query = filters.search || 'desenvolvedor';

      // Add level to query
      if (filters.level) {
        const levelMap = {
          'junior': 'junior',
          'pleno': 'pleno',
          'senior': 'senior',
          'lead': 'tech lead'
        };
        query = `${levelMap[filters.level]} ${query}`;
      }

      // Add tech keywords to improve results
      const techKeywords = ['react', 'javascript', 'python', 'java', 'mobile', 'frontend', 'backend', 'fullstack'];
      if (!techKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
        query += ' tecnologia programação';
      }

      // Add remote preference
      if (filters.type === 'remote') {
        query += ' remoto';
      }

      const params = {
        engine: 'google_jobs',
        q: query,
        location: filters.location || 'Brazil',
        hl: 'en',
        api_key: SERP_API_KEY
      };

      console.log('SerpAPI Request params:', params);
      
      const response = await axios.get(SERP_API_BASE_URL, { params });
      
      console.log('SerpAPI Response status:', response.status);
      console.log('SerpAPI Response data keys:', Object.keys(response.data));
      
      if (response.data.error) {
        console.error('SerpAPI Error:', response.data.error);
        throw new Error(response.data.error);
      }
      
      const jobs = response.data.jobs_results || [];
      console.log(`Found ${jobs.length} jobs`);

      const transformedJobs = jobs.map((job: any) => this.transformSerpJobToJob(job));
      
      // Cache the jobs for later retrieval
      transformedJobs.forEach(job => {
        this.jobsCache.set(job.id, job);
      });

      return transformedJobs;
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      
      // Return mock data if API fails
      return this.getMockJobs(filters);
    }
  }

  async getFeaturedJobs(): Promise<Job[]> {
    try {
      const params = {
        engine: 'google_jobs',
        q: 'desenvolvedor',
        location: 'Brazil',
        hl: 'en',
        api_key: SERP_API_KEY
      };

      console.log('SerpAPI Featured Jobs Request params:', params);
      const response = await axios.get(SERP_API_BASE_URL, { params });
      
      console.log('SerpAPI Featured Response status:', response.status);
      
      if (response.data.error) {
        console.error('SerpAPI Featured Error:', response.data.error);
        return this.getMockFeaturedJobs();
      }
      
      const jobs = response.data.jobs_results || [];
      console.log(`Found ${jobs.length} featured jobs`);

      const transformedJobs = jobs.map((job: any) => ({
        ...this.transformSerpJobToJob(job),
        is_featured: true
      }));
      
      // Cache the featured jobs too
      transformedJobs.forEach(job => {
        this.jobsCache.set(job.id, job);
      });

      return transformedJobs;
    } catch (error: any) {
      console.error('Error getting featured jobs:', error);
      if (error.response) {
        console.error('Featured Error response status:', error.response.status);
        console.error('Featured Error response data:', error.response.data);
      }
      return this.getMockFeaturedJobs();
    }
  }

  async getJobById(jobId: string): Promise<Job | null> {
    try {
      // First check cache
      const cachedJob = this.jobsCache.get(jobId);
      if (cachedJob) {
        console.log('Found job in cache:', jobId);
        return cachedJob;
      }

      // If not in cache, try to decode base64 jobId (from SerpAPI)
      try {
        const decodedJobData = JSON.parse(atob(jobId));
        console.log('Decoded job data:', decodedJobData);
        
        // Create a detailed job from the encoded data
        return {
          id: jobId,
          title: decodedJobData.job_title || 'Vaga de Desenvolvedor',
          company: decodedJobData.company_name || 'Empresa não informada',
          location: decodedJobData.address_city || 'Localização não informada',
          type: 'onsite' as const,
          level: 'pleno' as const,
          description: 'Detalhes da vaga não disponíveis. Entre em contato com a empresa para mais informações.',
          requirements: ['Experiência na área', 'Conhecimento técnico adequado'],
          technologies: ['JavaScript', 'React', 'Node.js'],
          created_at: new Date().toISOString(),
          applications_count: Math.floor(Math.random() * 50) + 10,
          applied_by_user: false,
          is_featured: false,
          apply_url: `https://www.google.com/search?q=${encodeURIComponent(decodedJobData.job_title + ' ' + decodedJobData.company_name)}&ibp=htl;jobs`
        };
      } catch (decodeError) {
        console.log('Could not decode job ID, returning null');
      }

      return null;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return null;
    }
  }

  async applyToJob(jobId: string, userId: string): Promise<void> {
    // Since we're using external job data, we'll just simulate the application
    // In a real app, you might want to store applications locally or redirect to external apply URLs
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`User ${userId} applied to job ${jobId}`);
        resolve();
      }, 1000);
    });
  }

  private transformSerpJobToJob(serpJob: any): Job {
    const id = serpJob.job_id || this.generateJobId(serpJob.title, serpJob.company_name);
    
    // Extract job level from title and description
    const level = this.extractJobLevel(serpJob.title, serpJob.description);
    
    // Extract job type (remote/hybrid/onsite)
    const type = this.extractJobType(serpJob.title, serpJob.description, serpJob.location);
    
    // Extract technologies from description
    const technologies = this.extractTechnologies(serpJob.description);
    
    // Extract requirements
    const requirements = this.extractRequirements(serpJob.description);

    return {
      id,
      title: serpJob.title || 'Vaga de Desenvolvedor',
      company: serpJob.company_name || 'Empresa não informada',
      location: serpJob.location || 'Localização não informada',
      type,
      level,
      salary_range: this.extractSalaryRange(serpJob.description),
      description: serpJob.description || '',
      requirements,
      technologies,
      created_at: serpJob.posted_at || new Date().toISOString(),
      applications_count: Math.floor(Math.random() * 50) + 10,
      applied_by_user: false,
      is_featured: false,
      company_logo: serpJob.thumbnail,
      apply_url: serpJob.apply_link,
      employment_type: serpJob.job_type,
      posted_date: serpJob.posted_at
    };
  }

  private generateJobId(title: string, company: string): string {
    return btoa(`${title}-${company}-${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private extractJobLevel(title: string, description: string): 'junior' | 'pleno' | 'senior' | 'lead' {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('senior') || text.includes('sênior') || text.includes('experiente')) {
      return 'senior';
    } else if (text.includes('junior') || text.includes('júnior') || text.includes('trainee') || text.includes('estagiário')) {
      return 'junior';
    } else if (text.includes('tech lead') || text.includes('líder') || text.includes('arquiteto') || text.includes('principal')) {
      return 'lead';
    } else {
      return 'pleno';
    }
  }

  private extractJobType(title: string, description: string, location: string): 'remote' | 'hybrid' | 'onsite' {
    const text = `${title} ${description} ${location}`.toLowerCase();
    
    if (text.includes('remoto') || text.includes('remote') || text.includes('home office')) {
      return 'remote';
    } else if (text.includes('híbrido') || text.includes('hybrid') || text.includes('presencial/remoto')) {
      return 'hybrid';
    } else {
      return 'onsite';
    }
  }

  private extractTechnologies(description: string): string[] {
    if (!description) return [];
    
    const techKeywords = [
      'React', 'React Native', 'Flutter', 'JavaScript', 'TypeScript', 'Node.js',
      'Python', 'Java', 'Swift', 'Kotlin', 'Android', 'iOS', 'Vue.js', 'Angular',
      'Next.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GraphQL', 'REST API',
      'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind', 'Figma', 'Firebase',
      'Laravel', 'Django', 'Spring', 'Ruby on Rails', 'PHP', 'C#', 'Go'
    ];
    
    const foundTechs = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    );
    
    return foundTechs.slice(0, 8); // Limit to 8 technologies
  }

  private extractRequirements(description: string): string[] {
    if (!description) return [];
    
    const requirements: string[] = [];
    
    // Look for common requirement patterns
    const patterns = [
      /experiência com (.+?)(?:\.|,|\n|$)/gi,
      /conhecimento em (.+?)(?:\.|,|\n|$)/gi,
      /domínio de (.+?)(?:\.|,|\n|$)/gi,
      /requisitos?:?\s*(.+?)(?:\n\n|\n-|\n\s*$)/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        const requirement = match[1].trim();
        if (requirement.length > 10 && requirement.length < 100) {
          requirements.push(requirement);
        }
      }
    });
    
    // Add some common requirements if none found
    if (requirements.length === 0) {
      requirements.push(
        'Experiência com desenvolvimento de software',
        'Conhecimento em metodologias ágeis',
        'Capacidade de trabalho em equipe'
      );
    }
    
    return requirements.slice(0, 5); // Limit to 5 requirements
  }

  private extractSalaryRange(description: string): string | undefined {
    if (!description) return undefined;
    
    const salaryPatterns = [
      /R\$\s*[\d.,]+\s*(?:a|até|-)\s*R\$\s*[\d.,]+/gi,
      /salário:\s*R\$\s*[\d.,]+/gi,
      /[\d.,]+\s*(?:mil|k)\s*(?:a|até|-)\s*[\d.,]+\s*(?:mil|k)/gi
    ];
    
    for (const pattern of salaryPatterns) {
      const match = description.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return undefined;
  }

  // Mock data methods for fallback
  private getMockJobs(filters: JobFilters): Job[] {
    const mockJobs = [
      {
        id: 'mock-1',
        title: 'Desenvolvedor React Native',
        company: 'TechCorp',
        location: 'São Paulo, SP',
        type: 'remote' as const,
        level: 'pleno' as const,
        salary_range: 'R$ 5.000 - R$ 8.000',
        description: 'Desenvolvimento de aplicativos mobile usando React Native...',
        requirements: ['React Native', 'TypeScript', 'Redux'],
        technologies: ['React Native', 'TypeScript', 'Redux', 'Firebase'],
        created_at: new Date().toISOString(),
        applications_count: 25,
        applied_by_user: false,
        is_featured: false,
      },
      {
        id: 'mock-2',
        title: 'Desenvolvedor Frontend Vue.js',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'remote' as const,
        level: 'senior' as const,
        salary_range: 'R$ 7.000 - R$ 12.000',
        description: 'Desenvolvimento de interfaces modernas com Vue.js...',
        requirements: ['Vue.js', 'JavaScript', 'HTML/CSS'],
        technologies: ['Vue.js', 'JavaScript', 'SASS', 'Node.js'],
        created_at: new Date().toISOString(),
        applications_count: 18,
        applied_by_user: false,
        is_featured: false,
      },
      {
        id: 'mock-3',
        title: 'Desenvolvedor Full Stack',
        company: 'DevCompany',
        location: 'Rio de Janeiro, RJ',
        type: 'hybrid' as const,
        level: 'junior' as const,
        salary_range: 'R$ 3.500 - R$ 5.500',
        description: 'Desenvolvimento full stack com Node.js e React...',
        requirements: ['Node.js', 'React', 'MongoDB'],
        technologies: ['Node.js', 'React', 'MongoDB', 'Express'],
        created_at: new Date().toISOString(),
        applications_count: 42,
        applied_by_user: false,
        is_featured: false,
      },
      {
        id: 'mock-4',
        title: 'Tech Lead Mobile',
        company: 'BigTech',
        location: 'Belo Horizonte, MG',
        type: 'onsite' as const,
        level: 'lead' as const,
        salary_range: 'R$ 12.000 - R$ 18.000',
        description: 'Liderança técnica em projetos mobile...',
        requirements: ['Liderança', 'React Native', 'Flutter'],
        technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
        created_at: new Date().toISOString(),
        applications_count: 8,
        applied_by_user: false,
        is_featured: false,
      },
      {
        id: 'mock-5',
        title: 'Desenvolvedor Python',
        company: 'DataScience Inc',
        location: 'Remote',
        type: 'remote' as const,
        level: 'pleno' as const,
        salary_range: 'R$ 6.000 - R$ 9.000',
        description: 'Desenvolvimento de APIs e análise de dados...',
        requirements: ['Python', 'Django', 'PostgreSQL'],
        technologies: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        created_at: new Date().toISOString(),
        applications_count: 31,
        applied_by_user: false,
        is_featured: false,
      },
    ];

    // Apply filters to mock data
    let filteredJobs = [...mockJobs];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.technologies.some(tech => tech.toLowerCase().includes(search))
      );
    }

    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }

    if (filters.level) {
      filteredJobs = filteredJobs.filter(job => job.level === filters.level);
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(location)
      );
    }

    return filteredJobs;
  }

  private getMockFeaturedJobs(): Job[] {
    return [
      {
        id: 'featured-1',
        title: 'Senior React Native Developer',
        company: 'Nubank',
        location: 'São Paulo, SP',
        type: 'hybrid' as const,
        level: 'senior' as const,
        salary_range: 'R$ 10.000 - R$ 15.000',
        description: 'Desenvolvimento de features para o app do Nubank...',
        requirements: ['React Native', 'TypeScript', 'Redux'],
        technologies: ['React Native', 'TypeScript', 'Redux', 'GraphQL'],
        created_at: new Date().toISOString(),
        applications_count: 156,
        applied_by_user: false,
        is_featured: true,
        company_logo: 'https://logo.clearbit.com/nubank.com.br'
      },
      {
        id: 'featured-2',
        title: 'Flutter Developer',
        company: 'iFood',
        location: 'Remote',
        type: 'remote' as const,
        level: 'pleno' as const,
        salary_range: 'R$ 8.000 - R$ 12.000',
        description: 'Desenvolvimento mobile com Flutter para delivery...',
        requirements: ['Flutter', 'Dart', 'Firebase'],
        technologies: ['Flutter', 'Dart', 'Firebase', 'REST API'],
        created_at: new Date().toISOString(),
        applications_count: 89,
        applied_by_user: false,
        is_featured: true,
        company_logo: 'https://logo.clearbit.com/ifood.com.br'
      },
      {
        id: 'featured-3',
        title: 'Mobile Engineer',
        company: 'Stone',
        location: 'Rio de Janeiro, RJ',
        type: 'hybrid' as const,
        level: 'senior' as const,
        salary_range: 'R$ 9.000 - R$ 14.000',
        description: 'Desenvolvimento de soluções móveis para pagamentos...',
        requirements: ['iOS', 'Android', 'React Native'],
        technologies: ['Swift', 'Kotlin', 'React Native', 'Firebase'],
        created_at: new Date().toISOString(),
        applications_count: 67,
        applied_by_user: false,
        is_featured: true,
        company_logo: 'https://logo.clearbit.com/stone.com.br'
      }
    ];
  }
}

export const jobsService = new JobsService();