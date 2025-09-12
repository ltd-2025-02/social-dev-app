// High-Quality Career Content Database
// Professional career tracks with comprehensive information

import { 
  CareerPath, 
  Skill, 
  CareerMilestone, 
  ProjectSuggestion,
  LearningResource,
  Certification,
  MentorshipOpportunity,
  MarketInsight 
} from '../types/career.types';

// =====================================================
// SKILLS DATABASE - Core Technologies & Competencies
// =====================================================

export const SKILLS_DATABASE: Skill[] = [
  // Frontend Development
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend',
    description: 'Linguagem de programação essencial para desenvolvimento web moderno. Base para frameworks como React, Vue e Angular.',
    difficulty: 'beginner',
    importance: 5,
    marketDemand: 5,
    averageSalaryImpact: 25.5,
    relatedSkills: ['typescript', 'react', 'nodejs', 'vue'],
    learningResources: [
      {
        id: 'js-mdn',
        title: 'JavaScript MDN Documentation',
        type: 'tutorial',
        url: 'https://developer.mozilla.org/docs/Web/JavaScript',
        provider: 'Mozilla',
        duration: 40,
        price: 0,
        rating: 4.8,
        difficulty: 'beginner',
        isPremium: false,
        skills: ['javascript']
      }
    ],
    certifications: []
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    description: 'Superset do JavaScript que adiciona tipagem estática, aumentando produtividade e reduzindo bugs em projetos grandes.',
    difficulty: 'intermediate',
    importance: 4,
    marketDemand: 4,
    averageSalaryImpact: 20.0,
    relatedSkills: ['javascript', 'react', 'angular', 'nodejs'],
    learningResources: [],
    certifications: []
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    description: 'Biblioteca JavaScript para construção de interfaces de usuário componetizadas e reativas.',
    difficulty: 'intermediate',
    importance: 5,
    marketDemand: 5,
    averageSalaryImpact: 30.0,
    relatedSkills: ['javascript', 'typescript', 'redux', 'nextjs'],
    learningResources: [],
    certifications: []
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend',
    description: 'Framework React para produção com funcionalidades como SSR, SSG e otimizações automáticas.',
    difficulty: 'intermediate',
    importance: 4,
    marketDemand: 4,
    averageSalaryImpact: 22.0,
    relatedSkills: ['react', 'javascript', 'typescript'],
    learningResources: [],
    certifications: []
  },

  // Backend Development
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    description: 'Runtime JavaScript server-side para desenvolvimento de APIs e aplicações backend escaláveis.',
    difficulty: 'intermediate',
    importance: 5,
    marketDemand: 5,
    averageSalaryImpact: 28.0,
    relatedSkills: ['javascript', 'typescript', 'express', 'mongodb'],
    learningResources: [],
    certifications: []
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    description: 'Linguagem versátil para desenvolvimento backend, data science, automação e inteligência artificial.',
    difficulty: 'beginner',
    importance: 5,
    marketDemand: 5,
    averageSalaryImpact: 26.0,
    relatedSkills: ['django', 'flask', 'pandas', 'tensorflow'],
    learningResources: [],
    certifications: []
  },

  // DevOps & Cloud
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    description: 'Plataforma de containerização para empacotamento e deploy de aplicações de forma consistente.',
    difficulty: 'intermediate',
    importance: 4,
    marketDemand: 5,
    averageSalaryImpact: 24.0,
    relatedSkills: ['kubernetes', 'aws', 'linux'],
    learningResources: [],
    certifications: []
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    description: 'Sistema de orquestração de containers para automatizar deployment, scaling e gerenciamento.',
    difficulty: 'advanced',
    importance: 4,
    marketDemand: 4,
    averageSalaryImpact: 35.0,
    relatedSkills: ['docker', 'aws', 'microservices'],
    learningResources: [],
    certifications: []
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    category: 'Cloud',
    description: 'Plataforma de cloud computing com serviços de infraestrutura, banco de dados e machine learning.',
    difficulty: 'intermediate',
    importance: 5,
    marketDemand: 5,
    averageSalaryImpact: 32.0,
    relatedSkills: ['docker', 'kubernetes', 'terraform'],
    learningResources: [],
    certifications: []
  }
];

