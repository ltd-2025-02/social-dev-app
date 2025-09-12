// ===============================================
// MAPEAMENTO DE ÍCONES DE TECNOLOGIAS
// ===============================================
// Sistema similar ao usado em personas, mas para tecnologias

export interface TechnologyIcon {
  id: string;
  name: string;
  icon: string; // Nome do ícone do Ionicons
  color: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'design' | 'language' | 'framework' | 'tool' | 'cloud';
}

export const TECHNOLOGY_ICONS: TechnologyIcon[] = [
  // Frontend
  { id: 'react', name: 'React', icon: 'logo-react', color: '#61DAFB', category: 'frontend' },
  { id: 'vue', name: 'Vue.js', icon: 'logo-vue', color: '#4FC08D', category: 'frontend' },
  { id: 'angular', name: 'Angular', icon: 'logo-angular', color: '#DD0031', category: 'frontend' },
  { id: 'html', name: 'HTML', icon: 'logo-html5', color: '#E34F26', category: 'frontend' },
  { id: 'css', name: 'CSS', icon: 'logo-css3', color: '#1572B6', category: 'frontend' },
  { id: 'sass', name: 'Sass', icon: 'logo-sass', color: '#CC6699', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: 'color-wand-outline', color: '#06B6D4', category: 'frontend' },
  { id: 'bootstrap', name: 'Bootstrap', icon: 'grid-outline', color: '#7952B3', category: 'frontend' },

  // Backend
  { id: 'nodejs', name: 'Node.js', icon: 'logo-nodejs', color: '#339933', category: 'backend' },
  { id: 'python', name: 'Python', icon: 'logo-python', color: '#3776AB', category: 'backend' },
  { id: 'php', name: 'PHP', icon: 'logo-php', color: '#777BB4', category: 'backend' },
  { id: 'java', name: 'Java', icon: 'cafe-outline', color: '#007396', category: 'backend' },
  { id: 'csharp', name: 'C#', icon: 'code-outline', color: '#239120', category: 'backend' },
  { id: 'ruby', name: 'Ruby', icon: 'diamond-outline', color: '#CC342D', category: 'backend' },
  { id: 'go', name: 'Go', icon: 'rocket-outline', color: '#00ADD8', category: 'backend' },
  { id: 'rust', name: 'Rust', icon: 'hardware-chip-outline', color: '#000000', category: 'backend' },

  // Mobile
  { id: 'react-native', name: 'React Native', icon: 'phone-portrait-outline', color: '#61DAFB', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', icon: 'phone-portrait-outline', color: '#02569B', category: 'mobile' },
  { id: 'ionic', name: 'Ionic', icon: 'logo-ionic', color: '#3880FF', category: 'mobile' },
  { id: 'swift', name: 'Swift', icon: 'logo-apple', color: '#FA7343', category: 'mobile' },
  { id: 'kotlin', name: 'Kotlin', icon: 'logo-android', color: '#0095D5', category: 'mobile' },
  { id: 'xamarin', name: 'Xamarin', icon: 'phone-portrait-outline', color: '#3498DB', category: 'mobile' },

  // Database
  { id: 'mysql', name: 'MySQL', icon: 'server-outline', color: '#4479A1', category: 'database' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'server-outline', color: '#336791', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', icon: 'leaf-outline', color: '#47A248', category: 'database' },
  { id: 'redis', name: 'Redis', icon: 'flash-outline', color: '#DC382D', category: 'database' },
  { id: 'sqlite', name: 'SQLite', icon: 'archive-outline', color: '#003B57', category: 'database' },
  { id: 'firebase', name: 'Firebase', icon: 'flame-outline', color: '#FFCA28', category: 'database' },
  { id: 'supabase', name: 'Supabase', icon: 'thunderstorm-outline', color: '#3ECF8E', category: 'database' },

  // DevOps & Tools
  { id: 'docker', name: 'Docker', icon: 'cube-outline', color: '#2496ED', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', icon: 'globe-outline', color: '#326CE5', category: 'devops' },
  { id: 'git', name: 'Git', icon: 'git-branch-outline', color: '#F05032', category: 'devops' },
  { id: 'github', name: 'GitHub', icon: 'logo-github', color: '#181717', category: 'devops' },
  { id: 'gitlab', name: 'GitLab', icon: 'git-merge-outline', color: '#FC6D26', category: 'devops' },
  { id: 'jenkins', name: 'Jenkins', icon: 'construct-outline', color: '#D33833', category: 'devops' },
  { id: 'terraform', name: 'Terraform', icon: 'layers-outline', color: '#623CE4', category: 'devops' },

  // Cloud
  { id: 'aws', name: 'AWS', icon: 'cloud-outline', color: '#FF9900', category: 'cloud' },
  { id: 'azure', name: 'Azure', icon: 'cloud-outline', color: '#0078D4', category: 'cloud' },
  { id: 'gcp', name: 'Google Cloud', icon: 'cloud-outline', color: '#4285F4', category: 'cloud' },
  { id: 'vercel', name: 'Vercel', icon: 'triangle-outline', color: '#000000', category: 'cloud' },
  { id: 'netlify', name: 'Netlify', icon: 'globe-outline', color: '#00C7B7', category: 'cloud' },
  { id: 'heroku', name: 'Heroku', icon: 'cloud-upload-outline', color: '#430098', category: 'cloud' },

  // Languages
  { id: 'javascript', name: 'JavaScript', icon: 'logo-javascript', color: '#F7DF1E', category: 'language' },
  { id: 'typescript', name: 'TypeScript', icon: 'code-slash-outline', color: '#3178C6', category: 'language' },
  { id: 'c', name: 'C', icon: 'code-outline', color: '#A8B9CC', category: 'language' },
  { id: 'cpp', name: 'C++', icon: 'code-outline', color: '#00599C', category: 'language' },

  // Frameworks
  { id: 'express', name: 'Express.js', icon: 'server-outline', color: '#000000', category: 'framework' },
  { id: 'nestjs', name: 'NestJS', icon: 'layers-outline', color: '#E0234E', category: 'framework' },
  { id: 'laravel', name: 'Laravel', icon: 'code-working-outline', color: '#FF2D20', category: 'framework' },
  { id: 'django', name: 'Django', icon: 'code-working-outline', color: '#092E20', category: 'framework' },
  { id: 'flask', name: 'Flask', icon: 'flask-outline', color: '#000000', category: 'framework' },
  { id: 'spring', name: 'Spring Boot', icon: 'leaf-outline', color: '#6DB33F', category: 'framework' },
  { id: 'nextjs', name: 'Next.js', icon: 'triangle-outline', color: '#000000', category: 'framework' },
  { id: 'nuxtjs', name: 'Nuxt.js', icon: 'triangle-outline', color: '#00DC82', category: 'framework' },

  // Design
  { id: 'figma', name: 'Figma', icon: 'color-palette-outline', color: '#F24E1E', category: 'design' },
  { id: 'photoshop', name: 'Photoshop', icon: 'image-outline', color: '#31A8FF', category: 'design' },
  { id: 'illustrator', name: 'Illustrator', icon: 'brush-outline', color: '#FF9A00', category: 'design' },
  { id: 'sketch', name: 'Sketch', icon: 'color-palette-outline', color: '#F7B500', category: 'design' },
  { id: 'xd', name: 'Adobe XD', icon: 'shapes-outline', color: '#FF61F6', category: 'design' },

  // Tools
  { id: 'vscode', name: 'VS Code', icon: 'code-slash-outline', color: '#007ACC', category: 'tool' },
  { id: 'webstorm', name: 'WebStorm', icon: 'code-slash-outline', color: '#000000', category: 'tool' },
  { id: 'postman', name: 'Postman', icon: 'send-outline', color: '#FF6C37', category: 'tool' },
  { id: 'insomnia', name: 'Insomnia', icon: 'moon-outline', color: '#4000BF', category: 'tool' },
  { id: 'slack', name: 'Slack', icon: 'chatbubbles-outline', color: '#4A154B', category: 'tool' },
  { id: 'discord', name: 'Discord', icon: 'logo-discord', color: '#5865F2', category: 'tool' },
  { id: 'notion', name: 'Notion', icon: 'document-text-outline', color: '#000000', category: 'tool' },
  { id: 'jira', name: 'Jira', icon: 'clipboard-outline', color: '#0052CC', category: 'tool' },
];

// Função para buscar um ícone por ID
export function getTechnologyIcon(id: string): TechnologyIcon | null {
  return TECHNOLOGY_ICONS.find(tech => tech.id === id) || null;
}

// Função para buscar ícones por categoria
export function getTechnologyIconsByCategory(category: TechnologyIcon['category']): TechnologyIcon[] {
  return TECHNOLOGY_ICONS.filter(tech => tech.category === category);
}

// Função para buscar ícones por nome (busca parcial)
export function searchTechnologyIcons(query: string): TechnologyIcon[] {
  const lowercaseQuery = query.toLowerCase();
  return TECHNOLOGY_ICONS.filter(tech => 
    tech.name.toLowerCase().includes(lowercaseQuery) ||
    tech.id.toLowerCase().includes(lowercaseQuery)
  );
}

// Função para obter todas as categorias disponíveis
export function getTechnologyCategories(): TechnologyIcon['category'][] {
  return Array.from(new Set(TECHNOLOGY_ICONS.map(tech => tech.category)));
}

// Mapeamento de categorias para nomes em português
export const CATEGORY_NAMES: Record<TechnologyIcon['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend', 
  mobile: 'Mobile',
  database: 'Banco de Dados',
  devops: 'DevOps',
  design: 'Design',
  language: 'Linguagens',
  framework: 'Frameworks',
  tool: 'Ferramentas',
  cloud: 'Cloud'
};

// Função para obter cor de fundo baseada na categoria
export function getCategoryColor(category: TechnologyIcon['category']): string {
  const colors = {
    frontend: '#3B82F6',
    backend: '#10B981', 
    mobile: '#8B5CF6',
    database: '#F59E0B',
    devops: '#EF4444',
    design: '#EC4899',
    language: '#6B7280',
    framework: '#14B8A6',
    tool: '#84CC16',
    cloud: '#06B6D4'
  };
  return colors[category];
}