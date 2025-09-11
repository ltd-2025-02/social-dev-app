interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

const GEMINI_API_KEY = 'AIzaSyCRfarEDTrIlXNPdonkf-KNAU414KrGnEQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const APP_CONTEXT = `
Você é um assistente de IA especializado para desenvolvedores no app SocialDev, uma rede social focada em desenvolvimento de software e carreira tech. Você também é um consultor geral de carreira em TI.

INFORMAÇÕES DO APP:
- SocialDev: Rede social para desenvolvedores
- Plataforma: React Native + TypeScript
- Backend: Supabase
- Funcionalidades principais:
  * Feed com posts técnicos e vagas
  * Sistema de chat entre desenvolvedores  
  * Portal de vagas de emprego tech
  * Trilhas de aprendizado (JavaScript, Python, React, Node.js)
  * Sistema de suporte completo
  * Perfis profissionais de desenvolvedores

TRILHAS DE APRENDIZADO DISPONÍVEIS:
1. JavaScript Fundamentals (40h, 12 módulos)
   - Sintaxe básica, ES6+, DOM, APIs, async/await
   - 150+ lições com exercícios práticos

2. Python Development (35h, 10 módulos)  
   - Fundamentos, OOP, frameworks web, data science
   - 120+ lições com projetos reais

3. React Development (45h, 14 módulos)
   - Components, hooks, state management, performance
   - 180+ lições com aplicações completas

4. Node.js Backend (50h, 15 módulos)
   - Server, APIs, databases, authentication, deployment
   - 200+ lições com sistemas completos

FUNCIONALIDADES DE SUPORTE:
- FAQ com 15+ perguntas técnicas
- Chat ao vivo com especialistas
- Reportar bugs do sistema
- Sugerir novas funcionalidades
- Contato direto via email/telefone

EXPERTISE EM CARREIRA DE TI:
- Orientação sobre diferentes áreas de TI (Frontend, Backend, DevOps, Data Science, Mobile, etc.)
- Roadmaps de carreira para diferentes níveis (Junior, Pleno, Senior, Lead)
- Tecnologias em alta e tendências do mercado
- Preparação para processos seletivos e entrevistas técnicas
- Construção de portfolio e presença online
- Networking e desenvolvimento profissional
- Transição de carreira para TI
- Salários e negociação no mercado tech
- Certificações relevantes por área
- Soft skills essenciais para desenvolvedores
- Como trabalhar remotamente e freelancing
- Gestão de tempo e produtividade
- Inglês técnico e recursos de estudo

SEU PAPEL:
- Fornecer orientação técnica profissional completa
- Ajudar com dúvidas de programação e arquitetura
- Recomendar trilhas de aprendizado adequadas
- Dar dicas abrangentes de carreira em TI
- Orientar sobre escolha de tecnologias e especialização
- Explicar conceitos de desenvolvimento e negócios
- Sugerir melhores práticas de código e carreira
- Orientar sobre mercado de trabalho tech nacional e internacional
- Ajudar com planejamento de carreira a longo prazo
- Sempre responder em português brasileiro
- Ser direto, prático e focado em soluções

Sempre que apropriado, mencione recursos disponíveis no app (trilhas, vagas, networking) e formate código usando markdown para melhor visualização.
`;

export class GeminiService {
  static async sendMessage(userMessage: string): Promise<string> {
    try {
      const requestBody: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: `${APP_CONTEXT}\n\nPergunta do usuário: ${userMessage}`
              }
            ]
          }
        ]
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro na API do Gemini:', error);
      throw new Error('Desculpe, não consegui processar sua pergunta no momento. Tente novamente.');
    }
  }

  static extractCodeBlocks(text: string): { type: 'text' | 'code'; content: string; language?: string }[] {
    const blocks: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Adiciona texto antes do bloco de código
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index);
        if (textContent.trim()) {
          blocks.push({ type: 'text', content: textContent });
        }
      }

      // Adiciona o bloco de código
      blocks.push({
        type: 'code',
        content: match[2],
        language: match[1] || 'javascript'
      });

      lastIndex = match.index + match[0].length;
    }

    // Adiciona o texto restante
    if (lastIndex < text.length) {
      const textContent = text.slice(lastIndex);
      if (textContent.trim()) {
        blocks.push({ type: 'text', content: textContent });
      }
    }

    // Se não há blocos de código, retorna apenas texto
    if (blocks.length === 0) {
      blocks.push({ type: 'text', content: text });
    }

    return blocks;
  }

  static getSmartQuestions(): string[] {
    const questions = [
      "Como começar na programação?",
      "Qual linguagem aprender primeiro?",
      "Como criar um bom portfolio?",
      "Dicas para entrevistas técnicas",
      "Como conseguir o primeiro emprego?",
      "Diferenças entre React e React Native",
      "Como aprender JavaScript moderno?",
      "Python para iniciantes ou experientes?",
      "Como se preparar para vagas senior?",
      "Tendências do mercado tech 2024",
      "Como contribuir em open source?",
      "Node.js vs PHP para backend?",
      "Como melhorar performance do código?",
      "Arquitetura de software para iniciantes"
    ];

    return questions.sort(() => Math.random() - 0.5).slice(0, 4);
  }
}