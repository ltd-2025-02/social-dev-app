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
  },

  // Algorithms & Data Structures Trail
  {
    id: 'algorithms',
    name: 'Algoritmos e Estruturas de Dados',
    description: 'Domine complexidade de algoritmos, notação Big O, estruturas de dados avançadas e técnicas de programação eficiente.',
    color: '#8b5cf6',
    icon: 'git-network-outline',
    level: 'Intermediário → Avançado',
    totalHours: 200,
    modules: [
      {
        id: 'algorithms-complexity',
        title: 'Análise de Complexidade e Big O',
        description: 'Fundamentos de análise assintótica e notação Big O',
        icon: 'analytics-outline',
        estimatedHours: 40,
        lessons: [
          {
            id: 'big-o-intro',
            title: 'Introdução à Análise de Complexidade',
            description: 'O que é complexidade computacional e por que importa',
            duration: '60 min',
            difficulty: 'intermediate',
            content: {
              theory: `A análise de complexidade é fundamental para escrever código eficiente e escalável. Ela nos permite comparar algoritmos e escolher a melhor solução para cada problema.

## Por que Complexidade Importa?

1. **Performance**: Diferença entre segundos e horas de execução
2. **Escalabilidade**: Como o algoritmo se comporta com dados maiores
3. **Recursos**: Uso eficiente de memória e processamento
4. **Tomada de decisão**: Escolher o algoritmo correto para cada situação

## Tipos de Complexidade:

### Complexidade de Tempo
Quantas operações o algoritmo executa em função do tamanho da entrada.

### Complexidade de Espaço  
Quanta memória adicional o algoritmo usa em função do tamanho da entrada.

## Casos de Análise:

### Melhor Caso (Ω - Ômega)
O menor tempo possível de execução.

### Caso Médio (Θ - Theta)
O tempo esperado de execução em cenários típicos.

### Pior Caso (O - Big O)
O maior tempo possível de execução - mais usado na prática.

## Exemplo Prático:

Imagine que você tem um array de 1 milhão de elementos:
- O(1): 1 operação - excelente!
- O(log n): ~20 operações - muito bom!
- O(n): 1 milhão de operações - aceitável
- O(n²): 1 trilhão de operações - problemático!

A diferença pode ser entre milissegundos e horas de processamento.`,
              codeExamples: [
                {
                  title: 'Exemplo de diferentes complexidades',
                  code: `// O(1) - Complexidade constante
function acessarElemento(arr, index) {
    return arr[index]; // Uma operação, independente do tamanho
}

// O(n) - Complexidade linear
function buscarLinear(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1; // Pode precisar verificar todos os elementos
}

// O(n²) - Complexidade quadrática
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr; // Loop dentro de loop = n × n operações
}

// O(log n) - Complexidade logarítmica
function buscaBinaria(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Divide pela metade a cada iteração
}`,
                  explanation: 'Cada função tem comportamento diferente conforme o tamanho da entrada cresce. O(1) é sempre rápido, O(n²) fica lento rapidamente com arrays grandes.'
                },
                {
                  title: 'Medindo tempo de execução na prática',
                  code: `function medirTempo(funcao, dados, nome) {
    const inicio = performance.now();
    const resultado = funcao(dados);
    const fim = performance.now();
    
    console.log(\`\${nome}: \${(fim - inicio).toFixed(2)}ms\`);
    return resultado;
}

// Testando com dados de diferentes tamanhos
const pequeno = Array.from({length: 1000}, (_, i) => i);
const grande = Array.from({length: 100000}, (_, i) => i);

// Busca linear vs busca binária
medirTempo(() => buscarLinear(pequeno, 999), null, 'Busca Linear (1K)');
medirTempo(() => buscaBinaria(pequeno, 999), null, 'Busca Binária (1K)');

medirTempo(() => buscarLinear(grande, 99999), null, 'Busca Linear (100K)');
medirTempo(() => buscaBinaria(grande, 99999), null, 'Busca Binária (100K)');

// Observe como a busca binária permanece rápida mesmo com mais dados!`,
                  explanation: 'Este exemplo mostra como medir performance na prática e comparar algoritmos com diferentes complexidades.'
                }
              ],
              keyPoints: [
                'Big O descreve como o algoritmo escala com o tamanho da entrada',
                'O(1) é ideal, O(n) é bom, O(n²) deve ser evitado quando possível',
                'Complexidade de tempo e espaço são igualmente importantes',
                'Escolha o algoritmo certo para cada situação específica',
                'Meça performance com dados reais sempre que possível'
              ]
            },
            exercises: [
              {
                id: 'complexity-ex-1',
                title: 'Analisando Complexidade',
                description: 'Analise a complexidade de tempo das seguintes funções e explique o porquê',
                difficulty: 'medium',
                code: `// Função A
function funcaoA(arr) {
    let soma = 0;
    for (let i = 0; i < arr.length; i++) {
        soma += arr[i];
    }
    return soma;
}

// Função B
function funcaoB(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === 10) {
                return true;
            }
        }
    }
    return false;
}

// Função C
function funcaoC(n) {
    if (n <= 1) return n;
    return funcaoC(n - 1) + funcaoC(n - 2);
}`,
                expectedOutput: 'Função A: O(n), Função B: O(n²), Função C: O(2^n)',
                hint: 'Conte quantos loops existem e se eles são independentes ou aninhados. Para recursão, pense em quantas chamadas são feitas.',
                solution: `// Análise das complexidades:

// Função A: O(n)
// - Um único loop que percorre o array uma vez
// - Cada elemento é visitado exatamente uma vez
// - Complexidade linear em relação ao tamanho do array

// Função B: O(n²)
// - Loop externo: executa n vezes
// - Loop interno: executa n-1, n-2, ..., 1 vezes
// - Total: n × (n-1)/2 ≈ n²/2, que é O(n²)
// - Complexidade quadrática

// Função C: O(2^n)
// - Recursão de Fibonacci ingênua
// - Cada chamada gera 2 novas chamadas
// - Árvore de recursão tem altura n
// - Total de chamadas: aproximadamente 2^n
// - Complexidade exponencial - muito ineficiente!`,
                explanation: 'A análise de complexidade requer contar operações e entender como elas crescem com o tamanho da entrada. Loops aninhados multiplicam a complexidade, enquanto recursão pode criar crescimento exponencial.'
              },
              {
                id: 'complexity-ex-2',
                title: 'Otimizando Algoritmo',
                description: 'Melhore a complexidade desta função que encontra elementos duplicados',
                difficulty: 'hard',
                code: `// Versão O(n²) - ineficiente
function encontrarDuplicados(arr) {
    const duplicados = [];
    
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j] && !duplicados.includes(arr[i])) {
                duplicados.push(arr[i]);
            }
        }
    }
    
    return duplicados;
}

// Otimize para O(n)`,
                solution: `// Versão O(n) - otimizada usando Set
function encontrarDuplicados(arr) {
    const vistos = new Set();
    const duplicados = new Set();
    
    for (const elemento of arr) {
        if (vistos.has(elemento)) {
            duplicados.add(elemento);
        } else {
            vistos.add(elemento);
        }
    }
    
    return Array.from(duplicados);
}

// Alternativa usando Map para contar frequências
function encontrarDuplicadosComFrequencia(arr) {
    const contador = new Map();
    
    // Primeira passada: contar frequências O(n)
    for (const elemento of arr) {
        contador.set(elemento, (contador.get(elemento) || 0) + 1);
    }
    
    // Segunda passada: filtrar duplicados O(n)
    const duplicados = [];
    for (const [elemento, frequencia] of contador) {
        if (frequencia > 1) {
            duplicados.push(elemento);
        }
    }
    
    return duplicados;
}`,
                explanation: 'A otimização principal foi eliminar o loop aninhado usando estruturas de dados eficientes como Set/Map, que têm operações O(1) para busca e inserção.'
              }
            ]
          },
          {
            id: 'big-o-notation',
            title: 'Notação Big O Completa',
            description: 'Todos os tipos de complexidade: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2^n), O(n!)',
            duration: '90 min',
            difficulty: 'intermediate',
            content: {
              theory: `A notação Big O classifica algoritmos baseado em como seu tempo de execução ou uso de espaço cresce com o tamanho da entrada.

## Hierarquia das Complexidades (da melhor para a pior):

### 1. O(1) - Constante
- **Definição**: Tempo constante, independente do tamanho da entrada
- **Exemplos**: Acesso a array por índice, operações aritméticas simples
- **Comportamento**: Sempre executa no mesmo tempo

### 2. O(log n) - Logarítmica  
- **Definição**: Tempo cresce logaritmicamente com a entrada
- **Exemplos**: Busca binária, árvores balanceadas
- **Comportamento**: Muito eficiente mesmo para entradas grandes

### 3. O(n) - Linear
- **Definição**: Tempo proporcional ao tamanho da entrada
- **Exemplos**: Percorrer array, busca linear
- **Comportamento**: Dobra o tempo quando dobra a entrada

### 4. O(n log n) - Linearítmica
- **Definição**: Combinação de linear com logarítmica
- **Exemplos**: Merge Sort, Quick Sort, Heap Sort
- **Comportamento**: Melhor complexidade para algoritmos de ordenação por comparação

### 5. O(n²) - Quadrática
- **Definição**: Tempo proporcional ao quadrado da entrada
- **Exemplos**: Bubble Sort, Selection Sort, loops aninhados
- **Comportamento**: 4x mais lento quando dobra a entrada

### 6. O(n³) - Cúbica
- **Definição**: Tempo proporcional ao cubo da entrada
- **Exemplos**: Alguns algoritmos de multiplicação de matrizes
- **Comportamento**: 8x mais lento quando dobra a entrada

### 7. O(2^n) - Exponencial
- **Definição**: Tempo dobra a cada elemento adicionado
- **Exemplos**: Fibonacci recursivo, problemas de força bruta
- **Comportamento**: Rapidamente se torna impraticável

### 8. O(n!) - Fatorial
- **Definição**: Tempo cresce fatorialmente
- **Exemplos**: Problema do Caixeiro Viajante por força bruta
- **Comportamento**: A pior complexidade possível

## Comparação Prática:

Para n = 10:
- O(1): 1 operação
- O(log n): 3 operações  
- O(n): 10 operações
- O(n log n): 30 operações
- O(n²): 100 operações
- O(2^n): 1.024 operações
- O(n!): 3.628.800 operações

Para n = 20:
- O(1): 1 operação
- O(log n): 4 operações
- O(n): 20 operações  
- O(n log n): 80 operações
- O(n²): 400 operações
- O(2^n): 1.048.576 operações
- O(n!): 2.432.902.008.176.640.000 operações!`,
              codeExamples: [
                {
                  title: 'Exemplos de cada complexidade',
                  code: `// O(1) - Constante
function obterPrimeiro(arr) {
    return arr[0]; // Sempre 1 operação
}

// O(log n) - Logarítmica
function buscaBinaria(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Divide pela metade a cada iteração
}

// O(n) - Linear
function somar(arr) {
    let soma = 0;
    for (const num of arr) { // Visita cada elemento uma vez
        soma += num;
    }
    return soma;
}

// O(n log n) - Linearítmica  
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));  // log n níveis
    const right = mergeSort(arr.slice(mid));    // n trabalho por nível
    
    return merge(left, right);
}

// O(n²) - Quadrática
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {        // n iterações
        for (let j = 0; j < arr.length - i - 1; j++) { // n iterações
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr; // n × n = n²
}

// O(2^n) - Exponencial
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2); // 2 chamadas por nível
}

// O(n!) - Fatorial
function gerarPermutacoes(arr) {
    if (arr.length === 0) return [[]];
    
    const permutacoes = [];
    for (let i = 0; i < arr.length; i++) {
        const elemento = arr[i];
        const resto = arr.slice(0, i).concat(arr.slice(i + 1));
        
        for (const perm of gerarPermutacoes(resto)) {
            permutacoes.push([elemento, ...perm]);
        }
    }
    return permutacoes; // n! permutações possíveis
}`,
                  explanation: 'Cada tipo de complexidade tem características únicas. Entender quando e por que cada uma ocorre é fundamental para escrever código eficiente.'
                },
                {
                  title: 'Otimizações comuns',
                  code: `// ANTES: O(n²) - Buscar duplicatas
function temDuplicataLenta(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return true;
        }
    }
    return false;
}

// DEPOIS: O(n) - Usando Set
function temDuplicataRapida(arr) {
    const vistos = new Set();
    for (const item of arr) {
        if (vistos.has(item)) return true;
        vistos.add(item);
    }
    return false;
}

// ANTES: O(2^n) - Fibonacci recursivo
function fibLento(n) {
    if (n <= 1) return n;
    return fibLento(n - 1) + fibLento(n - 2);
}

// DEPOIS: O(n) - Fibonacci com memoização
function fibRapido(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibRapido(n - 1, memo) + fibRapido(n - 2, memo);
    return memo[n];
}

// AINDA MELHOR: O(n) espaço O(1) - Iterativo
function fibOtimo(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}`,
                  explanation: 'Muitas otimizações envolvem trocar espaço por tempo (memoização) ou eliminar redundâncias (usar estruturas de dados eficientes).'
                }
              ],
              keyPoints: [
                'O(1) e O(log n) são excelentes para qualquer tamanho de dados',
                'O(n) e O(n log n) são aceitáveis para a maioria dos casos',
                'O(n²) deve ser evitado para grandes volumes de dados',
                'O(2^n) e O(n!) são impraticáveis para entradas grandes',
                'Sempre considere otimizações quando a complexidade é alta',
                'Meça performance real além da análise teórica'
              ]
            },
            exercises: [
              {
                id: 'big-o-classification',
                title: 'Classificação de Complexidades',
                description: 'Classifique a complexidade de tempo de cada algoritmo',
                difficulty: 'medium',
                code: `// Algoritmo 1
function algoritmo1(arr) {
    return arr[arr.length - 1];
}

// Algoritmo 2  
function algoritmo2(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

// Algoritmo 3
function algoritmo3(n) {
    let count = 0;
    for (let i = 1; i < n; i *= 2) {
        count++;
    }
    return count;
}

// Algoritmo 4
function algoritmo4(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr.length; k++) {
                console.log(arr[i], arr[j], arr[k]);
            }
        }
    }
}`,
                solution: `// Análise das complexidades:

// Algoritmo 1: O(1)
// Acessa diretamente o último elemento do array
// Operação constante, independente do tamanho

// Algoritmo 2: O(log n) 
// Busca binária clássica
// Divide o espaço de busca pela metade a cada iteração

// Algoritmo 3: O(log n)
// Loop que multiplica por 2 até chegar em n
// Equivale a log₂(n) iterações

// Algoritmo 4: O(n³)
// Três loops aninhados, cada um executando n vezes
// n × n × n = n³ operações`,
                explanation: 'Identificar complexidades requer analisar quantas vezes cada operação é executada em função do tamanho da entrada.'
              },
              {
                id: 'optimization-challenge',
                title: 'Desafio de Otimização',
                description: 'Otimize esta função de O(n³) para O(n²)',
                difficulty: 'hard',
                code: `// Função que encontra triplas que somam zero
// Complexidade atual: O(n³)
function encontrarTriplasZero(nums) {
    const resultado = [];
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] === 0) {
                    resultado.push([nums[i], nums[j], nums[k]]);
                }
            }
        }
    }
    
    return resultado;
}

// Otimize para O(n²)`,
                hint: 'Use ordenação + two pointers. Ordene o array primeiro, então para cada elemento, use dois ponteiros para encontrar o par que completa a soma.',
                solution: `// Versão otimizada O(n²)
function encontrarTriplasZeroOtimizada(nums) {
    const resultado = [];
    nums.sort((a, b) => a - b); // O(n log n)
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Pular duplicados
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) { // O(n) para cada i
            const soma = nums[i] + nums[left] + nums[right];
            
            if (soma === 0) {
                resultado.push([nums[i], nums[left], nums[right]]);
                
                // Pular duplicados
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (soma < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return resultado;
}

// Complexidade total: O(n log n) + O(n²) = O(n²)`,
                explanation: 'A otimização usa ordenação + técnica two pointers para reduzir de O(n³) para O(n²), eliminando o terceiro loop através de busca eficiente.'
              }
            ]
          }
        ]
      },
      {
        id: 'data-structures',
        title: 'Estruturas de Dados Fundamentais',
        description: 'Arrays, listas ligadas, pilhas, filas e suas implementações',
        icon: 'library-outline',
        estimatedHours: 45,
        lessons: [
          {
            id: 'arrays-vectors',
            title: 'Arrays e Vetores',
            description: 'Estruturas sequenciais, operações e otimizações',
            duration: '70 min',
            difficulty: 'intermediate',
            content: {
              theory: `Arrays (ou vetores) são a estrutura de dados mais fundamental, organizando elementos em sequência contígua na memória.

## Características dos Arrays:

### Vantagens:
- **Acesso O(1)**: Acesso direto por índice
- **Cache-friendly**: Elementos adjacentes na memória
- **Simplicidade**: Fácil de usar e entender
- **Eficiência de espaço**: Sem overhead de ponteiros

### Desvantagens:
- **Tamanho fixo**: Difícil redimensionar (em linguagens de baixo nível)
- **Inserção/Remoção custosa**: O(n) no início/meio
- **Fragmentação**: Pode desperdiçar memória

## Tipos de Arrays:

### 1. Arrays Estáticos
- Tamanho definido em tempo de compilação
- Alocados na stack ou segmento de dados
- Exemplos: C/C++, arrays em Java

### 2. Arrays Dinâmicos
- Tamanho pode mudar em runtime
- Realocação automática quando necessário
- Exemplos: JavaScript Arrays, Python lists, Java ArrayList

## Operações e Complexidades:

| Operação | Complexidade | Descrição |
|----------|--------------|-----------|
| Acesso por índice | O(1) | Cálculo direto do endereço |
| Busca linear | O(n) | Precisa verificar elementos |
| Busca binária* | O(log n) | *Array ordenado |
| Inserção no final | O(1)** | **Array dinâmico |
| Inserção início/meio | O(n) | Precisa deslocar elementos |
| Remoção no final | O(1) | Apenas ajusta tamanho |
| Remoção início/meio | O(n) | Precisa deslocar elementos |

## Padrões de Uso:

### Sliding Window
Para problemas envolvendo subsequências:
\`\`\`
[1,2,3,4,5] -> janela de tamanho 3: [1,2,3], [2,3,4], [3,4,5]
\`\`\`

### Two Pointers
Para problemas com pares ou comparações:
\`\`\`
left=0, right=n-1, move baseado na condição
\`\`\`

### Prefix Sum
Para consultas de soma de intervalos:
\`\`\`
prefixSum[i] = sum(arr[0...i])
\`\`\``,
              codeExamples: [
                {
                  title: 'Implementação de Array Dinâmico',
                  code: `class ArrayDinamico {
    constructor(capacidadeInicial = 4) {
        this.dados = new Array(capacidadeInicial);
        this.tamanho = 0;
        this.capacidade = capacidadeInicial;
    }
    
    // O(1) - Acesso por índice
    obter(indice) {
        if (indice < 0 || indice >= this.tamanho) {
            throw new Error('Índice fora dos limites');
        }
        return this.dados[indice];
    }
    
    // O(1) amortizado - Adicionar no final
    adicionar(elemento) {
        if (this.tamanho === this.capacidade) {
            this._redimensionar();
        }
        this.dados[this.tamanho] = elemento;
        this.tamanho++;
    }
    
    // O(n) - Inserir em posição específica
    inserir(indice, elemento) {
        if (indice < 0 || indice > this.tamanho) {
            throw new Error('Índice inválido');
        }
        
        if (this.tamanho === this.capacidade) {
            this._redimensionar();
        }
        
        // Deslocar elementos para a direita
        for (let i = this.tamanho; i > indice; i--) {
            this.dados[i] = this.dados[i - 1];
        }
        
        this.dados[indice] = elemento;
        this.tamanho++;
    }
    
    // O(n) - Remover elemento
    remover(indice) {
        if (indice < 0 || indice >= this.tamanho) {
            throw new Error('Índice fora dos limites');
        }
        
        const elemento = this.dados[indice];
        
        // Deslocar elementos para a esquerda
        for (let i = indice; i < this.tamanho - 1; i++) {
            this.dados[i] = this.dados[i + 1];
        }
        
        this.tamanho--;
        return elemento;
    }
    
    // O(n) - Busca linear
    buscar(elemento) {
        for (let i = 0; i < this.tamanho; i++) {
            if (this.dados[i] === elemento) {
                return i;
            }
        }
        return -1;
    }
    
    // O(n) - Redimensionar array
    _redimensionar() {
        const novaCapacidade = this.capacidade * 2;
        const novoArray = new Array(novaCapacidade);
        
        // Copiar elementos existentes
        for (let i = 0; i < this.tamanho; i++) {
            novoArray[i] = this.dados[i];
        }
        
        this.dados = novoArray;
        this.capacidade = novaCapacidade;
    }
    
    // Informações do array
    obterTamanho() { return this.tamanho; }
    estaVazio() { return this.tamanho === 0; }
    
    // Converter para string para debug
    toString() {
        return \`[\${this.dados.slice(0, this.tamanho).join(', ')}]\`;
    }
}

// Exemplo de uso
const arr = new ArrayDinamico();
arr.adicionar(1);
arr.adicionar(2);
arr.adicionar(3);
console.log(arr.toString()); // [1, 2, 3]

arr.inserir(1, 10);
console.log(arr.toString()); // [1, 10, 2, 3]

arr.remover(0);
console.log(arr.toString()); // [10, 2, 3]`,
                  explanation: 'Esta implementação mostra como arrays dinâmicos funcionam internamente, com redimensionamento automático e operações básicas.'
                },
                {
                  title: 'Algoritmos clássicos com arrays',
                  code: `// Sliding Window - Maior soma de subarray de tamanho k
function maiorSomaSubarray(arr, k) {
    if (arr.length < k) return null;
    
    // Calcular soma da primeira janela
    let somaAtual = 0;
    for (let i = 0; i < k; i++) {
        somaAtual += arr[i];
    }
    
    let maiorSoma = somaAtual;
    
    // Deslizar a janela
    for (let i = k; i < arr.length; i++) {
        somaAtual = somaAtual - arr[i - k] + arr[i];
        maiorSoma = Math.max(maiorSoma, somaAtual);
    }
    
    return maiorSoma;
}

// Two Pointers - Verificar se array tem par que soma target
function temParSoma(arr, target) {
    arr.sort((a, b) => a - b); // O(n log n)
    
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const soma = arr[left] + arr[right];
        
        if (soma === target) return true;
        else if (soma < target) left++;
        else right--;
    }
    
    return false;
}

// Prefix Sum - Soma de intervalo em O(1)
class PrefixSum {
    constructor(arr) {
        this.prefixSum = new Array(arr.length + 1).fill(0);
        
        // Construir array de soma prefixada O(n)
        for (let i = 0; i < arr.length; i++) {
            this.prefixSum[i + 1] = this.prefixSum[i] + arr[i];
        }
    }
    
    // O(1) - Soma do intervalo [left, right]
    somaIntervalo(left, right) {
        return this.prefixSum[right + 1] - this.prefixSum[left];
    }
}

// Exemplo de uso dos algoritmos
const numeros = [2, 1, 4, 3, 5, 7, 6];

console.log(maiorSomaSubarray(numeros, 3)); // 18 (5+7+6)
console.log(temParSoma(numeros, 8)); // true (1+7 ou 2+6)

const prefixSum = new PrefixSum(numeros);
console.log(prefixSum.somaIntervalo(2, 4)); // 12 (4+3+5)`,
                  explanation: 'Estes algoritmos mostram técnicas fundamentais para trabalhar eficientemente com arrays em problemas reais.'
                }
              ],
              keyPoints: [
                'Arrays oferecem acesso O(1) por índice, mas inserção/remoção pode ser O(n)',
                'Arrays dinâmicos redimensionam automaticamente, mas têm custo amortizado',
                'Sliding window é útil para problemas de subsequências contíguas',
                'Two pointers otimiza problemas de busca em arrays ordenados',
                'Prefix sum acelera consultas de soma de intervalos',
                'Arrays são cache-friendly devido à localidade espacial'
              ]
            },
            exercises: [
              {
                id: 'array-ex-1',
                title: 'Rotação de Array',
                description: 'Implemente rotação de array à direita por k posições em O(1) espaço extra',
                difficulty: 'medium',
                code: `function rotacionarArray(nums, k) {
    // Rotar array [1,2,3,4,5,6,7] por k=3
    // Resultado: [5,6,7,1,2,3,4]
    
    // Sua implementação aqui
    // Complexidade: O(n) tempo, O(1) espaço
}`,
                hint: 'Use o algoritmo de reversão: reverse(0, n-1), reverse(0, k-1), reverse(k, n-1)',
                solution: `function rotacionarArray(nums, k) {
    const n = nums.length;
    k = k % n; // Lidar com k > n
    
    // Reverter array inteiro
    reverter(nums, 0, n - 1);
    
    // Reverter primeiros k elementos
    reverter(nums, 0, k - 1);
    
    // Reverter elementos restantes
    reverter(nums, k, n - 1);
    
    return nums;
}

function reverter(arr, start, end) {
    while (start < end) {
        [arr[start], arr[end]] = [arr[end], arr[start]];
        start++;
        end--;
    }
}

// Exemplo de uso:
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(rotacionarArray(arr, 3)); // [5, 6, 7, 1, 2, 3, 4]

// Como funciona:
// Original: [1,2,3,4,5,6,7]
// Reverter tudo: [7,6,5,4,3,2,1]
// Reverter k primeiros: [5,6,7,4,3,2,1]
// Reverter restantes: [5,6,7,1,2,3,4]`,
                explanation: 'O algoritmo de reversão tripla é uma técnica elegante que usa O(1) espaço extra e funciona invertendo partes específicas do array.'
              }
            ]
          }
        ]
      },
      {
        id: 'advanced-structures',
        title: 'Estruturas de Dados Avançadas',
        description: 'Árvores, grafos, hash tables e estruturas especializadas',
        icon: 'git-network-outline',
        estimatedHours: 60,
        lessons: [
          {
            id: 'trees',
            title: 'Árvores e Árvores Binárias',
            description: 'Estruturas hierárquicas e algoritmos de travessia',
            duration: '80 min',
            difficulty: 'advanced',
            content: {
              theory: `Árvores são estruturas hierárquicas fundamentais em ciência da computação, representando relações parent-child entre elementos.

## Terminologia Básica:

- **Nó/Vértice**: Elemento da árvore
- **Raiz**: Nó superior da árvore
- **Folha**: Nó sem filhos
- **Pai**: Nó superior conectado
- **Filho**: Nó inferior conectado
- **Altura**: Máxima distância da raiz até folha
- **Profundidade**: Distância de um nó até a raiz
- **Nível**: Conjunto de nós na mesma profundidade

## Tipos de Árvores:

### 1. Árvore Binária
- Cada nó tem no máximo 2 filhos (esquerdo e direito)
- Base para muitas estruturas especializadas

### 2. Árvore Binária de Busca (BST)
- Para cada nó: filho esquerdo < nó < filho direito
- Busca, inserção e remoção O(log n) em árvores balanceadas
- Pode degenerar para O(n) se não balanceada

### 3. Árvore AVL
- BST auto-balanceada
- Fator de balanceamento: altura(esquerda) - altura(direita) ∈ {-1, 0, 1}
- Garantia de O(log n) para todas as operações

### 4. Árvore Red-Black
- BST auto-balanceada com propriedades de cor
- Usada em implementações de Map/Set

## Algoritmos de Travessia:

### Depth-First Search (DFS):
1. **Pre-order**: Raiz → Esquerda → Direita
2. **In-order**: Esquerda → Raiz → Direita (BST = ordem crescente)
3. **Post-order**: Esquerda → Direita → Raiz

### Breadth-First Search (BFS):
- **Level-order**: Nível por nível, da esquerda para direita

## Complexidades das Operações:

| Estrutura | Busca | Inserção | Remoção | Espaço |
|-----------|-------|----------|---------|--------|
| Array ordenado | O(log n) | O(n) | O(n) | O(n) |
| Lista ligada | O(n) | O(1) | O(1)* | O(n) |
| BST balanceada | O(log n) | O(log n) | O(log n) | O(n) |
| BST degenerada | O(n) | O(n) | O(n) | O(n) |

*Com referência do nó`,
              codeExamples: [
                {
                  title: 'Implementação completa de BST',
                  code: `class NoArvore {
    constructor(valor) {
        this.valor = valor;
        this.esquerda = null;
        this.direita = null;
    }
}

class ArvoreBinariaBusca {
    constructor() {
        this.raiz = null;
    }
    
    // O(log n) - Inserir valor
    inserir(valor) {
        this.raiz = this._inserirRec(this.raiz, valor);
    }
    
    _inserirRec(no, valor) {
        // Caso base: posição encontrada
        if (no === null) {
            return new NoArvore(valor);
        }
        
        // Recursão baseada em comparação
        if (valor < no.valor) {
            no.esquerda = this._inserirRec(no.esquerda, valor);
        } else if (valor > no.valor) {
            no.direita = this._inserirRec(no.direita, valor);
        }
        
        return no; // Valor já existe, não insere
    }
    
    // O(log n) - Buscar valor
    buscar(valor) {
        return this._buscarRec(this.raiz, valor);
    }
    
    _buscarRec(no, valor) {
        // Não encontrado
        if (no === null) return false;
        
        // Encontrado
        if (valor === no.valor) return true;
        
        // Busca recursiva
        if (valor < no.valor) {
            return this._buscarRec(no.esquerda, valor);
        } else {
            return this._buscarRec(no.direita, valor);
        }
    }
    
    // O(log n) - Remover valor
    remover(valor) {
        this.raiz = this._removerRec(this.raiz, valor);
    }
    
    _removerRec(no, valor) {
        if (no === null) return null;
        
        if (valor < no.valor) {
            no.esquerda = this._removerRec(no.esquerda, valor);
        } else if (valor > no.valor) {
            no.direita = this._removerRec(no.direita, valor);
        } else {
            // Nó a ser removido encontrado
            
            // Caso 1: Nó folha (sem filhos)
            if (no.esquerda === null && no.direita === null) {
                return null;
            }
            
            // Caso 2: Nó com um filho
            if (no.esquerda === null) return no.direita;
            if (no.direita === null) return no.esquerda;
            
            // Caso 3: Nó com dois filhos
            // Encontrar sucessor inorder (menor valor da subárvore direita)
            const sucessor = this._encontrarMinimo(no.direita);
            no.valor = sucessor.valor;
            no.direita = this._removerRec(no.direita, sucessor.valor);
        }
        
        return no;
    }
    
    _encontrarMinimo(no) {
        while (no.esquerda !== null) {
            no = no.esquerda;
        }
        return no;
    }
    
    // Travessias DFS
    preOrder() {
        const resultado = [];
        this._preOrderRec(this.raiz, resultado);
        return resultado;
    }
    
    _preOrderRec(no, resultado) {
        if (no !== null) {
            resultado.push(no.valor);              // Raiz
            this._preOrderRec(no.esquerda, resultado);   // Esquerda
            this._preOrderRec(no.direita, resultado);    // Direita
        }
    }
    
    inOrder() {
        const resultado = [];
        this._inOrderRec(this.raiz, resultado);
        return resultado;
    }
    
    _inOrderRec(no, resultado) {
        if (no !== null) {
            this._inOrderRec(no.esquerda, resultado);    // Esquerda
            resultado.push(no.valor);                    // Raiz
            this._inOrderRec(no.direita, resultado);     // Direita
        }
    }
    
    postOrder() {
        const resultado = [];
        this._postOrderRec(this.raiz, resultado);
        return resultado;
    }
    
    _postOrderRec(no, resultado) {
        if (no !== null) {
            this._postOrderRec(no.esquerda, resultado);  // Esquerda
            this._postOrderRec(no.direita, resultado);   // Direita
            resultado.push(no.valor);                    // Raiz
        }
    }
    
    // Travessia BFS
    levelOrder() {
        if (this.raiz === null) return [];
        
        const resultado = [];
        const fila = [this.raiz];
        
        while (fila.length > 0) {
            const no = fila.shift();
            resultado.push(no.valor);
            
            if (no.esquerda) fila.push(no.esquerda);
            if (no.direita) fila.push(no.direita);
        }
        
        return resultado;
    }
    
    // Propriedades da árvore
    altura() {
        return this._alturaRec(this.raiz);
    }
    
    _alturaRec(no) {
        if (no === null) return -1;
        
        const alturaEsq = this._alturaRec(no.esquerda);
        const alturaDir = this._alturaRec(no.direita);
        
        return Math.max(alturaEsq, alturaDir) + 1;
    }
    
    // Validar se é uma BST válida
    ehBSTValida() {
        return this._validarBST(this.raiz, null, null);
    }
    
    _validarBST(no, minimo, maximo) {
        if (no === null) return true;
        
        if ((minimo !== null && no.valor <= minimo) ||
            (maximo !== null && no.valor >= maximo)) {
            return false;
        }
        
        return this._validarBST(no.esquerda, minimo, no.valor) &&
               this._validarBST(no.direita, no.valor, maximo);
    }
}

// Exemplo de uso
const bst = new ArvoreBinariaBusca();

// Inserindo valores
[50, 30, 70, 20, 40, 60, 80].forEach(valor => bst.inserir(valor));

console.log('In-order (crescente):', bst.inOrder());     // [20, 30, 40, 50, 60, 70, 80]
console.log('Pre-order:', bst.preOrder());               // [50, 30, 20, 40, 70, 60, 80]  
console.log('Post-order:', bst.postOrder());             // [20, 40, 30, 60, 80, 70, 50]
console.log('Level-order:', bst.levelOrder());           // [50, 30, 70, 20, 40, 60, 80]

console.log('Buscar 40:', bst.buscar(40));               // true
console.log('Altura:', bst.altura());                    // 2
console.log('É BST válida:', bst.ehBSTValida());         // true

bst.remover(30);
console.log('Após remover 30:', bst.inOrder());          // [20, 40, 50, 60, 70, 80]`,
                  explanation: 'Esta implementação completa de BST inclui todas as operações fundamentais e algoritmos de travessia, mostrando como árvores funcionam na prática.'
                }
              ],
              keyPoints: [
                'BST permite busca, inserção e remoção em O(log n) quando balanceada',
                'In-order traversal em BST produz sequência ordenada',
                'Árvores degeneradas (como lista ligada) têm O(n) para operações',
                'Auto-balanceamento (AVL, Red-Black) garante performance',
                'DFS usa recursão/stack, BFS usa fila',
                'Árvores são ideais para dados hierárquicos'
              ]
            },
            exercises: [
              {
                id: 'tree-ex-1',
                title: 'Verificar Árvore Simétrica',
                description: 'Determine se uma árvore binária é simétrica (espelho de si mesma)',
                difficulty: 'medium',
                code: `// Verificar se a árvore é simétrica
function ehSimetrica(raiz) {
    // Exemplo de árvore simétrica:
    //       1
    //      / \\
    //     2   2
    //    / \\ / \\
    //   3  4 4  3
    
    // Sua implementação aqui
}`,
                hint: 'Compare recursivamente os filhos esquerdo e direito, verificando se são espelhos um do outro.',
                solution: `function ehSimetrica(raiz) {
    if (raiz === null) return true;
    
    return ehEspelho(raiz.esquerda, raiz.direita);
}

function ehEspelho(esq, dir) {
    // Ambos são null - simétrico
    if (esq === null && dir === null) return true;
    
    // Um é null, outro não - não simétrico
    if (esq === null || dir === null) return false;
    
    // Valores diferentes - não simétrico
    if (esq.valor !== dir.valor) return false;
    
    // Verificar recursivamente:
    // esquerda de esq com direita de dir
    // direita de esq com esquerda de dir
    return ehEspelho(esq.esquerda, dir.direita) && 
           ehEspelho(esq.direita, dir.esquerda);
}

// Versão iterativa usando fila
function ehSimetricaIterativa(raiz) {
    if (raiz === null) return true;
    
    const fila = [raiz.esquerda, raiz.direita];
    
    while (fila.length > 0) {
        const esq = fila.shift();
        const dir = fila.shift();
        
        if (esq === null && dir === null) continue;
        if (esq === null || dir === null) return false;
        if (esq.valor !== dir.valor) return false;
        
        fila.push(esq.esquerda, dir.direita);
        fila.push(esq.direita, dir.esquerda);
    }
    
    return true;
}`,
                explanation: 'A simetria requer que subárvores esquerda e direita sejam espelhos, comparando de forma cruzada (esquerda com direita).'
              }
            ]
          }
        ]
      },
      {
        id: 'algorithm-techniques',
        title: 'Técnicas Avançadas de Algoritmos',
        description: 'Recursão, programação dinâmica, dividir e conquistar',
        icon: 'compass-outline',
        estimatedHours: 55,
        lessons: [
          {
            id: 'recursion',
            title: 'Recursão e Programação Dinâmica',
            description: 'Master recursion, memoization e DP patterns',
            duration: '90 min',
            difficulty: 'advanced',
            content: {
              theory: `Recursão é uma técnica fundamental onde uma função chama a si mesma para resolver subproblemas menores.

## Anatomia da Recursão:

### 1. Caso Base
- Condição que para a recursão
- Sem caso base = loop infinito
- Deve ser alcançável

### 2. Caso Recursivo
- Função chama a si mesma
- Com input menor/modificado
- Deve progredir em direção ao caso base

### 3. Estado/Parâmetros
- Informação passada entre chamadas
- Define o subproblema atual

## Tipos de Recursão:

### Linear Recursion
Uma chamada recursiva por execução:
\`fibonacci(n-1) + fibonacci(n-2)\` (mas tem 2 chamadas!)

### Tree Recursion
Múltiplas chamadas recursivas:
\`fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)\`

### Tail Recursion
Chamada recursiva é a última operação:
\`factorial(n, acc) = factorial(n-1, n*acc)\`

## Problemas com Recursão Ingênua:

### 1. Stack Overflow
- Muitas chamadas na call stack
- Limitada pelo sistema (~1000-10000 calls)

### 2. Sobreposição de Subproblemas
- Mesmo cálculo repetido múltiplas vezes
- fibonacci(n) recalcula fibonacci(n-2) exponencialmente

### 3. Complexidade Exponencial
- O(2^n) ou pior
- Impraticável para inputs grandes

## Soluções: Memoização e DP

### Memoização (Top-Down)
- Cache resultados de subproblemas
- Recursão + memória = eficiência
- Transforma O(2^n) em O(n)

### Programação Dinâmica (Bottom-Up)
- Resolve subproblemas menores primeiro
- Constrói solução iterativamente
- Evita recursão e overhead de stack

## Quando Usar Cada Abordagem:

### Recursão Simples:
- Problemas naturalmente recursivos
- Input pequeno
- Legibilidade importante

### Memoização:
- Sobreposição de subproblemas
- Estrutura recursiva natural
- Fácil conversão da recursão ingênua

### DP Iterativa:
- Preocupações com stack overflow
- Otimização de espaço necessária
- Performance crítica

## Padrões Comuns de DP:

1. **Linear DP**: dp[i] depende de dp[i-1], dp[i-2], etc.
2. **Grid DP**: Problemas em matriz 2D
3. **Interval DP**: Problemas em intervalos/subsequências
4. **Tree DP**: DP em estruturas de árvore
5. **Digit DP**: Problemas com restrições de dígitos`,
              codeExamples: [
                {
                  title: 'Evolução do Fibonacci: Ingênuo → Otimizado',
                  code: `// 1. Recursão Ingênua - O(2^n)
function fibonacciIngenuo(n) {
    console.log(\`Calculando fib(\${n})\`); // Veja quantas vezes é chamado!
    
    if (n <= 1) return n;
    return fibonacciIngenuo(n - 1) + fibonacciIngenuo(n - 2);
}

// 2. Recursão com Memoização - O(n)
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    
    if (n <= 1) return n;
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// 3. Programação Dinâmica Iterativa - O(n) tempo, O(n) espaço
function fibonacciDP(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 4. DP Otimizada - O(n) tempo, O(1) espaço
function fibonacciOtimizado(n) {
    if (n <= 1) return n;
    
    let prev2 = 0;
    let prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const atual = prev1 + prev2;
        prev2 = prev1;
        prev1 = atual;
    }
    
    return prev1;
}

// Comparação de performance
function compararFibonacci(n) {
    console.log(\`Fibonacci(\${n}):\`);
    
    // Só teste valores pequenos para fibonacci ingênuo!
    if (n <= 35) {
        console.time('Ingênuo');
        const resultado1 = fibonacciIngenuo(n);
        console.timeEnd('Ingênuo');
        console.log(\`Resultado: \${resultado1}\`);
    }
    
    console.time('Memoização');
    const resultado2 = fibonacciMemo(n);
    console.timeEnd('Memoização');
    console.log(\`Resultado: \${resultado2}\`);
    
    console.time('DP');
    const resultado3 = fibonacciDP(n);
    console.timeEnd('DP');
    console.log(\`Resultado: \${resultado3}\`);
    
    console.time('Otimizado');
    const resultado4 = fibonacciOtimizado(n);
    console.timeEnd('Otimizado');
    console.log(\`Resultado: \${resultado4}\`);
}

// Teste com diferentes valores
compararFibonacci(10);   // Todos funcionam
compararFibonacci(40);   // Ingênuo será bem lento!
compararFibonacci(100);  // Ingênuo impossível`,
                  explanation: 'Esta progressão mostra como otimizar algoritmos recursivos, desde O(2^n) até O(n) com espaço O(1).'
                },
                {
                  title: 'Problemas Clássicos de DP',
                  code: `// Problema 1: Longest Common Subsequence (LCS)
function lcs(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // dp[i][j] = LCS de str1[0...i-1] e str2[0...j-1]
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// Problema 2: 0/1 Knapsack
function knapsack(pesos, valores, capacidade) {
    const n = pesos.length;
    
    // dp[i][w] = valor máximo com primeiros i itens e capacidade w
    const dp = Array(n + 1).fill(null).map(() => Array(capacidade + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacidade; w++) {
            // Opção 1: Não pegar o item i
            dp[i][w] = dp[i - 1][w];
            
            // Opção 2: Pegar o item i (se couber)
            if (pesos[i - 1] <= w) {
                const valorComItem = valores[i - 1] + dp[i - 1][w - pesos[i - 1]];
                dp[i][w] = Math.max(dp[i][w], valorComItem);
            }
        }
    }
    
    return dp[n][capacidade];
}

// Problema 3: Coin Change (número mínimo de moedas)
function coinChange(moedas, valor) {
    const dp = new Array(valor + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= valor; i++) {
        for (const moeda of moedas) {
            if (moeda <= i) {
                dp[i] = Math.min(dp[i], dp[i - moeda] + 1);
            }
        }
    }
    
    return dp[valor] === Infinity ? -1 : dp[valor];
}

// Problema 4: Edit Distance (Levenshtein)
function editDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Casos base
    for (let i = 0; i <= m; i++) dp[i][0] = i; // Deletar todos
    for (let j = 0; j <= n; j++) dp[0][j] = j; // Inserir todos
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]; // Sem operação
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // Deletar
                    dp[i][j - 1] + 1,     // Inserir
                    dp[i - 1][j - 1] + 1  // Substituir
                );
            }
        }
    }
    
    return dp[m][n];
}

// Exemplos de uso
console.log('LCS("ABCDGH", "AEDFHR"):', lcs("ABCDGH", "AEDFHR")); // 3 ("ADH")
console.log('Knapsack([1,3,4,5], [1,4,5,7], 7):', knapsack([1,3,4,5], [1,4,5,7], 7)); // 9
console.log('Coin Change([1,3,4], 6):', coinChange([1,3,4], 6)); // 2 (3+3)
console.log('Edit Distance("horse", "ros"):', editDistance("horse", "ros")); // 3`,
                  explanation: 'Estes são problemas clássicos que ilustram diferentes padrões de programação dinâmica, cada um com sua técnica específica.'
                }
              ],
              keyPoints: [
                'Recursão requer caso base e progresso em direção a ele',
                'Memoização transforma O(2^n) em O(n) para problemas com sobreposição',
                'DP bottom-up evita recursão e pode ser otimizada em espaço',
                'Identifique a relação de recorrência antes de implementar',
                'Estados de DP devem capturar toda informação necessária',
                'Muitos problemas de otimização podem ser resolvidos com DP'
              ]
            },
            exercises: [
              {
                id: 'dp-ex-1',
                title: 'House Robber DP',
                description: 'Você é um ladrão. Casas estão em linha, não pode roubar adjacentes. Maximize o valor roubado.',
                difficulty: 'medium',
                code: `// Casas: [2,7,9,3,1]
// Resposta: 12 (casa 0 + casa 2 + casa 4: 2+9+1)
function rob(nums) {
    // Sua implementação aqui
    // DP: dp[i] = máximo valor até a casa i
}`,
                hint: 'Para cada casa, escolha entre roubar ela + dp[i-2] ou não roubar (dp[i-1])',
                solution: `function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    const dp = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        // Escolha: roubar casa atual + melhor até i-2, ou não roubar (i-1)
        dp[i] = Math.max(nums[i] + dp[i - 2], dp[i - 1]);
    }
    
    return dp[nums.length - 1];
}

// Versão otimizada O(1) espaço
function robOtimizado(nums) {
    if (nums.length === 0) return 0;
    
    let prev2 = 0; // dp[i-2]
    let prev1 = 0; // dp[i-1]
    
    for (const num of nums) {
        const atual = Math.max(num + prev2, prev1);
        prev2 = prev1;
        prev1 = atual;
    }
    
    return prev1;
}

// Teste
console.log(rob([2,7,9,3,1])); // 12
console.log(rob([2,1,1,2]));   // 4`,
                explanation: 'Este é um problema clássico de DP onde cada decisão afeta as próximas escolhas possíveis.'
              }
            ]
          }
        ]
      }
    ],
    documentation: {
      overview: `Este track aborda análise de algoritmos, estruturas de dados e técnicas avançadas de programação, fundamentais para qualquer desenvolvedor que deseja escrever código eficiente e escalável.

## Objetivos do Track:

1. **Análise de Complexidade**: Dominar Big O e analisar eficiência de algoritmos
2. **Estruturas de Dados**: Implementar e usar estruturas fundamentais e avançadas  
3. **Técnicas Algorítmicas**: Master recursão, DP, dividir e conquistar
4. **Resolução de Problemas**: Aplicar conhecimento em problemas reais

## Por que Este Track é Importante:

- **Entrevistas Técnicas**: Conteúdo essencial para big tech
- **Performance**: Escrever código que escala
- **Arquitetura**: Tomar decisões fundamentadas sobre estruturas
- **Pensamento Analítico**: Desenvolver raciocínio algorítmico`,
      syntax: [
        {
          category: 'Análise de Complexidade',
          items: [
            {
              name: 'Big O Notation',
              syntax: 'O(f(n)) onde f(n) é função do tamanho da entrada',
              description: 'Descreve limite superior do crescimento do algoritmo',
              example: 'O(n²) para loops aninhados, O(log n) para busca binária'
            },
            {
              name: 'Complexidade de Espaço',
              syntax: 'Espaço extra usado além da entrada',
              description: 'Memória adicional necessária pelo algoritmo',
              example: 'Recursão usa O(n) espaço na call stack'
            }
          ]
        },
        {
          category: 'Estruturas de Dados',
          items: [
            {
              name: 'Array',
              syntax: 'arr[index] para acesso O(1)',
              description: 'Estrutura sequencial com acesso direto',
              example: 'let arr = [1,2,3]; console.log(arr[0]); // O(1)'
            },
            {
              name: 'Binary Search Tree',
              syntax: 'left < root < right',
              description: 'Árvore ordenada para busca eficiente',
              example: 'Busca, inserção, remoção em O(log n) se balanceada'
            }
          ]
        },
        {
          category: 'Técnicas Algorítmicas',
          items: [
            {
              name: 'Recursão',
              syntax: 'function solve(n) { if(base) return; return solve(n-1); }',
              description: 'Função que chama a si mesma',
              example: 'Fibonacci, traversal de árvores, backtracking'
            },
            {
              name: 'Dynamic Programming',
              syntax: 'dp[i] = f(dp[i-1], dp[i-2], ...)',
              description: 'Otimização usando subproblemas',
              example: 'Fibonacci: dp[i] = dp[i-1] + dp[i-2]'
            }
          ]
        }
      ],
      bestPractices: [
        'Sempre analise complexidade antes de implementar',
        'Use estruturas de dados apropriadas para cada problema',
        'Prefira algoritmos O(n log n) a O(n²) quando possível',
        'Implemente memoização para recursões com sobreposição',
        'Considere trade-offs entre tempo e espaço',
        'Teste com casos extremos (arrays vazios, valores únicos)',
        'Documente complexidade nas funções importantes'
      ],
      commonPitfalls: [
        'Ignorar casos base em recursão → stack overflow',
        'Não considerar complexidade de espaço → memory issues',
        'Usar O(n²) quando O(n) é possível → performance ruim',
        'Não balancear árvores → degeneração para O(n)',
        'Recursão sem memoização → complexidade exponencial',
        'Assumir que "funciona" significa "eficiente"',
        'Não testar com datasets grandes'
      ],
      resources: [
        {
          title: 'Introduction to Algorithms (CLRS)',
          url: 'https://mitpress.mit.edu/books/introduction-algorithms',
          type: 'book'
        },
        {
          title: 'LeetCode Algorithm Problems',
          url: 'https://leetcode.com/problemset/algorithms/',
          type: 'tutorial'
        },
        {
          title: 'Visualizing Data Structures and Algorithms',
          url: 'https://visualgo.net/',
          type: 'tutorial'
        },
        {
          title: 'MIT 6.006 Introduction to Algorithms',
          url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/',
          type: 'video'
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