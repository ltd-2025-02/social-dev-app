export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code?: string;
  expectedOutput?: string;
  hint?: string;
  solution: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: {
    theory: string;
    codeExamples: Array<{
      title: string;
      code: string;
      explanation: string;
    }>;
    keyPoints: string[];
  };
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedHours: number;
  lessons: Lesson[];
}

export interface LearningTrail {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  level: string;
  totalHours: number;
  modules: Module[];
  documentation: {
    overview: string;
    syntax: Array<{
      category: string;
      items: Array<{
        name: string;
        syntax: string;
        description: string;
        example: string;
      }>;
    }>;
    bestPractices: string[];
    commonPitfalls: string[];
    resources: Array<{
      title: string;
      url: string;
      type: 'documentation' | 'tutorial' | 'video' | 'book';
    }>;
  };
}

export const learningTrails: LearningTrail[] = [
  // JavaScript Trail
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Aprenda JavaScript do básico ao avançado, incluindo ES6+, programação funcional e conceitos modernos.',
    color: '#f7df1e',
    icon: 'logo-javascript',
    level: 'Básico → Avançado',
    totalHours: 120,
    modules: [
      {
        id: 'js-fundamentals',
        title: 'Fundamentos do JavaScript',
        description: 'Conceitos básicos da linguagem',
        icon: 'school-outline',
        estimatedHours: 30,
        lessons: [
          {
            id: 'js-intro',
            title: 'Introdução ao JavaScript',
            description: 'História, características e configuração do ambiente',
            duration: '45 min',
            difficulty: 'beginner',
            content: {
              theory: `JavaScript é uma linguagem de programação interpretada, de alto nível, com tipagem dinâmica e multi-paradigma. Criada em 1995 por Brendan Eich, inicialmente foi desenvolvida para adicionar interatividade às páginas web.

## Por que JavaScript?

1. **Versatilidade**: Roda no browser, servidor (Node.js), mobile (React Native) e desktop (Electron)
2. **Comunidade ativa**: Uma das linguagens mais populares do mundo
3. **Facilidade de aprendizado**: Sintaxe relativamente simples
4. **Mercado de trabalho**: Altíssima demanda por desenvolvedores JavaScript

## Características principais:

- **Interpretada**: Não precisa ser compilada
- **Tipagem dinâmica**: Tipos são determinados em tempo de execução
- **Orientada a objetos**: Suporta programação OO com protótipos
- **Funcional**: Suporta funções de primeira classe
- **Event-driven**: Orientada a eventos`,
              codeExamples: [
                {
                  title: 'Primeiro programa em JavaScript',
                  code: `// Este é um comentário de linha
/* Este é um comentário
   de múltiplas linhas */

console.log("Olá, mundo!");

// Declaração de variável
let nome = "João";
console.log("Olá, " + nome);`,
                  explanation: 'Este exemplo mostra como escrever comentários e seu primeiro programa JavaScript. O console.log() é usado para exibir informações no console do navegador.'
                }
              ],
              keyPoints: [
                'JavaScript é case-sensitive (diferencia maiúsculas de minúsculas)',
                'Statements podem terminar com ; (opcional em muitos casos)',
                'Use console.log() para debugar e testar código',
                'Comentários são importantes para documentar o código'
              ]
            },
            exercises: [
              {
                id: 'js-ex-1',
                title: 'Primeiro Hello World',
                description: 'Crie um programa que exiba "Olá, Mundo!" no console',
                difficulty: 'easy',
                hint: 'Use console.log() para exibir a mensagem',
                solution: 'console.log("Olá, Mundo!");',
                explanation: 'O console.log() é a função mais básica para exibir informações. É fundamental para debug e testes iniciais.'
              }
            ]
          },
          {
            id: 'js-variables',
            title: 'Variáveis e Tipos de Dados',
            description: 'Declaração de variáveis e tipos primitivos',
            duration: '60 min',
            difficulty: 'beginner',
            content: {
              theory: `Em JavaScript, variáveis são containers que armazenam valores. Existem diferentes formas de declarar variáveis e diferentes tipos de dados.

## Declaração de Variáveis:

### var (evitar em código moderno)
- Escopo de função
- Pode ser redeclarada
- Hoisting

### let (recomendado)
- Escopo de bloco
- Não pode ser redeclarada no mesmo escopo
- Hoisting com Temporal Dead Zone

### const (recomendado para valores constantes)
- Escopo de bloco
- Deve ser inicializada na declaração
- Não pode ser reatribuída

## Tipos de Dados Primitivos:

1. **Number**: Números inteiros e decimais
2. **String**: Texto
3. **Boolean**: true ou false
4. **Undefined**: Valor não definido
5. **Null**: Valor nulo intencionalmente
6. **Symbol**: Identificador único
7. **BigInt**: Números grandes`,
              codeExamples: [
                {
                  title: 'Declaração de variáveis',
                  code: `// Declaração com let
let idade = 25;
let nome = "Maria";
let ativo = true;

// Declaração com const
const PI = 3.14159;
const PAIS = "Brasil";

// Tipos primitivos
console.log(typeof idade);    // "number"
console.log(typeof nome);     // "string"
console.log(typeof ativo);    // "boolean"
console.log(typeof PI);       // "number"`,
                  explanation: 'Este exemplo mostra como declarar variáveis e verificar seus tipos usando o operador typeof.'
                },
                {
                  title: 'Strings e Template Literals',
                  code: `let nome = "João";
let sobrenome = 'Silva';

// Concatenação tradicional
let nomeCompleto = nome + " " + sobrenome;

// Template literals (ES6+)
let apresentacao = \`Olá, meu nome é \${nome} \${sobrenome}\`;
let multiLinha = \`Esta é uma string
que ocupa múltiplas
linhas\`;

console.log(apresentacao);
console.log(multiLinha);`,
                  explanation: 'Template literals (backticks) são uma forma moderna e mais legível de trabalhar com strings, permitindo interpolação e múltiplas linhas.'
                }
              ],
              keyPoints: [
                'Use let para variáveis que podem mudar',
                'Use const para valores constantes',
                'Evite var em código moderno',
                'Template literals são mais legíveis que concatenação',
                'JavaScript é dinamicamente tipado'
              ]
            },
            exercises: [
              {
                id: 'js-ex-2',
                title: 'Calculadora de IMC',
                description: 'Crie variáveis para peso e altura e calcule o IMC (peso / altura²)',
                difficulty: 'easy',
                code: `// Declare suas variáveis aqui
let peso = 70;
let altura = 1.75;

// Calcule o IMC
// IMC = peso / (altura * altura)`,
                expectedOutput: 'IMC: 22.86',
                hint: 'Use a fórmula IMC = peso / (altura * altura) e template literals para exibir o resultado',
                solution: `let peso = 70;
let altura = 1.75;
let imc = peso / (altura * altura);
console.log(\`IMC: \${imc.toFixed(2)}\`);`,
                explanation: 'Este exercício demonstra operações aritméticas, uso de variáveis e formatação de números com toFixed().'
              }
            ]
          },
          {
            id: 'js-operators',
            title: 'Operadores e Expressões',
            description: 'Operadores aritméticos, lógicos e de comparação',
            duration: '40 min',
            difficulty: 'beginner',
            content: {
              theory: `Operadores são símbolos que executam operações específicas em valores (operandos).

## Operadores Aritméticos:
- \`+\` : Adição
- \`-\` : Subtração  
- \`*\` : Multiplicação
- \`/\` : Divisão
- \`%\` : Módulo (resto da divisão)
- \`**\` : Exponenciação

## Operadores de Atribuição:
- \`=\` : Atribuição simples
- \`+=\` : Soma e atribui
- \`-=\` : Subtrai e atribui
- \`*=\` : Multiplica e atribui
- \`/=\` : Divide e atribui

## Operadores de Incremento/Decremento:
- \`++\` : Incrementa em 1
- \`--\` : Decrementa em 1`,
              codeExamples: [
                {
                  title: 'Operadores em ação',
                  code: `let a = 10;
let b = 3;

// Aritméticos
console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1
console.log(a ** b); // 1000

// Atribuição
let x = 5;
x += 3; // x = x + 3 = 8
x *= 2; // x = x * 2 = 16
console.log(x); // 16

// Incremento/Decremento
let contador = 0;
contador++; // 1
++contador; // 2
console.log(contador); // 2`,
                  explanation: 'Operadores são fundamentais para manipular dados e criar lógicas complexas.'
                }
              ],
              keyPoints: [
                'Operadores têm precedência (ordem de execução)',
                'Use parênteses para controlar a ordem',
                '++ antes incrementa primeiro, depois incrementa',
                'Módulo (%) é útil para verificar números pares/ímpares',
                'Operadores de atribuição são mais eficientes'
              ]
            },
            exercises: [
              {
                id: 'js-ex-operators',
                title: 'Calculadora de Desconto',
                description: 'Crie um programa que calcule o preço final com desconto',
                difficulty: 'easy',
                code: `let preco = 100;
let desconto = 15; // 15%

// Calcule o preço final`,
                expectedOutput: 'Preço final: R$ 85.00',
                hint: 'Use: precoFinal = preco - (preco * desconto / 100)',
                solution: `let preco = 100;
let desconto = 15;

let precoFinal = preco - (preco * desconto / 100);
console.log(\`Preço final: R$ \${precoFinal.toFixed(2)}\`);`,
                explanation: 'Este exercício demonstra uso de operadores aritméticos e formatação.'
              }
            ]
          }
        ]
      },
      {
        id: 'js-control',
        title: 'Estruturas de Controle',
        description: 'Condicionais, loops e controle de fluxo',
        icon: 'git-branch-outline',
        estimatedHours: 25,
        lessons: [
          {
            id: 'js-conditionals',
            title: 'Condicionais (if, else, switch)',
            description: 'Tomada de decisões no código',
            duration: '50 min',
            difficulty: 'beginner',
            content: {
              theory: `Estruturas condicionais permitem que o programa tome diferentes caminhos baseado em condições específicas.

## if...else
A estrutura mais básica de condição:

\`\`\`javascript
if (condicao) {
    // código executado se verdadeiro
} else if (outraCondicao) {
    // código para segunda condição
} else {
    // código executado se todas forem falsas
}
\`\`\`

## Operadores de Comparação:
- \`==\` : Igualdade com conversão de tipo
- \`===\` : Igualdade estrita (recomendado)
- \`!=\` : Diferente com conversão
- \`!==\` : Diferente estrito
- \`>\` : Maior que
- \`<\` : Menor que
- \`>=\` : Maior ou igual
- \`<=\` : Menor ou igual

## Operadores Lógicos:
- \`&&\` : AND lógico
- \`||\` : OR lógico
- \`!\` : NOT lógico

## switch
Para múltiplas comparações com o mesmo valor:

\`\`\`javascript
switch (variavel) {
    case valor1:
        // código
        break;
    case valor2:
        // código
        break;
    default:
        // código padrão
}
\`\`\``,
              codeExamples: [
                {
                  title: 'Estrutura if...else',
                  code: `let idade = 18;
let temCarteira = true;

if (idade >= 18 && temCarteira) {
    console.log("Pode dirigir!");
} else if (idade >= 18) {
    console.log("Precisa tirar a carteira");
} else {
    console.log("Muito jovem para dirigir");
}

// Operador ternário (forma compacta)
let status = idade >= 18 ? "Maior de idade" : "Menor de idade";
console.log(status);`,
                  explanation: 'Este exemplo mostra condicionais aninhadas e o operador ternário para condições simples.'
                },
                {
                  title: 'Estrutura switch',
                  code: `let diaDaSemana = 3;
let nomeDoDia;

switch (diaDaSemana) {
    case 1:
        nomeDoDia = "Segunda-feira";
        break;
    case 2:
        nomeDoDia = "Terça-feira";
        break;
    case 3:
        nomeDoDia = "Quarta-feira";
        break;
    case 4:
        nomeDoDia = "Quinta-feira";
        break;
    case 5:
        nomeDoDia = "Sexta-feira";
        break;
    case 6:
        nomeDoDia = "Sábado";
        break;
    case 7:
        nomeDoDia = "Domingo";
        break;
    default:
        nomeDoDia = "Dia inválido";
}

console.log(nomeDoDia); // "Quarta-feira"`,
                  explanation: 'Switch é útil quando você tem muitas comparações com o mesmo valor. Lembre-se do break!'
                }
              ],
              keyPoints: [
                'Use === ao invés de == para comparações',
                'Operadores lógicos podem encurtar condições',
                'Switch é útil para múltiplas comparações',
                'Não esqueça do break no switch',
                'Operador ternário é útil para condições simples'
              ]
            },
            exercises: [
              {
                id: 'js-ex-3',
                title: 'Classificador de Notas',
                description: 'Crie um programa que classifique notas: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)',
                difficulty: 'easy',
                code: `let nota = 85;

// Implemente a lógica de classificação`,
                expectedOutput: 'Nota B',
                hint: 'Use if...else if...else para verificar os intervalos de nota',
                solution: `let nota = 85;

if (nota >= 90) {
    console.log("Nota A");
} else if (nota >= 80) {
    console.log("Nota B");
} else if (nota >= 70) {
    console.log("Nota C");
} else if (nota >= 60) {
    console.log("Nota D");
} else {
    console.log("Nota F");
}`,
                explanation: 'Este exercício demonstra o uso de if...else if para classificar valores em categorias.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `JavaScript é uma linguagem de programação interpretada estruturada, de script em alto nível com tipagem dinâmica fraca e multi-paradigma. Juntamente com HTML e CSS, o JavaScript é uma das três principais tecnologias da World Wide Web.

## Características Principais:

- **Interpretada**: Executa diretamente sem necessidade de compilação
- **Tipagem Dinâmica**: Os tipos são determinados em tempo de execução
- **Multi-paradigma**: Suporta programação procedural, orientada a objetos e funcional
- **Event-driven**: Orientada a eventos, ideal para interfaces interativas
- **Prototype-based**: Orientação a objetos baseada em protótipos`,
      syntax: [
        {
          category: 'Variáveis',
          items: [
            {
              name: 'let',
              syntax: 'let variavel = valor;',
              description: 'Declara uma variável de escopo de bloco',
              example: 'let nome = "João";'
            },
            {
              name: 'const',
              syntax: 'const CONSTANTE = valor;',
              description: 'Declara uma constante',
              example: 'const PI = 3.14159;'
            }
          ]
        },
        {
          category: 'Funções',
          items: [
            {
              name: 'Function Declaration',
              syntax: 'function nome(param1, param2) { return valor; }',
              description: 'Declara uma função nomeada',
              example: 'function somar(a, b) { return a + b; }'
            },
            {
              name: 'Arrow Function',
              syntax: 'const nome = (param1, param2) => { return valor; }',
              description: 'Função de seta (ES6+)',
              example: 'const somar = (a, b) => a + b;'
            }
          ]
        }
      ],
      bestPractices: [
        'Use const por padrão, let quando necessário, evite var',
        'Prefira === ao invés de == para comparações',
        'Use nomes descritivos para variáveis e funções',
        'Mantenha funções pequenas e com responsabilidade única',
        'Use arrow functions para callbacks e funções pequenas',
        'Sempre use ponto e vírgula para evitar problemas de ASI',
        'Use template literals ao invés de concatenação de strings'
      ],
      commonPitfalls: [
        'Hoisting pode causar comportamento inesperado com var',
        'Comparação com == pode causar conversões inesperadas',
        'Modificar arrays/objetos declarados com const é possível',
        'This context pode ser confuso em diferentes contextos',
        'Closures podem manter referências desnecessárias',
        'Mutação de objetos pode causar bugs difíceis de rastrear'
      ],
      resources: [
        {
          title: 'MDN JavaScript Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          type: 'documentation'
        },
        {
          title: 'JavaScript.info',
          url: 'https://javascript.info/',
          type: 'tutorial'
        },
        {
          title: 'You Don\'t Know JS',
          url: 'https://github.com/getify/You-Dont-Know-JS',
          type: 'book'
        }
      ]
    }
  },

  // Python Trail
  {
    id: 'python',
    name: 'Python',
    description: 'Domine Python desde o básico até conceitos avançados, incluindo programação orientada a objetos e desenvolvimento web.',
    color: '#3776ab',
    icon: 'logo-python',
    level: 'Básico → Intermediário',
    totalHours: 100,
    modules: [
      {
        id: 'python-fundamentals',
        title: 'Fundamentos do Python',
        description: 'Sintaxe básica e conceitos fundamentais',
        icon: 'school-outline',
        estimatedHours: 25,
        lessons: [
          {
            id: 'python-intro',
            title: 'Introdução ao Python',
            description: 'História, filosofia e configuração',
            duration: '40 min',
            difficulty: 'beginner',
            content: {
              theory: `Python é uma linguagem de programação de alto nível, interpretada, de tipagem dinâmica e forte, multiparadigma e de propósito geral.

## Por que Python?

1. **Simplicidade**: Sintaxe clara e legível
2. **Versatilidade**: Web, ciência de dados, IA, automação
3. **Comunidade**: Vasta biblioteca padrão e packages
4. **Produtividade**: Desenvolvimento rápido

## Filosofia Python (Zen of Python):
- Simples é melhor que complexo
- Legibilidade conta
- Deve haver uma maneira óbvia de fazer algo
- Agora é melhor que nunca

## Características:
- **Interpretada**: Execução linha por linha
- **Tipagem dinâmica**: Tipos determinados em runtime
- **Orientada a objetos**: Tudo é objeto
- **Multiplataforma**: Roda em Windows, Mac, Linux`,
              codeExamples: [
                {
                  title: 'Primeiro programa Python',
                  code: `# Este é um comentário
"""
Este é um comentário
de múltiplas linhas
"""

print("Olá, mundo!")

# Variáveis
nome = "Maria"
idade = 30

print(f"Olá, {nome}! Você tem {idade} anos.")`,
                  explanation: 'Python usa indentação para definir blocos de código. F-strings (f"") são a forma moderna de formatar strings.'
                }
              ],
              keyPoints: [
                'Python usa indentação para definir estrutura',
                'Não precisa declarar tipos de variáveis',
                'Use f-strings para formatação de strings',
                'Python é case-sensitive',
                'PEP 8 define o estilo de código Python'
              ]
            },
            exercises: [
              {
                id: 'py-ex-1',
                title: 'Apresentação Pessoal',
                description: 'Crie variáveis para nome, idade e profissão e exiba uma apresentação',
                difficulty: 'easy',
                solution: `nome = "João"
idade = 28
profissao = "Desenvolvedor"

print(f"Olá! Meu nome é {nome}, tenho {idade} anos e sou {profissao}.")`,
                explanation: 'Este exercício demonstra variáveis, f-strings e a função print().'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Python é uma linguagem de programação de alto nível, interpretada e de propósito geral. Sua filosofia de design enfatiza a legibilidade do código com uso significativo de espaços em branco.`,
      syntax: [
        {
          category: 'Variáveis e Tipos',
          items: [
            {
              name: 'Variável',
              syntax: 'variavel = valor',
              description: 'Atribui um valor a uma variável',
              example: 'nome = "Python"'
            }
          ]
        }
      ],
      bestPractices: [
        'Siga o PEP 8 para estilo de código',
        'Use nomes descritivos para variáveis',
        'Prefira f-strings para formatação',
        'Use list comprehensions quando apropriado',
        'Documente suas funções com docstrings'
      ],
      commonPitfalls: [
        'Indentação inconsistente causa erros',
        'Variáveis mutáveis como argumentos padrão',
        'Modificar lista durante iteração',
        'Confundir is com ==',
        'Não entender escopo de variáveis'
      ],
      resources: [
        {
          title: 'Python Official Documentation',
          url: 'https://docs.python.org/',
          type: 'documentation'
        }
      ]
    }
  },

  // React Trail
  {
    id: 'react',
    name: 'React',
    description: 'Aprenda React do básico ao avançado, incluindo hooks, context API, performance e padrões modernos.',
    color: '#61dafb',
    icon: 'logo-react',
    level: 'Básico → Avançado',
    totalHours: 150,
    modules: [
      {
        id: 'react-fundamentals',
        title: 'Fundamentos do React',
        description: 'Componentes, JSX e conceitos básicos',
        icon: 'cube-outline',
        estimatedHours: 40,
        lessons: [
          {
            id: 'react-intro',
            title: 'Introdução ao React',
            description: 'O que é React, Virtual DOM e configuração',
            duration: '60 min',
            difficulty: 'beginner',
            content: {
              theory: `React é uma biblioteca JavaScript para construir interfaces de usuário, focada na criação de componentes reutilizáveis.

## Por que React?

1. **Component-Based**: Interface construída com componentes isolados
2. **Virtual DOM**: Otimização de performance através do Virtual DOM
3. **Declarativo**: Descreva como a UI deve aparecer para cada estado
4. **Learn Once, Write Anywhere**: React Native, Next.js, Gatsby

## Conceitos Fundamentais:

### JSX (JavaScript XML)
Extensão de sintaxe que permite escrever HTML dentro do JavaScript.

### Componentes
Blocos de construção reutilizáveis da interface.

### Props
Dados passados de componente pai para filho.

### State
Dados que podem mudar ao longo do tempo.`,
              codeExamples: [
                {
                  title: 'Primeiro Componente React',
                  code: `import React from 'react';

function Welcome(props) {
  return <h1>Olá, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

export default App;`,
                  explanation: 'Este exemplo mostra como criar componentes funcionais e usar props para passar dados.'
                }
              ],
              keyPoints: [
                'React é uma biblioteca, não um framework',
                'JSX é JavaScript, não HTML',
                'Componentes devem começar com letra maiúscula',
                'Props são imutáveis',
                'Sempre retorne um único elemento raiz'
              ]
            },
            exercises: [
              {
                id: 'react-ex-1',
                title: 'Cartão de Perfil',
                description: 'Crie um componente ProfileCard que receba nome, idade e profissão via props',
                difficulty: 'easy',
                code: `// Crie o componente ProfileCard
function ProfileCard(props) {
  // Sua implementação aqui
}

// Use o componente
function App() {
  return (
    <div>
      <ProfileCard 
        name="João Silva" 
        age={28} 
        profession="Desenvolvedor" 
      />
    </div>
  );
}`,
                solution: `function ProfileCard(props) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px'
    }}>
      <h2>{props.name}</h2>
      <p>Idade: {props.age}</p>
      <p>Profissão: {props.profession}</p>
    </div>
  );
}`,
                explanation: 'Este exercício demonstra criação de componente, uso de props e JSX básico.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `React é uma biblioteca JavaScript para construir interfaces de usuário. É mantida pelo Facebook e uma comunidade de desenvolvedores individuais e empresas.

## Características Principais:

- **Declarativo**: React torna fácil criar UIs interativas
- **Baseado em Componentes**: Construa componentes encapsulados que gerenciam seu próprio estado
- **Learn Once, Write Anywhere**: Use React para desenvolver novas features sem reescrever código existente`,
      syntax: [
        {
          category: 'Componentes',
          items: [
            {
              name: 'Function Component',
              syntax: 'function ComponentName(props) { return <JSX />; }',
              description: 'Componente funcional básico',
              example: 'function Welcome(props) { return <h1>Hello {props.name}</h1>; }'
            },
            {
              name: 'Arrow Function Component',
              syntax: 'const ComponentName = (props) => { return <JSX />; };',
              description: 'Componente funcional com arrow function',
              example: 'const Welcome = (props) => <h1>Hello {props.name}</h1>;'
            }
          ]
        }
      ],
      bestPractices: [
        'Use componentes funcionais ao invés de classes',
        'Sempre use keys em listas',
        'Mantenha componentes pequenos e focados',
        'Use PropTypes ou TypeScript para type checking',
        'Evite mutação direta do state',
        'Use hooks para lógica de estado'
      ],
      commonPitfalls: [
        'Esquecer de usar key em listas',
        'Modificar state diretamente',
        'Não usar useCallback/useMemo quando necessário',
        'Criar componentes muito grandes',
        'Não seguir convenções de nomenclatura'
      ],
      resources: [
        {
          title: 'React Official Documentation',
          url: 'https://react.dev/',
          type: 'documentation'
        }
      ]
    }
  },

  // Node.js Trail
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Domine Node.js para desenvolvimento backend, APIs REST, microserviços e aplicações em tempo real.',
    color: '#8cc84b',
    icon: 'logo-nodejs',
    level: 'Básico → Avançado',
    totalHours: 130,
    modules: [
      {
        id: 'nodejs-fundamentals',
        title: 'Fundamentos do Node.js',
        description: 'Conceitos básicos, módulos e sistema de arquivos',
        icon: 'server-outline',
        estimatedHours: 35,
        lessons: [
          {
            id: 'nodejs-intro',
            title: 'Introdução ao Node.js',
            description: 'O que é Node.js, Event Loop e instalação',
            duration: '50 min',
            difficulty: 'beginner',
            content: {
              theory: `Node.js é um runtime JavaScript baseado no motor V8 do Chrome que permite executar JavaScript no servidor.

## Por que Node.js?

1. **JavaScript Everywhere**: Uma linguagem para frontend e backend
2. **Alta Performance**: Event loop não-bloqueante
3. **NPM**: Maior repositório de bibliotecas do mundo
4. **Escalabilidade**: Ideal para aplicações I/O intensivas

## Conceitos Fundamentais:

### Event Loop
Sistema que permite operações não-bloqueantes.

### Módulos CommonJS
Sistema de módulos nativo do Node.js.

### NPM (Node Package Manager)
Gerenciador de pacotes oficial.

### Streams
Sistema para processar dados em chunks.`,
              codeExamples: [
                {
                  title: 'Primeiro servidor HTTP',
                  code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Olá, mundo com Node.js!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Servidor rodando em http://localhost:\${PORT}\`);
});`,
                  explanation: 'Este exemplo cria um servidor HTTP básico que responde com "Olá, mundo" para todas as requisições.'
                }
              ],
              keyPoints: [
                'Node.js é single-threaded com event loop',
                'Ideal para aplicações I/O intensivas',
                'NPM é o gerenciador de pacotes padrão',
                'Módulos são carregados com require()',
                'Event-driven e não-bloqueante por natureza'
              ]
            },
            exercises: [
              {
                id: 'node-ex-1',
                title: 'Servidor de Arquivos',
                description: 'Crie um servidor que leia e sirva um arquivo HTML',
                difficulty: 'easy',
                solution: `const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Arquivo não encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});`,
                explanation: 'Este exercício demonstra leitura de arquivos e criação de servidor HTTP.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Node.js é um runtime JavaScript construído no motor V8 do Chrome. Node.js usa um modelo de I/O não-bloqueante e orientado por eventos que o torna leve e eficiente.`,
      syntax: [
        {
          category: 'Módulos',
          items: [
            {
              name: 'require',
              syntax: 'const module = require("module-name");',
              description: 'Importa um módulo',
              example: 'const fs = require("fs");'
            }
          ]
        }
      ],
      bestPractices: [
        'Use npm scripts para automação',
        'Sempre trate erros em callbacks',
        'Use promises ou async/await',
        'Configure variáveis de ambiente',
        'Use ferramentas como nodemon para desenvolvimento'
      ],
      commonPitfalls: [
        'Callback hell - use promises/async-await',
        'Não tratar erros adequadamente',
        'Bloquear o event loop com operações síncronas',
        'Não usar clustering para múltiplos cores',
        'Vazar memória com event listeners'
      ],
      resources: [
        {
          title: 'Node.js Official Documentation',
          url: 'https://nodejs.org/docs/',
          type: 'documentation'
        }
      ]
    }
  },

  // TypeScript Trail
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Aprenda TypeScript para escrever código JavaScript mais seguro e escalável com tipagem estática.',
    color: '#3178c6',
    icon: 'code-outline',
    level: 'Intermediário → Avançado',
    totalHours: 80,
    modules: [
      {
        id: 'ts-fundamentals',
        title: 'Fundamentos do TypeScript',
        description: 'Tipos básicos, interfaces e configuração',
        icon: 'shield-checkmark-outline',
        estimatedHours: 25,
        lessons: [
          {
            id: 'ts-intro',
            title: 'Introdução ao TypeScript',
            description: 'O que é TypeScript e por que usar',
            duration: '45 min',
            difficulty: 'intermediate',
            content: {
              theory: `TypeScript é um superset do JavaScript que adiciona tipagem estática opcional, desenvolvido pela Microsoft.

## Por que TypeScript?

1. **Detecção de Erros**: Encontra erros em tempo de compilação
2. **Melhor IDE**: Autocompletar, refatoração e navegação
3. **Manutenibilidade**: Código mais legível e documentado
4. **Escalabilidade**: Ideal para projetos grandes

## Características:
- Compila para JavaScript puro
- Tipagem estática opcional
- Suporte a recursos ES6+
- Compatível com bibliotecas JavaScript`,
              codeExamples: [
                {
                  title: 'Tipos básicos',
                  code: `// Tipos primitivos
let nome: string = "João";
let idade: number = 30;
let ativo: boolean = true;

// Arrays
let numeros: number[] = [1, 2, 3];
let frutas: Array<string> = ["maçã", "banana"];

// Funções
function somar(a: number, b: number): number {
  return a + b;
}`,
                  explanation: 'TypeScript adiciona tipos aos seus dados, tornando o código mais previsível.'
                }
              ],
              keyPoints: [
                'TypeScript é JavaScript com tipos',
                'Compilação encontra erros antes da execução',
                'Melhora a experiência de desenvolvimento',
                'Totalmente compatível com JavaScript existente'
              ]
            },
            exercises: [
              {
                id: 'ts-ex-1',
                title: 'Função Tipada',
                description: 'Crie uma função que calcule a área de um retângulo com tipos',
                difficulty: 'medium',
                solution: `function calcularArea(largura: number, altura: number): number {
  return largura * altura;
}

const area: number = calcularArea(10, 5);
console.log(\`Área: \${area}\`);`,
                explanation: 'Este exercício demonstra tipagem de parâmetros e retorno de função.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `TypeScript é um superset tipado do JavaScript que compila para JavaScript puro. Adiciona tipagem estática opcional ao JavaScript.`,
      syntax: [
        {
          category: 'Tipos',
          items: [
            {
              name: 'Type Annotation',
              syntax: 'let variable: type = value;',
              description: 'Adiciona tipo a uma variável',
              example: 'let name: string = "TypeScript";'
            }
          ]
        }
      ],
      bestPractices: [
        'Use strict mode no tsconfig.json',
        'Prefira interfaces a types para objetos',
        'Use union types ao invés de any',
        'Configure path mapping para imports limpos'
      ],
      commonPitfalls: [
        'Usar any excessivamente',
        'Não configurar strict mode',
        'Ignorar erros com @ts-ignore',
        'Não usar tipos genéricos quando apropriado'
      ],
      resources: [
        {
          title: 'TypeScript Handbook',
          url: 'https://www.typescriptlang.org/docs/',
          type: 'documentation'
        }
      ]
    }
  },

  // Java Trail
  {
    id: 'java',
    name: 'Java',
    description: 'Domine Java, uma das linguagens mais utilizadas no mundo corporativo, do básico ao avançado.',
    color: '#ed8b00',
    icon: 'cafe-outline',
    level: 'Básico → Avançado',
    totalHours: 180,
    modules: [
      {
        id: 'java-fundamentals',
        title: 'Fundamentos do Java',
        description: 'Sintaxe básica, OOP e estruturas de dados',
        icon: 'library-outline',
        estimatedHours: 45,
        lessons: [
          {
            id: 'java-intro',
            title: 'Introdução ao Java',
            description: 'História, JVM e primeiro programa',
            duration: '60 min',
            difficulty: 'beginner',
            content: {
              theory: `Java é uma linguagem de programação orientada a objetos, desenvolvida pela Sun Microsystems (agora Oracle).

## Por que Java?

1. **Portabilidade**: "Write once, run anywhere" (WORA)
2. **Robustez**: Gerenciamento automático de memória
3. **Segurança**: Sandbox de segurança
4. **Performance**: JIT compilation
5. **Comunidade**: Vasta comunidade e bibliotecas

## Características:
- Orientada a objetos
- Independente de plataforma (JVM)
- Multithreading nativo
- Garbage collection automático
- Fortemente tipada`,
              codeExamples: [
                {
                  title: 'Primeiro programa Java',
                  code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
        
        // Variáveis
        String nome = "Java";
        int versao = 17;
        
        System.out.println("Linguagem: " + nome);
        System.out.println("Versão: " + versao);
    }
}`,
                  explanation: 'Todo programa Java precisa de uma classe com método main para execução.'
                }
              ],
              keyPoints: [
                'Java roda na JVM (Java Virtual Machine)',
                'Tudo é objeto (exceto tipos primitivos)',
                'Fortemente tipada e compilada',
                'Gerenciamento automático de memória',
                'Case-sensitive como JavaScript'
              ]
            },
            exercises: [
              {
                id: 'java-ex-1',
                title: 'Calculadora Simples',
                description: 'Crie uma classe que faça operações matemáticas básicas',
                difficulty: 'easy',
                solution: `public class Calculadora {
    public double somar(double a, double b) {
        return a + b;
    }
    
    public double subtrair(double a, double b) {
        return a - b;
    }
    
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        System.out.println("5 + 3 = " + calc.somar(5, 3));
        System.out.println("5 - 3 = " + calc.subtrair(5, 3));
    }
}`,
                explanation: 'Este exercício demonstra criação de classe, métodos e instanciação.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Java é uma linguagem de programação orientada a objetos, robusta, segura e independente de plataforma.`,
      syntax: [
        {
          category: 'Classes e Objetos',
          items: [
            {
              name: 'Class Declaration',
              syntax: 'public class ClassName { }',
              description: 'Declara uma classe pública',
              example: 'public class MinhaClasse { }'
            }
          ]
        }
      ],
      bestPractices: [
        'Siga convenções de nomenclatura Java',
        'Use encapsulamento (getters/setters)',
        'Implemente equals() e hashCode() quando necessário',
        'Use StringBuilder para concatenação de strings',
        'Prefira composition over inheritance'
      ],
      commonPitfalls: [
        'Comparar strings com == ao invés de equals()',
        'Não fechar recursos (try-with-resources)',
        'Memory leaks com listeners',
        'Não tratar exceptions adequadamente',
        'Usar raw types ao invés de generics'
      ],
      resources: [
        {
          title: 'Oracle Java Documentation',
          url: 'https://docs.oracle.com/javase/',
          type: 'documentation'
        }
      ]
    }
  },

  // Go Trail
  {
    id: 'go',
    name: 'Go',
    description: 'Aprenda Go (Golang), a linguagem criada pelo Google para sistemas distribuídos e alta performance.',
    color: '#00add8',
    icon: 'flash-outline',
    level: 'Intermediário → Avançado',
    totalHours: 120,
    modules: [
      {
        id: 'go-fundamentals',
        title: 'Fundamentos do Go',
        description: 'Sintaxe, goroutines e channels',
        icon: 'rocket-outline',
        estimatedHours: 35,
        lessons: [
          {
            id: 'go-intro',
            title: 'Introdução ao Go',
            description: 'Filosofia, características e instalação',
            duration: '50 min',
            difficulty: 'intermediate',
            content: {
              theory: `Go é uma linguagem de programação open source desenvolvida pelo Google, focada em simplicidade e eficiência.

## Por que Go?

1. **Simplicidade**: Sintaxe limpa e minimalista
2. **Performance**: Compilado para código nativo
3. **Concorrência**: Goroutines e channels nativos
4. **Produtividade**: Compilação rápida e deploy simples

## Características:
- Staticamente tipada
- Garbage collection
- Compilação cruzada
- Reflection limitada
- Sem herança de classes`,
              codeExamples: [
                {
                  title: 'Hello World em Go',
                  code: `package main

import "fmt"

func main() {
    fmt.Println("Olá, mundo!")
    
    // Declaração de variáveis
    var nome string = "Go"
    idade := 14 // inferência de tipo
    
    fmt.Printf("Linguagem: %s, Idade: %d anos\\n", nome, idade)
}`,
                  explanation: 'Go usa packages, imports explícitos e := para declaração com inferência.'
                }
              ],
              keyPoints: [
                'Go é compilado para binário único',
                'Goroutines tornam concorrência simples',
                'Sem classes, usa structs e métodos',
                'Error handling explícito',
                'Formatação automática com gofmt'
              ]
            },
            exercises: [
              {
                id: 'go-ex-1',
                title: 'Servidor HTTP Simples',
                description: 'Crie um servidor web básico que responda "Hello, Go!"',
                difficulty: 'medium',
                solution: `package main

import (
    "fmt"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, Go!")
}

func main() {
    http.HandleFunc("/", helloHandler)
    fmt.Println("Servidor rodando em http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}`,
                explanation: 'Go tem excelente suporte nativo para servidores HTTP.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Go é uma linguagem de programação open source que torna fácil construir software simples, confiável e eficiente.`,
      syntax: [
        {
          category: 'Funções',
          items: [
            {
              name: 'Function Declaration',
              syntax: 'func name(params) returnType { }',
              description: 'Declara uma função',
              example: 'func add(a, b int) int { return a + b }'
            }
          ]
        }
      ],
      bestPractices: [
        'Use gofmt para formatação consistente',
        'Siga convenções de nomenclatura Go',
        'Trate erros explicitamente',
        'Use interfaces pequenas',
        'Prefira composition over embedding'
      ],
      commonPitfalls: [
        'Não tratar todos os erros',
        'Usar goroutines sem sincronização',
        'Não entender slices vs arrays',
        'Não usar defer adequadamente',
        'Criar vazamentos de goroutines'
      ],
      resources: [
        {
          title: 'Go Official Documentation',
          url: 'https://golang.org/doc/',
          type: 'documentation'
        }
      ]
    }
  },

  // Rust Trail
  {
    id: 'rust',
    name: 'Rust',
    description: 'Domine Rust, a linguagem que combina performance de baixo nível com segurança de memória.',
    color: '#ce422b',
    icon: 'shield-outline',
    level: 'Avançado',
    totalHours: 150,
    modules: [
      {
        id: 'rust-fundamentals',
        title: 'Fundamentos do Rust',
        description: 'Ownership, borrowing e lifetimes',
        icon: 'construct-outline',
        estimatedHours: 50,
        lessons: [
          {
            id: 'rust-intro',
            title: 'Introdução ao Rust',
            description: 'Filosofia, ownership e primeiro programa',
            duration: '60 min',
            difficulty: 'advanced',
            content: {
              theory: `Rust é uma linguagem de programação de sistemas que combina performance com segurança de memória.

## Por que Rust?

1. **Segurança**: Zero-cost abstractions sem garbage collector
2. **Performance**: Velocidade comparável a C/C++
3. **Concorrência**: Concorrência segura por design
4. **Confiabilidade**: Sistema de tipos previne bugs comuns

## Conceitos Únicos:

### Ownership
Cada valor tem um único owner que gerencia sua memória.

### Borrowing
Referências que permitem usar valores sem tomar ownership.

### Lifetimes
Garantem que referências são válidas pelo tempo necessário.`,
              codeExamples: [
                {
                  title: 'Hello World e Ownership',
                  code: `fn main() {
    println!("Olá, mundo!");
    
    // Ownership
    let s1 = String::from("hello");
    let s2 = s1; // s1 não pode mais ser usado
    
    println!("{}", s2);
    
    // Borrowing
    let s3 = String::from("world");
    let len = calculate_length(&s3);
    println!("Comprimento de '{}': {}", s3, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}`,
                  explanation: 'Rust previne bugs de memória através do sistema de ownership.'
                }
              ],
              keyPoints: [
                'Ownership previne vazamentos de memória',
                'Borrow checker garante segurança',
                'Performance sem garbage collection',
                'Pattern matching poderoso',
                'Error handling com Result<T, E>'
              ]
            },
            exercises: [
              {
                id: 'rust-ex-1',
                title: 'Contador de Palavras',
                description: 'Implemente uma função que conte palavras em uma string',
                difficulty: 'hard',
                solution: `fn main() {
    let texto = "Rust é uma linguagem incrível";
    let contador = contar_palavras(&texto);
    println!("Número de palavras: {}", contador);
}

fn contar_palavras(s: &str) -> usize {
    s.split_whitespace().count()
}`,
                explanation: 'Este exercício demonstra borrowing e métodos de iteradores.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Rust é uma linguagem de programação de sistemas que roda incrivelmente rápido, previne segfaults e garante thread safety.`,
      syntax: [
        {
          category: 'Ownership',
          items: [
            {
              name: 'Borrowing',
              syntax: 'let reference = &value;',
              description: 'Cria uma referência imutável',
              example: 'let s = String::from("hello"); let r = &s;'
            }
          ]
        }
      ],
      bestPractices: [
        'Use ownership para gerenciar recursos',
        'Prefira &str a String quando possível',
        'Use Result<T, E> para error handling',
        'Aproveite pattern matching',
        'Use iterators ao invés de loops quando apropriado'
      ],
      commonPitfalls: [
        'Lutar contra o borrow checker',
        'Usar clone() excessivamente',
        'Não entender lifetimes',
        'Unwrap() sem tratamento de erro',
        'Não usar ownership corretamente'
      ],
      resources: [
        {
          title: 'The Rust Book',
          url: 'https://doc.rust-lang.org/book/',
          type: 'book'
        }
      ]
    }
  },

  // Flutter/Dart Trail
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    description: 'Construa aplicativos móveis multiplataforma com Flutter e a linguagem Dart.',
    color: '#02569b',
    icon: 'phone-portrait-outline',
    level: 'Intermediário → Avançado',
    totalHours: 140,
    modules: [
      {
        id: 'flutter-fundamentals',
        title: 'Fundamentos do Flutter',
        description: 'Widgets, estado e layouts',
        icon: 'grid-outline',
        estimatedHours: 40,
        lessons: [
          {
            id: 'flutter-intro',
            title: 'Introdução ao Flutter',
            description: 'Framework, Dart e primeiro app',
            duration: '55 min',
            difficulty: 'intermediate',
            content: {
              theory: `Flutter é um SDK de desenvolvimento de aplicativos móveis criado pelo Google que permite criar apps nativos para iOS e Android.

## Por que Flutter?

1. **Cross-platform**: Um código para iOS e Android
2. **Performance**: Compilado para código nativo
3. **Hot Reload**: Desenvolvimento rápido
4. **Widgets**: Interface consistente e customizável

## Dart Language:
- Orientada a objetos
- Tipagem opcional
- Null safety
- Async/await nativo
- Compilada para ARM e JavaScript

## Conceitos Fundamentais:
- Everything is a Widget
- Stateless vs Stateful
- Build method
- Widget tree`,
              codeExamples: [
                {
                  title: 'Primeiro app Flutter',
                  code: `import 'package:flutter/material.dart';

void main() {
  runApp(MeuApp());
}

class MeuApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meu Primeiro App',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Hello Flutter'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Olá, Flutter!'),
              ElevatedButton(
                onPressed: () {
                  print('Botão pressionado!');
                },
                child: Text('Clique aqui'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
                  explanation: 'Flutter usa widgets para construir interfaces. Tudo é um widget!'
                }
              ],
              keyPoints: [
                'Everything is a Widget no Flutter',
                'StatelessWidget para UI estática',
                'StatefulWidget para UI dinâmica',
                'Hot reload acelera desenvolvimento',
                'Material Design e Cupertino built-in'
              ]
            },
            exercises: [
              {
                id: 'flutter-ex-1',
                title: 'Contador Interativo',
                description: 'Crie um app que conte cliques com StatefulWidget',
                difficulty: 'medium',
                solution: `class ContadorApp extends StatefulWidget {
  @override
  _ContadorAppState createState() => _ContadorAppState();
}

class _ContadorAppState extends State<ContadorApp> {
  int _contador = 0;
  
  void _incrementar() {
    setState(() {
      _contador++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Contador')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Você clicou:'),
            Text('$_contador', style: Theme.of(context).textTheme.headline4),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementar,
        child: Icon(Icons.add),
      ),
    );
  }
}`,
                explanation: 'StatefulWidget permite mudanças de estado com setState().'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Flutter é o kit de ferramentas de UI do Google para criar aplicativos nativos compilados para mobile, web e desktop a partir de uma única base de código.`,
      syntax: [
        {
          category: 'Widgets',
          items: [
            {
              name: 'StatelessWidget',
              syntax: 'class MyWidget extends StatelessWidget { Widget build(BuildContext context) { return Container(); } }',
              description: 'Widget sem estado interno',
              example: 'class MyText extends StatelessWidget { ... }'
            }
          ]
        }
      ],
      bestPractices: [
        'Use const constructors quando possível',
        'Extraia widgets complexos em widgets menores',
        'Use StatelessWidget sempre que possível',
        'Implemente keys para performance',
        'Use async/await para operações assíncronas'
      ],
      commonPitfalls: [
        'Não usar const em widgets estáticos',
        'Árvore de widgets muito profunda',
        'setState() em widgets desmontados',
        'Não tratar estados de loading',
        'Memory leaks com StreamSubscriptions'
      ],
      resources: [
        {
          title: 'Flutter Documentation',
          url: 'https://flutter.dev/docs',
          type: 'documentation'
        }
      ]
    }
  }
];

// Função helper para buscar trilha por ID
export const getTrailById = (id: string): LearningTrail | undefined => {
  return learningTrails.find(trail => trail.id === id);
};

// Função helper para buscar módulo por ID
export const getModuleById = (trailId: string, moduleId: string): Module | undefined => {
  const trail = getTrailById(trailId);
  return trail?.modules.find(module => module.id === moduleId);
};

// Função helper para buscar lição por ID
export const getLessonById = (trailId: string, moduleId: string, lessonId: string): Lesson | undefined => {
  const module = getModuleById(trailId, moduleId);
  return module?.lessons.find(lesson => lesson.id === lessonId);
};