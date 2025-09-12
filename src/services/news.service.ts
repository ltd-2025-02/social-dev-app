// News Service using APITube API
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author: string;
  category: string;
  language: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  page: number;
  per_page: number;
  total_pages: number;
}

export interface NewsFilters {
  topic?: string;
  language?: string;
  per_page?: number;
  page?: number;
}

class NewsService {
  private apiKey = 'api_live_jEmwNoq0ePziTJxmLHra9XWsnPejU22EnA2mbFucdvg2nMYCZMV1tJSGx';
  private baseUrl = 'https://api.apitube.io/v1/news';

  private readonly techTopics = [
    'tecnologia',
    'programação',
    'desenvolvimento',
    'software',
    'inteligência artificial',
    'machine learning',
    'javascript',
    'python',
    'react',
    'nodejs',
    'mobile',
    'web development',
    'devops',
    'cloud computing',
    'startup',
    'inovação',
    'tech',
    'coding',
    'programming'
  ];

  async getNews(filters: NewsFilters = {}): Promise<NewsResponse> {
    try {
      const params = new URLSearchParams({
        language: filters.language || 'pt',
        per_page: (filters.per_page || 10).toString(),
        page: (filters.page || 1).toString(),
      });

      // Se um tópico específico foi fornecido, usar ele
      if (filters.topic) {
        params.append('title', filters.topic);
      }

      const url = `${this.baseUrl}/everything?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtrar notícias relacionadas à tecnologia se não há tópico específico
      if (!filters.topic) {
        data.articles = this.filterTechNews(data.articles || []);
      }

      // Garantir que articles sempre seja um array
      if (!Array.isArray(data.articles)) {
        data.articles = [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      // Retornar dados mock em caso de erro
      return this.getMockNews();
    }
  }

  async getTechNews(topic?: string): Promise<NewsResponse> {
    const techTopic = topic || 'tecnologia';
    return this.getNews({
      topic: techTopic,
      language: 'pt',
      per_page: 20
    });
  }

  async getTopTechStories(): Promise<NewsResponse> {
    try {
      // Buscar por múltiplos tópicos de tech
      const topics = ['tecnologia', 'programação', 'inteligência artificial', 'startup'];
      let allArticles: NewsArticle[] = [];

      for (const topic of topics) {
        const response = await this.getNews({
          topic,
          language: 'pt',
          per_page: 5
        });
        if (response && Array.isArray(response.articles)) {
          allArticles = [...allArticles, ...response.articles];
        }
      }

      // Remover duplicatas e ordenar por data
      const uniqueArticles = this.removeDuplicates(allArticles);
      const sortedArticles = uniqueArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 15);

      return {
        status: 'ok',
        totalResults: sortedArticles.length,
        articles: sortedArticles,
        page: 1,
        per_page: 15,
        total_pages: 1
      };
    } catch (error) {
      console.error('Error fetching top tech stories:', error);
      return this.getMockNews();
    }
  }

  getAvailableTopics(): string[] {
    return [
      'Tecnologia',
      'Programação',
      'Inteligência Artificial',
      'Desenvolvimento Web',
      'Mobile Development',
      'DevOps',
      'Startups',
      'Inovação',
      'Cloud Computing',
      'Cibersegurança',
      'Data Science',
      'Blockchain',
      'IoT',
      'Realidade Virtual',
      'Machine Learning'
    ];
  }

  private filterTechNews(articles: NewsArticle[]): NewsArticle[] {
    if (!Array.isArray(articles)) {
      return [];
    }
    
    return articles.filter(article => {
      if (!article || typeof article !== 'object') {
        return false;
      }
      
      const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
      return this.techTopics.some(topic => 
        text.includes(topic.toLowerCase())
      );
    });
  }

  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    if (!Array.isArray(articles)) {
      return [];
    }
    
    const seen = new Set();
    return articles.filter(article => {
      if (!article || !article.title || seen.has(article.title)) {
        return false;
      }
      seen.add(article.title);
      return true;
    });
  }

  private getMockNews(): NewsResponse {
    return {
      status: 'ok',
      totalResults: 5,
      articles: [
        {
          id: '1',
          title: 'Nova versão do React revoluciona desenvolvimento frontend',
          description: 'React 19 traz melhorias significativas de performance e novas funcionalidades para desenvolvedores.',
          content: 'A nova versão do React promete mudanças substanciais no desenvolvimento frontend...',
          url: 'https://example.com/react-19',
          urlToImage: 'https://picsum.photos/800/600?random=1',
          publishedAt: new Date().toISOString(),
          source: { id: 'tech-news', name: 'Tech News Brasil' },
          author: 'João Silva',
          category: 'tecnologia',
          language: 'pt'
        },
        {
          id: '2',
          title: 'Inteligência Artificial transforma mercado de trabalho em TI',
          description: 'Estudo aponta crescimento de 40% em vagas relacionadas a IA e Machine Learning.',
          content: 'O mercado de trabalho em tecnologia está passando por uma transformação...',
          url: 'https://example.com/ai-jobs',
          urlToImage: 'https://picsum.photos/800/600?random=2',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { id: 'tech-jobs', name: 'TechJobs' },
          author: 'Maria Santos',
          category: 'inteligência artificial',
          language: 'pt'
        },
        {
          id: '3',
          title: 'Startup brasileira recebe investimento milionário para desenvolvimento de apps',
          description: 'Empresa de São Paulo levanta R$ 50 milhões para expandir plataforma de desenvolvimento mobile.',
          content: 'Uma startup brasileira especializada em desenvolvimento mobile...',
          url: 'https://example.com/startup-investment',
          urlToImage: 'https://picsum.photos/800/600?random=3',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { id: 'startup-brasil', name: 'Startup Brasil' },
          author: 'Carlos Oliveira',
          category: 'startup',
          language: 'pt'
        },
        {
          id: '4',
          title: 'Python continua como linguagem mais popular entre desenvolvedores',
          description: 'Pesquisa global mostra Python liderando preferências de programadores em 2024.',
          content: 'Pelo quinto ano consecutivo, Python mantém sua posição...',
          url: 'https://example.com/python-popular',
          urlToImage: 'https://picsum.photos/800/600?random=4',
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { id: 'dev-survey', name: 'Developer Survey' },
          author: 'Ana Costa',
          category: 'programação',
          language: 'pt'
        },
        {
          id: '5',
          title: 'Cloud Computing: empresas aceleram migração para nuvem híbrida',
          description: 'Relatório indica que 78% das empresas brasileiras adotarão modelo híbrido até 2025.',
          content: 'A adoção de cloud computing no Brasil está acelerando...',
          url: 'https://example.com/cloud-hybrid',
          urlToImage: 'https://picsum.photos/800/600?random=5',
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          source: { id: 'cloud-tech', name: 'Cloud Tech' },
          author: 'Roberto Lima',
          category: 'cloud computing',
          language: 'pt'
        }
      ],
      page: 1,
      per_page: 5,
      total_pages: 1
    };
  }

  formatTimeAgo(publishedAt: string): string {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return 'Ontem';
      } else if (diffInDays < 7) {
        return `${diffInDays} dias atrás`;
      } else {
        return published.toLocaleDateString('pt-BR');
      }
    }
  }
}

export const newsService = new NewsService();