// =====================================================
// CAREER PATHS - Comprehensive Development Tracks
// =====================================================

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Especialista em criar experiências de usuário excepcionais através de interfaces modernas, responsivas e performáticas.',
    category: 'development',
    experienceLevel: 'junior',
    averageSalary: {
      min: 4000,
      max: 15000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 5,
    growthProjection: 18.5,
    requiredSkills: [
      { skillId: 'javascript', level: 'advanced', importance: 5, timeToLearn: 3 },
      { skillId: 'react', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'typescript', level: 'intermediate', importance: 4, timeToLearn: 2 },
    ],
    optionalSkills: [
      { skillId: 'nextjs', level: 'intermediate', importance: 3, timeToLearn: 2 },
    ],
    roadmap: [
      {
        id: 'frontend-foundations',
        title: 'Fundamentos Frontend',
        description: 'Dominar HTML, CSS, JavaScript e conceitos básicos de design responsivo.',
        order: 1,
        estimatedTime: 3,
        requiredSkills: ['javascript', 'html', 'css'],
        outcomes: [
          'Criar páginas web responsivas',
          'Entender DOM e manipulação de elementos',
          'Aplicar princípios de UX/UI básicos'
        ],
        resources: ['mdn-docs', 'freecodecamp', 'css-tricks'],
        projects: [
          {
            id: 'portfolio-website',
            title: 'Site Portfolio Pessoal',
            description: 'Crie um portfolio profissional showcasing seus projetos e habilidades.',
            difficulty: 'beginner',
            estimatedTime: 20,
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            skills: ['javascript', 'css', 'responsive-design'],
            githubUrl: 'https://github.com/example/portfolio',
            liveUrl: 'https://portfolio.example.com'
          }
        ]
      },
      {
        id: 'react-mastery',
        title: 'Domínio do React',
        description: 'Tornar-se proficiente em React, hooks, state management e ecossistema.',
        order: 2,
        estimatedTime: 4,
        requiredSkills: ['react', 'javascript'],
        outcomes: [
          'Construir SPAs complexas com React',
          'Gerenciar estado com Context API e Redux',
          'Implementar roteamento e lazy loading'
        ],
        resources: ['react-docs', 'react-router', 'redux-toolkit'],
        projects: [
          {
            id: 'task-management-app',
            title: 'App de Gerenciamento de Tarefas',
            description: 'Aplicação completa com CRUD, autenticação e interface moderna.',
            difficulty: 'intermediate',
            estimatedTime: 40,
            technologies: ['React', 'TypeScript', 'Material-UI'],
            skills: ['react', 'typescript', 'state-management'],
          }
        ]
      },
      {
        id: 'advanced-frontend',
        title: 'Frontend Avançado',
        description: 'Otimização de performance, testes, acessibilidade e ferramentas de build.',
        order: 3,
        estimatedTime: 3,
        requiredSkills: ['react', 'typescript', 'testing'],
        outcomes: [
          'Implementar testes unitários e de integração',
          'Otimizar performance com code splitting',
          'Aplicar princípios de acessibilidade (a11y)'
        ],
        resources: ['jest', 'testing-library', 'webpack'],
        projects: [
          {
            id: 'ecommerce-frontend',
            title: 'Frontend E-commerce',
            description: 'Interface completa de e-commerce com carrinho, checkout e pagamentos.',
            difficulty: 'advanced',
            estimatedTime: 60,
            technologies: ['React', 'Next.js', 'TypeScript', 'Stripe'],
            skills: ['react', 'nextjs', 'typescript', 'payment-integration'],
          }
        ]
      }
    ],
    jobTitles: [
      'Desenvolvedor Frontend',
      'React Developer',
      'UI Developer',
      'Frontend Engineer',
      'JavaScript Developer'
    ],
    companies: [
      'Nubank',
      'iFood',
      'Magazine Luiza',
      'Stone',
      'PagSeguro',
      'Mercado Livre',
      'Globo.com',
      'B2W Digital'
    ],
    workStyle: 'remote',
    icon: 'desktop-outline',
    color: ['#3b82f6', '#1d4ed8'],
    tags: ['javascript', 'react', 'frontend', 'ui-ux']
  },

  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Arquiteto de sistemas robustos, APIs escaláveis e infraestrutura de dados que sustentam aplicações modernas.',
    category: 'development',
    experienceLevel: 'junior',
    averageSalary: {
      min: 5000,
      max: 18000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 5,
    growthProjection: 22.0,
    requiredSkills: [
      { skillId: 'nodejs', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'python', level: 'advanced', importance: 4, timeToLearn: 3 },
      { skillId: 'database', level: 'intermediate', importance: 5, timeToLearn: 3 },
    ],
    optionalSkills: [
      { skillId: 'docker', level: 'intermediate', importance: 4, timeToLearn: 2 },
      { skillId: 'aws', level: 'basic', importance: 3, timeToLearn: 3 },
    ],
    roadmap: [
      {
        id: 'backend-fundamentals',
        title: 'Fundamentos Backend',
        description: 'APIs REST, bancos de dados, autenticação e autorização.',
        order: 1,
        estimatedTime: 4,
        requiredSkills: ['nodejs', 'database', 'api-design'],
        outcomes: [
          'Criar APIs REST robustas',
          'Modelar bancos de dados relacionais',
          'Implementar autenticação JWT'
        ],
        resources: ['express-docs', 'postgres-tutorial', 'jwt-guide'],
        projects: [
          {
            id: 'blog-api',
            title: 'API de Blog',
            description: 'API completa com CRUD de posts, usuários e comentários.',
            difficulty: 'intermediate',
            estimatedTime: 35,
            technologies: ['Node.js', 'Express', 'PostgreSQL'],
            skills: ['nodejs', 'database', 'api-rest'],
          }
        ]
      },
      {
        id: 'scalable-architecture',
        title: 'Arquitetura Escalável',
        description: 'Microserviços, containers, cache e otimização de performance.',
        order: 2,
        estimatedTime: 5,
        requiredSkills: ['microservices', 'docker', 'cache'],
        outcomes: [
          'Arquitetar sistemas distribuídos',
          'Implementar cache strategies',
          'Deploy com containers'
        ],
        resources: ['microservices-guide', 'redis-docs', 'docker-tutorial'],
        projects: [
          {
            id: 'microservices-ecommerce',
            title: 'E-commerce Microserviços',
            description: 'Sistema distribuído com serviços de usuários, produtos e pedidos.',
            difficulty: 'advanced',
            estimatedTime: 80,
            technologies: ['Node.js', 'Docker', 'Redis', 'MongoDB'],
            skills: ['microservices', 'docker', 'database'],
          }
        ]
      }
    ],
    jobTitles: [
      'Desenvolvedor Backend',
      'Backend Engineer',
      'API Developer',
      'Node.js Developer',
      'Software Engineer'
    ],
    companies: [
      'Uber',
      'Netflix',
      'Spotify',
      '99',
      'QuintoAndar',
      'Creditas',
      'Loft',
      'Rappi'
    ],
    workStyle: 'remote',
    icon: 'server-outline',
    color: ['#10b981', '#059669'],
    tags: ['nodejs', 'python', 'api', 'database']
  },

  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    description: 'Profissional versátil capaz de desenvolver tanto o frontend quanto o backend, criando soluções completas end-to-end.',
    category: 'development',
    experienceLevel: 'mid',
    averageSalary: {
      min: 6000,
      max: 20000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 5,
    growthProjection: 25.0,
    requiredSkills: [
      { skillId: 'javascript', level: 'advanced', importance: 5, timeToLearn: 3 },
      { skillId: 'react', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'nodejs', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'database', level: 'intermediate', importance: 4, timeToLearn: 3 },
    ],
    optionalSkills: [
      { skillId: 'typescript', level: 'intermediate', importance: 4, timeToLearn: 2 },
      { skillId: 'aws', level: 'basic', importance: 3, timeToLearn: 3 },
    ],
    roadmap: [
      {
        id: 'fullstack-foundation',
        title: 'Base Full Stack',
        description: 'Integração frontend-backend, APIs e deploy completo.',
        order: 1,
        estimatedTime: 6,
        requiredSkills: ['react', 'nodejs', 'database'],
        outcomes: [
          'Conectar frontend React com backend Node.js',
          'Implementar autenticação completa',
          'Deploy de aplicação full stack'
        ],
        resources: ['mern-tutorial', 'deployment-guide'],
        projects: [
          {
            id: 'social-media-app',
            title: 'Rede Social Completa',
            description: 'Aplicação social com posts, likes, comentários e chat em tempo real.',
            difficulty: 'advanced',
            estimatedTime: 100,
            technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
            skills: ['react', 'nodejs', 'database', 'websockets'],
          }
        ]
      }
    ],
    jobTitles: [
      'Desenvolvedor Full Stack',
      'Full Stack Engineer',
      'Software Developer',
      'Web Developer',
      'JavaScript Developer'
    ],
    companies: [
      'Shopify',
      'Airbnb',
      'GitHub',
      'Stripe',
      'Vercel',
      'Atlassian',
      'Slack',
      'Discord'
    ],
    workStyle: 'remote',
    icon: 'layers-outline',
    color: ['#8b5cf6', '#7c3aed'],
    tags: ['fullstack', 'javascript', 'react', 'nodejs']
  },

  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    description: 'Especialista em desenvolvimento de aplicativos móveis nativos e cross-platform para iOS e Android.',
    category: 'development',
    experienceLevel: 'junior',
    averageSalary: {
      min: 4500,
      max: 16000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 4,
    growthProjection: 20.0,
    requiredSkills: [
      { skillId: 'react-native', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'javascript', level: 'advanced', importance: 5, timeToLearn: 3 },
      { skillId: 'mobile-ui', level: 'intermediate', importance: 4, timeToLearn: 2 },
    ],
    optionalSkills: [
      { skillId: 'flutter', level: 'intermediate', importance: 3, timeToLearn: 3 },
      { skillId: 'swift', level: 'basic', importance: 2, timeToLearn: 4 },
    ],
    roadmap: [
      {
        id: 'mobile-fundamentals',
        title: 'Fundamentos Mobile',
        description: 'Conceitos mobile, navegação, estado e APIs nativas.',
        order: 1,
        estimatedTime: 4,
        requiredSkills: ['react-native', 'mobile-navigation'],
        outcomes: [
          'Criar apps com navegação complexa',
          'Integrar APIs nativas',
          'Publicar nas app stores'
        ],
        resources: ['react-native-docs', 'expo-docs'],
        projects: [
          {
            id: 'weather-app',
            title: 'App de Clima',
            description: 'Aplicativo com geolocalização, previsão do tempo e notificações.',
            difficulty: 'intermediate',
            estimatedTime: 30,
            technologies: ['React Native', 'Expo', 'Weather API'],
            skills: ['react-native', 'api-integration', 'geolocation'],
          }
        ]
      }
    ],
    jobTitles: [
      'Desenvolvedor Mobile',
      'React Native Developer',
      'iOS Developer',
      'Android Developer',
      'Mobile Engineer'
    ],
    companies: [
      'WhatsApp',
      'Instagram',
      'Telegram',
      'iFood',
      'Uber',
      '99',
      'Nubank',
      'PicPay'
    ],
    workStyle: 'remote',
    icon: 'phone-portrait-outline',
    color: ['#f59e0b', '#d97706'],
    tags: ['mobile', 'react-native', 'ios', 'android']
  },

  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Especialista em automação, CI/CD, infraestrutura como código e cultura de colaboração entre desenvolvimento e operações.',
    category: 'devops',
    experienceLevel: 'mid',
    averageSalary: {
      min: 8000,
      max: 25000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 5,
    growthProjection: 28.0,
    requiredSkills: [
      { skillId: 'docker', level: 'advanced', importance: 5, timeToLearn: 3 },
      { skillId: 'kubernetes', level: 'advanced', importance: 5, timeToLearn: 5 },
      { skillId: 'aws', level: 'advanced', importance: 5, timeToLearn: 6 },
      { skillId: 'terraform', level: 'intermediate', importance: 4, timeToLearn: 3 },
    ],
    optionalSkills: [
      { skillId: 'ansible', level: 'intermediate', importance: 3, timeToLearn: 2 },
      { skillId: 'jenkins', level: 'intermediate', importance: 3, timeToLearn: 2 },
    ],
    roadmap: [
      {
        id: 'devops-foundation',
        title: 'Base DevOps',
        description: 'Containerização, orquestração e cloud computing.',
        order: 1,
        estimatedTime: 6,
        requiredSkills: ['docker', 'kubernetes', 'aws'],
        outcomes: [
          'Containerizar aplicações com Docker',
          'Orquestrar com Kubernetes',
          'Provisionar infraestrutura na AWS'
        ],
        resources: ['docker-docs', 'k8s-tutorial', 'aws-certified'],
        projects: [
          {
            id: 'microservices-k8s',
            title: 'Deploy Microserviços K8s',
            description: 'Pipeline completo de CI/CD para microserviços em Kubernetes.',
            difficulty: 'advanced',
            estimatedTime: 60,
            technologies: ['Docker', 'Kubernetes', 'AWS', 'GitLab CI'],
            skills: ['docker', 'kubernetes', 'cicd', 'aws'],
          }
        ]
      }
    ],
    jobTitles: [
      'DevOps Engineer',
      'Site Reliability Engineer',
      'Cloud Engineer',
      'Platform Engineer',
      'Infrastructure Engineer'
    ],
    companies: [
      'AWS',
      'Google Cloud',
      'Microsoft Azure',
      'HashiCorp',
      'Red Hat',
      'Docker',
      'Kubernetes',
      'GitLab'
    ],
    workStyle: 'remote',
    icon: 'cloud-outline',
    color: ['#8b5cf6', '#7c3aed'],
    tags: ['devops', 'docker', 'kubernetes', 'aws']
  },

  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Profissional que extrai insights valiosos de dados usando estatística, machine learning e programação.',
    category: 'data',
    experienceLevel: 'junior',
    averageSalary: {
      min: 6000,
      max: 22000,
      currency: 'BRL',
      location: 'Brasil'
    },
    marketDemand: 5,
    growthProjection: 30.0,
    requiredSkills: [
      { skillId: 'python', level: 'advanced', importance: 5, timeToLearn: 4 },
      { skillId: 'pandas', level: 'advanced', importance: 5, timeToLearn: 3 },
      { skillId: 'machine-learning', level: 'advanced', importance: 5, timeToLearn: 6 },
      { skillId: 'sql', level: 'advanced', importance: 4, timeToLearn: 2 },
    ],
    optionalSkills: [
      { skillId: 'tensorflow', level: 'intermediate', importance: 4, timeToLearn: 4 },
      { skillId: 'r', level: 'basic', importance: 2, timeToLearn: 3 },
    ],
    roadmap: [
      {
        id: 'data-science-foundation',
        title: 'Fundamentos Data Science',
        description: 'Análise exploratória, visualização e modelos preditivos básicos.',
        order: 1,
        estimatedTime: 5,
        requiredSkills: ['python', 'pandas', 'statistics'],
        outcomes: [
          'Realizar análise exploratória completa',
          'Criar visualizações eficazes',
          'Implementar modelos básicos de ML'
        ],
        resources: ['kaggle-learn', 'coursera-ml', 'python-data-science'],
        projects: [
          {
            id: 'sales-analysis',
            title: 'Análise de Vendas E-commerce',
            description: 'Dashboard completo com insights de vendas, sazonalidade e previsões.',
            difficulty: 'intermediate',
            estimatedTime: 40,
            technologies: ['Python', 'Pandas', 'Plotly', 'Jupyter'],
            skills: ['python', 'data-analysis', 'visualization'],
          }
        ]
      }
    ],
    jobTitles: [
      'Cientista de Dados',
      'Data Scientist',
      'Machine Learning Engineer',
      'Data Analyst',
      'AI Researcher'
    ],
    companies: [
      'Google',
      'Facebook',
      'Netflix',
      'Amazon',
      'Microsoft',
      'Uber',
      'Airbnb',
      'Spotify'
    ],
    workStyle: 'remote',
    icon: 'analytics-outline',
    color: ['#ef4444', '#dc2626'],
    tags: ['data-science', 'python', 'machine-learning', 'ai']
  }
];

