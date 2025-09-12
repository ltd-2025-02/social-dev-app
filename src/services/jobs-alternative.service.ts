import { Job, JobFilters } from './jobs.service';

// Brazilian job market data for mock jobs when APIs fail
const BRAZILIAN_COMPANIES = [
  { name: 'Nubank', logo: 'https://logo.clearbit.com/nubank.com.br', industry: 'Fintech' },
  { name: 'Magazine Luiza', logo: 'https://logo.clearbit.com/magazineluiza.com.br', industry: 'E-commerce' },
  { name: 'PicPay', logo: 'https://logo.clearbit.com/picpay.com', industry: 'Fintech' },
  { name: 'iFood', logo: 'https://logo.clearbit.com/ifood.com.br', industry: 'Delivery' },
  { name: 'Stone', logo: 'https://logo.clearbit.com/stone.com.br', industry: 'Payments' },
  { name: 'BTG Pactual', logo: 'https://logo.clearbit.com/btgpactual.com', industry: 'Banking' },
  { name: 'Itaú', logo: 'https://logo.clearbit.com/itau.com.br', industry: 'Banking' },
  { name: 'C6 Bank', logo: 'https://logo.clearbit.com/c6bank.com.br', industry: 'Banking' },
  { name: 'Mercado Livre', logo: 'https://logo.clearbit.com/mercadolivre.com.br', industry: 'E-commerce' },
  { name: 'Shopee', logo: 'https://logo.clearbit.com/shopee.com.br', industry: 'E-commerce' },
  { name: 'Localiza', logo: 'https://logo.clearbit.com/localiza.com', industry: 'Car Rental' },
  { name: 'QuintoAndar', logo: 'https://logo.clearbit.com/quintoandar.com.br', industry: 'Real Estate' },
  { name: 'Loft', logo: 'https://logo.clearbit.com/loft.com.br', industry: 'Real Estate' },
  { name: 'Creditas', logo: 'https://logo.clearbit.com/creditas.com', industry: 'Fintech' },
  { name: 'Banco Inter', logo: 'https://logo.clearbit.com/bancointer.com.br', industry: 'Banking' },
  { name: 'XP Inc', logo: 'https://logo.clearbit.com/xpi.com.br', industry: 'Fintech' },
  { name: '99', logo: 'https://logo.clearbit.com/99app.com', industry: 'Mobility' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', industry: 'Mobility' },
  { name: 'Rappi', logo: 'https://logo.clearbit.com/rappi.com', industry: 'Delivery' },
  { name: 'Tembici', logo: 'https://logo.clearbit.com/tembici.com.br', industry: 'Mobility' }
];

const JOB_TITLES_BY_LEVEL = {
  junior: [
    'Desenvolvedor Frontend Júnior',
    'Desenvolvedor Backend Júnior', 
    'Desenvolvedor Mobile Júnior',
    'Desenvolvedor React Júnior',
    'Desenvolvedor Full Stack Júnior',
    'Programador Júnior',
    'Analista de Sistemas Júnior',
    'Desenvolvedor JavaScript Júnior',
    'Desenvolvedor Python Júnior',
    'Estagiário em Desenvolvimento'
  ],
  pleno: [
    'Desenvolvedor Frontend',
    'Desenvolvedor Backend',
    'Desenvolvedor Mobile',
    'Desenvolvedor React Native',
    'Desenvolvedor Full Stack',
    'Analista Desenvolvedor',
    'Desenvolvedor Node.js',
    'Desenvolvedor React',
    'Desenvolvedor Vue.js',
    'Desenvolvedor Angular',
    'Desenvolvedor Flutter',
    'Desenvolvedor iOS',
    'Desenvolvedor Android'
  ],
  senior: [
    'Desenvolvedor Frontend Sênior',
    'Desenvolvedor Backend Sênior',
    'Desenvolvedor Mobile Sênior',
    'Desenvolvedor Full Stack Sênior',
    'Arquiteto de Software',
    'Tech Lead',
    'Desenvolvedor Principal',
    'Senior Software Engineer',
    'Especialista em Frontend',
    'Especialista em Backend'
  ],
  lead: [
    'Tech Lead',
    'Líder Técnico',
    'Arquiteto de Sistemas',
    'Engineering Manager',
    'Head of Engineering',
    'Principal Engineer',
    'Staff Engineer',
    'Coordenador de Desenvolvimento',
    'Gerente de Engenharia',
    'CTO'
  ]
};

const TECHNOLOGIES_BY_AREA = {
  frontend: ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass', 'Tailwind'],
  backend: ['Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 'Go', 'Django', 'Spring Boot', 'Laravel'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'DynamoDB'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'GitLab CI', 'Terraform'],
  tools: ['Git', 'GitHub', 'Jira', 'Slack', 'VS Code', 'Postman']
};

const BRAZILIAN_LOCATIONS = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ', 
  'Belo Horizonte, MG',
  'Brasília, DF',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Recife, PE',
  'Salvador, BA',
  'Fortaleza, CE',
  'Campinas, SP',
  'Florianópolis, SC',
  'Goiânia, GO',
  'Remoto',
  'Híbrido - São Paulo',
  'Híbrido - Rio de Janeiro'
];

const SALARY_RANGES = {
  junior: ['R$ 3.000 - R$ 5.000', 'R$ 3.500 - R$ 5.500', 'R$ 4.000 - R$ 6.000', 'R$ 2.800 - R$ 4.800'],
  pleno: ['R$ 5.000 - R$ 8.000', 'R$ 6.000 - R$ 9.000', 'R$ 5.500 - R$ 8.500', 'R$ 7.000 - R$ 10.000'],
  senior: ['R$ 8.000 - R$ 14.000', 'R$ 9.000 - R$ 15.000', 'R$ 10.000 - R$ 16.000', 'R$ 12.000 - R$ 18.000'],
  lead: ['R$ 15.000 - R$ 25.000', 'R$ 18.000 - R$ 30.000', 'R$ 20.000 - R$ 35.000', 'R$ 16.000 - R$ 28.000']
};

class AlternativeJobsService {
  
  /**
   * Generate realistic mock jobs for Brazilian market
   */
  generateRealisticJobs(count: number = 30, filters: JobFilters = {}): Job[] {
    const jobs: Job[] = [];
    
    for (let i = 0; i < count; i++) {
      const level = this.getRandomLevel(filters.level);
      const company = this.getRandomCompany();
      const jobTitle = this.getRandomJobTitle(level);
      const location = this.getRandomLocation();
      const workType = this.determineWorkType(location);
      const technologies = this.generateTechnologies();
      const salaryRange = this.getRandomSalaryRange(level);
      
      const job: Job = {
        id: `realistic-job-${i + 1}`,
        title: jobTitle,
        company: company.name,
        location: location,
        type: workType,
        level: level,
        salary_range: salaryRange,
        description: this.generateJobDescription(jobTitle, company.name, technologies, level),
        requirements: this.generateRequirements(technologies, level),
        technologies: technologies,
        created_at: this.getRandomDate(),
        applications_count: Math.floor(Math.random() * 200) + 10,
        applied_by_user: false,
        is_featured: Math.random() > 0.8, // 20% chance of being featured
        company_logo: company.logo,
        apply_url: `https://jobs.lever.co/${company.name.toLowerCase().replace(/\s+/g, '')}`
      };
      
      jobs.push(job);
    }
    
    return this.filterJobs(jobs, filters);
  }
  
  /**
   * Get featured jobs (top companies, recent posts)
   */
  getFeaturedJobs(): Job[] {
    const topCompanies = BRAZILIAN_COMPANIES.slice(0, 6); // Top 6 companies
    const featuredJobs: Job[] = [];
    
    topCompanies.forEach((company, index) => {
      const level = index < 2 ? 'senior' : index < 4 ? 'pleno' : 'junior';
      const jobTitle = this.getRandomJobTitle(level);
      const technologies = this.generateTechnologies();
      
      const job: Job = {
        id: `featured-job-${index + 1}`,
        title: jobTitle,
        company: company.name,
        location: index % 3 === 0 ? 'Remoto' : BRAZILIAN_LOCATIONS[index % BRAZILIAN_LOCATIONS.length],
        type: index % 3 === 0 ? 'remote' : index % 2 === 0 ? 'hybrid' : 'onsite',
        level: level,
        salary_range: this.getRandomSalaryRange(level),
        description: this.generateJobDescription(jobTitle, company.name, technologies, level),
        requirements: this.generateRequirements(technologies, level),
        technologies: technologies,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Within last 7 days
        applications_count: Math.floor(Math.random() * 150) + 50,
        applied_by_user: false,
        is_featured: true,
        company_logo: company.logo,
        apply_url: `https://jobs.lever.co/${company.name.toLowerCase().replace(/\s+/g, '')}`
      };
      
      featuredJobs.push(job);
    });
    
    return featuredJobs;
  }
  
  private getRandomLevel(filterLevel?: string): 'junior' | 'pleno' | 'senior' | 'lead' {
    if (filterLevel && ['junior', 'pleno', 'senior', 'lead'].includes(filterLevel)) {
      return filterLevel as any;
    }
    
    const levels: ('junior' | 'pleno' | 'senior' | 'lead')[] = ['junior', 'pleno', 'senior', 'lead'];
    const weights = [0.25, 0.4, 0.25, 0.1]; // More pleno/senior jobs
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < levels.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return levels[i];
      }
    }
    
    return 'pleno';
  }
  
  private getRandomCompany() {
    return BRAZILIAN_COMPANIES[Math.floor(Math.random() * BRAZILIAN_COMPANIES.length)];
  }
  
  private getRandomJobTitle(level: string): string {
    const titles = JOB_TITLES_BY_LEVEL[level as keyof typeof JOB_TITLES_BY_LEVEL] || JOB_TITLES_BY_LEVEL.pleno;
    return titles[Math.floor(Math.random() * titles.length)];
  }
  
  private getRandomLocation(): string {
    return BRAZILIAN_LOCATIONS[Math.floor(Math.random() * BRAZILIAN_LOCATIONS.length)];
  }
  
  private determineWorkType(location: string): 'remote' | 'hybrid' | 'onsite' {
    if (location.includes('Remoto')) return 'remote';
    if (location.includes('Híbrido')) return 'hybrid';
    return Math.random() > 0.6 ? 'onsite' : Math.random() > 0.5 ? 'hybrid' : 'remote';
  }
  
  private generateTechnologies(): string[] {
    const allTechs = Object.values(TECHNOLOGIES_BY_AREA).flat();
    const techCount = Math.floor(Math.random() * 6) + 3; // 3-8 technologies
    const selectedTechs: string[] = [];
    
    // Ensure we have at least one from each major area
    const areas = Object.keys(TECHNOLOGIES_BY_AREA);
    const primaryArea = areas[Math.floor(Math.random() * areas.length)];
    selectedTechs.push(...this.getRandomFromArray(TECHNOLOGIES_BY_AREA[primaryArea as keyof typeof TECHNOLOGIES_BY_AREA], 2));
    
    // Fill remaining slots
    while (selectedTechs.length < techCount) {
      const tech = allTechs[Math.floor(Math.random() * allTechs.length)];
      if (!selectedTechs.includes(tech)) {
        selectedTechs.push(tech);
      }
    }
    
    return selectedTechs;
  }
  
  private getRandomSalaryRange(level: string): string {
    const ranges = SALARY_RANGES[level as keyof typeof SALARY_RANGES] || SALARY_RANGES.pleno;
    return ranges[Math.floor(Math.random() * ranges.length)];
  }
  
  private generateJobDescription(title: string, company: string, technologies: string[], level: string): string {
    const descriptions = [
      `${company} está buscando um(a) ${title} para integrar nosso time de tecnologia. Você trabalhará com ${technologies.slice(0, 3).join(', ')} em projetos inovadores que impactam milhões de usuários.`,
      
      `Oportunidade única na ${company}! Procuramos ${title} ${level} para trabalhar com ${technologies.slice(0, 2).join(' e ')} em soluções escaláveis e de alta performance.`,
      
      `Venha fazer parte do time da ${company}! Estamos contratando ${title} para atuar com ${technologies.slice(0, 3).join(', ')} e contribuir para produtos que transformam o mercado brasileiro.`,
      
      `A ${company} busca profissionais apaixonados por tecnologia para a posição de ${title}. Você utilizará ${technologies.slice(0, 4).join(', ')} para desenvolver soluções inovadoras.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  
  private generateRequirements(technologies: string[], level: string): string[] {
    const baseRequirements = [
      `Experiência com ${technologies[0]}`,
      `Conhecimento em ${technologies[1]}`,
      `Desenvolvimento com ${technologies[2] || 'JavaScript'}`
    ];
    
    const levelRequirements = {
      junior: ['1-3 anos de experiência', 'Conhecimentos básicos em Git', 'Inglês básico'],
      pleno: ['3-5 anos de experiência', 'Experiência com metodologias ágeis', 'Inglês intermediário'],
      senior: ['5+ anos de experiência', 'Liderança técnica', 'Arquitetura de sistemas', 'Inglês avançado'],
      lead: ['7+ anos de experiência', 'Gestão de equipes', 'Definição de arquitetura', 'Mentoria técnica']
    };
    
    return [
      ...baseRequirements,
      ...levelRequirements[level as keyof typeof levelRequirements] || levelRequirements.pleno
    ];
  }
  
  private getRandomDate(): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }
  
  private getRandomFromArray<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  private filterJobs(jobs: Job[], filters: JobFilters): Job[] {
    let filteredJobs = [...jobs];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.technologies.some(tech => tech.toLowerCase().includes(search)) ||
        job.description.toLowerCase().includes(search)
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
    
    if (filters.company) {
      const company = filters.company.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.company.toLowerCase().includes(company)
      );
    }
    
    return filteredJobs;
  }
}

export const alternativeJobsService = new AlternativeJobsService();