// =====================================================
// MARKET INSIGHTS - Current Industry Trends
// =====================================================

export const MARKET_INSIGHTS: MarketInsight[] = [
  {
    id: 'ai-boom-2024',
    type: 'market-forecast',
    title: 'Explosão da IA Generativa',
    description: 'O mercado de IA generativa está crescendo 40% ao ano, criando novas oportunidades para desenvolvedores que dominam LLMs e ferramentas como OpenAI API.',
    data: {
      growth: 40,
      newJobs: 150000,
      salaryIncrease: 25,
      topSkills: ['Python', 'TensorFlow', 'LangChain', 'OpenAI API']
    },
    source: 'LinkedIn Economic Graph',
    publishedAt: new Date('2024-01-15'),
    relevantPaths: ['data-scientist', 'backend-developer'],
    relevantSkills: ['python', 'tensorflow', 'machine-learning'],
    impact: 'high'
  },
  {
    id: 'remote-work-permanence',
    type: 'job-openings',
    title: 'Trabalho Remoto é Permanente',
    description: '78% das empresas de tech mantiveram modelo remoto/híbrido, aumentando competitividade global para desenvolvedores brasileiros.',
    data: {
      remoteJobs: 78,
      salaryParity: 85,
      globalCompetition: 120
    },
    source: 'Stack Overflow Developer Survey 2024',
    publishedAt: new Date('2024-02-01'),
    relevantPaths: ['frontend-developer', 'backend-developer', 'fullstack-developer'],
    relevantSkills: ['javascript', 'react', 'nodejs'],
    impact: 'medium'
  },
  {
    id: 'cloud-native-demand',
    type: 'skill-demand',
    title: 'Cloud-Native em Alta Demanda',
    description: 'Kubernetes e containers são requisitos em 65% das vagas de backend e DevOps, com salários 30% acima da média.',
    data: {
      jobRequirement: 65,
      salaryPremium: 30,
      companies: ['Nubank', 'iFood', 'Magazine Luiza', 'Stone']
    },
    source: 'CNCF Survey 2024',
    publishedAt: new Date('2024-03-10'),
    relevantPaths: ['devops-engineer', 'backend-developer'],
    relevantSkills: ['kubernetes', 'docker', 'aws'],
    impact: 'high'
  }
];

// =====================================================
// MENTORSHIP OPPORTUNITIES
// =====================================================

export const MENTORSHIP_OPPORTUNITIES: MentorshipOpportunity[] = [
  {
    id: 'senior-frontend-mentor',
    mentorId: 'mentor-1',
    mentorName: 'Ana Silva',
    mentorRole: 'Senior Frontend Developer',
    mentorCompany: 'Nubank',
    expertise: ['React', 'TypeScript', 'Next.js', 'Frontend Architecture'],
    experience: 8,
    rating: 4.9,
    availability: 'limited',
    price: 150,
    languages: ['Português', 'Inglês'],
    timezone: 'America/Sao_Paulo',
    focusAreas: ['Career Transition', 'Technical Skills', 'Code Review'],
    successStories: 45,
    bio: 'Senior Frontend Developer no Nubank com 8+ anos de experiência. Especialista em React e arquitetura frontend. Já mentorei 45 desenvolvedores na transição de carreira.'
  },
  {
    id: 'devops-specialist-mentor',
    mentorId: 'mentor-2',
    mentorName: 'Carlos Santos',
    mentorRole: 'DevOps Engineer',
    mentorCompany: 'iFood',
    expertise: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    experience: 10,
    rating: 4.8,
    availability: 'full',
    price: 200,
    languages: ['Português', 'Inglês'],
    timezone: 'America/Sao_Paulo',
    focusAreas: ['Cloud Migration', 'Infrastructure', 'DevOps Culture'],
    successStories: 32,
    bio: 'DevOps Engineer no iFood, líder em transformação digital. Especialista em AWS e Kubernetes com 10 anos de experiência em escalabilidade.'
  },
  {
    id: 'data-science-mentor',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Maria Oliveira',
    mentorRole: 'Staff Data Scientist',
    mentorCompany: 'Uber',
    expertise: ['Machine Learning', 'Python', 'Deep Learning', 'MLOps'],
    experience: 12,
    rating: 5.0,
    availability: 'waitlist',
    price: 250,
    languages: ['Português', 'Inglês', 'Espanhol'],
    timezone: 'America/Sao_Paulo',
    focusAreas: ['ML Engineering', 'Research to Production', 'Technical Leadership'],
    successStories: 28,
    bio: 'PhD em Machine Learning, Staff Data Scientist na Uber. Especialista em levar modelos de ML para produção em escala global.'
  }
];

// =====================================================
// LEARNING RESOURCES - Curated High-Quality Content
// =====================================================

export const LEARNING_RESOURCES: LearningResource[] = [
  // Frontend Resources
  {
    id: 'react-complete-guide',
    title: 'React - The Complete Guide 2024',
    type: 'course',
    url: 'https://www.udemy.com/course/react-the-complete-guide',
    provider: 'Udemy',
    duration: 45,
    price: 199.90,
    rating: 4.6,
    difficulty: 'intermediate',
    isPremium: true,
    skills: ['react', 'javascript', 'typescript'],
    description: 'Curso completo de React com hooks, context, testing e Next.js'
  },
  {
    id: 'javascript-info',
    title: 'The Modern JavaScript Tutorial',
    type: 'tutorial',
    url: 'https://javascript.info/',
    provider: 'JavaScript.info',
    duration: 60,
    price: 0,
    rating: 4.9,
    difficulty: 'beginner',
    isPremium: false,
    skills: ['javascript'],
    description: 'Tutorial completo e atualizado de JavaScript moderno'
  },

  // Backend Resources
  {
    id: 'nodejs-masterclass',
    title: 'Node.js API Masterclass',
    type: 'course',
    url: 'https://www.udemy.com/course/nodejs-api-masterclass',
    provider: 'Udemy',
    duration: 12,
    price: 149.90,
    rating: 4.7,
    difficulty: 'intermediate',
    isPremium: true,
    skills: ['nodejs', 'express', 'mongodb'],
    description: 'Construa APIs profissionais com Node.js, Express e MongoDB'
  },

  // DevOps Resources
  {
    id: 'docker-kubernetes-course',
    title: 'Docker & Kubernetes: The Complete Guide',
    type: 'course',
    url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide',
    provider: 'Udemy',
    duration: 22,
    price: 179.90,
    rating: 4.5,
    difficulty: 'advanced',
    isPremium: true,
    skills: ['docker', 'kubernetes'],
    description: 'Domine containerização e orquestração de aplicações'
  },

  // Free Resources
  {
    id: 'freecodecamp-full-stack',
    title: 'Full Stack Development Certification',
    type: 'certification',
    url: 'https://www.freecodecamp.org/',
    provider: 'freeCodeCamp',
    duration: 300,
    price: 0,
    rating: 4.8,
    difficulty: 'beginner',
    isPremium: false,
    skills: ['javascript', 'react', 'nodejs', 'database'],
    description: 'Certificação gratuita completa em desenvolvimento full stack'
  }
];

// =====================================================
// CERTIFICATIONS - Industry-Recognized Credentials
// =====================================================

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aws-solutions-architect',
    name: 'AWS Certified Solutions Architect - Associate',
    provider: 'Amazon Web Services',
    description: 'Certificação fundamental para arquitetos de soluções cloud na AWS',
    validityPeriod: 36,
    cost: 150,
    difficulty: 'intermediate',
    marketValue: 5,
    prerequisites: ['aws-basics', 'cloud-fundamentals'],
    skills: ['aws', 'cloud-architecture', 'networking']
  },
  {
    id: 'cka-kubernetes',
    name: 'Certified Kubernetes Administrator (CKA)',
    provider: 'Cloud Native Computing Foundation',
    description: 'Certificação hands-on para administradores Kubernetes',
    validityPeriod: 36,
    cost: 375,
    difficulty: 'advanced',
    marketValue: 5,
    prerequisites: ['kubernetes-basics', 'linux', 'networking'],
    skills: ['kubernetes', 'container-orchestration', 'devops']
  },
  {
    id: 'react-certification',
    name: 'Meta Front-End Developer Certificate',
    provider: 'Meta (Facebook)',
    description: 'Certificação profissional em desenvolvimento frontend com React',
    validityPeriod: 24,
    cost: 490,
    difficulty: 'intermediate',
    marketValue: 4,
    prerequisites: ['javascript-basics', 'html-css'],
    skills: ['react', 'javascript', 'frontend-development']
  },
  {
    id: 'google-data-analytics',
    name: 'Google Data Analytics Certificate',
    provider: 'Google',
    description: 'Certificação em análise de dados com ferramentas Google',
    validityPeriod: 24,
    cost: 390,
    difficulty: 'beginner',
    marketValue: 4,
    prerequisites: [],
    skills: ['data-analysis', 'sql', 'python', 'tableau']
  }
];

// =====================================================
// EXPORT ALL CONTENT
// =====================================================

export const CAREER_CONTENT = {
  skills: SKILLS_DATABASE,
  careerPaths: CAREER_PATHS,
  marketInsights: MARKET_INSIGHTS,
  mentorshipOpportunities: MENTORSHIP_OPPORTUNITIES,
  learningResources: LEARNING_RESOURCES,
  certifications: CERTIFICATIONS
};

export default CAREER_CONTENT;