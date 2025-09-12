import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Exercise types and interfaces
interface ExerciseTemplate {
  id: string;
  type: 'complexity-analysis' | 'algorithm-implementation' | 'data-structure' | 'optimization';
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  codeTemplate?: string;
  expectedComplexity?: string;
  hints: string[];
  solution: string;
  explanation: string;
  testCases: TestCase[];
  tags: string[];
}

interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

interface UserSubmission {
  code: string;
  complexity: string;
  explanation: string;
  timestamp: number;
}

interface AIFeedback {
  score: number; // 0-100
  correctness: boolean;
  complexityCorrect: boolean;
  feedback: string[];
  suggestions: string[];
  nextLevel: 'easier' | 'similar' | 'harder';
}

// Exercise templates database
const exerciseTemplates: ExerciseTemplate[] = [
  {
    id: 'find-duplicates',
    type: 'optimization',
    title: 'Encontrar Elementos Duplicados',
    difficulty: 'easy',
    description: 'Dada um array de números, encontre todos os elementos que aparecem mais de uma vez.',
    codeTemplate: `function encontrarDuplicados(nums) {
  // Sua implementação aqui
  // Tente otimizar para O(n) tempo
  
  return duplicados;
}`,
    expectedComplexity: 'O(n)',
    hints: [
      'Use uma estrutura de dados para rastrear elementos visitados',
      'Set ou Map podem ajudar a conseguir O(n)',
      'Evite loops aninhados que resultam em O(n²)'
    ],
    solution: `function encontrarDuplicados(nums) {
  const vistos = new Set();
  const duplicados = new Set();
  
  for (const num of nums) {
    if (vistos.has(num)) {
      duplicados.add(num);
    } else {
      vistos.add(num);
    }
  }
  
  return Array.from(duplicados);
}`,
    explanation: 'A solução otimizada usa dois Sets: um para rastrear números já vistos e outro para duplicados. Como Set.has() e Set.add() são O(1), a complexidade total é O(n).',
    testCases: [
      {
        input: [1, 2, 3, 2, 1, 4],
        expectedOutput: [2, 1],
        description: 'Array com alguns duplicados'
      },
      {
        input: [1, 2, 3, 4, 5],
        expectedOutput: [],
        description: 'Array sem duplicados'
      },
      {
        input: [1, 1, 1, 1],
        expectedOutput: [1],
        description: 'Array com mesmo elemento repetido'
      }
    ],
    tags: ['arrays', 'hash-table', 'set']
  },
  {
    id: 'fibonacci-optimization',
    type: 'complexity-analysis',
    title: 'Fibonacci - Análise de Complexidade',
    difficulty: 'medium',
    description: 'Compare diferentes implementações de Fibonacci e analise suas complexidades.',
    codeTemplate: `// Implementação 1 - Recursiva simples
function fibRecursivo(n) {
  if (n <= 1) return n;
  return fibRecursivo(n - 1) + fibRecursivo(n - 2);
}

// Implementação 2 - Com memoização
function fibMemoizado(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibMemoizado(n - 1, memo) + fibMemoizado(n - 2, memo);
  return memo[n];
}

// Implementação 3 - Iterativa
function fibIterativo(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// Qual é a complexidade de cada implementação?`,
    expectedComplexity: 'O(2^n), O(n), O(n)',
    hints: [
      'Pense em quantas chamadas cada implementação faz',
      'Memoização evita recálculos desnecessários',
      'A versão iterativa não usa recursão'
    ],
    solution: `// Análise de complexidade:

// 1. fibRecursivo: O(2^n) tempo, O(n) espaço
// - Cada chamada gera 2 novas chamadas
// - Árvore de recursão tem altura n
// - Total: aproximadamente 2^n chamadas

// 2. fibMemoizado: O(n) tempo, O(n) espaço  
// - Cada valor é calculado apenas uma vez
// - Memo armazena n valores
// - Recursão tem profundidade n

// 3. fibIterativo: O(n) tempo, O(1) espaço
// - Loop executa n vezes
// - Usa apenas variáveis locais
// - Mais eficiente em espaço`,
    explanation: 'A recursão ingênua refaz os mesmos cálculos exponencialmente. Memoização resolve isso cachando resultados. A versão iterativa é mais eficiente em espaço.',
    testCases: [
      {
        input: 10,
        expectedOutput: 55,
        description: 'Fibonacci de 10'
      },
      {
        input: 0,
        expectedOutput: 0,
        description: 'Caso base: fib(0)'
      },
      {
        input: 1,
        expectedOutput: 1,
        description: 'Caso base: fib(1)'
      }
    ],
    tags: ['recursion', 'memoization', 'dynamic-programming']
  },
  {
    id: 'binary-search-tree',
    type: 'data-structure',
    title: 'Validar Árvore Binária de Busca',
    difficulty: 'hard',
    description: 'Determine se uma árvore binária é uma BST válida.',
    codeTemplate: `function ehBSTValida(raiz) {
  // Uma BST válida deve satisfazer:
  // - Para cada nó, todos os nós à esquerda são menores
  // - Todos os nós à direita são maiores
  // - Ambas as subárvores são BSTs válidas
  
  // Sua implementação aqui
  return true;
}`,
    expectedComplexity: 'O(n)',
    hints: [
      'Não basta comparar apenas com filhos diretos',
      'Use limites mínimo e máximo para cada nó',
      'Pense na recursão com parâmetros adicionais'
    ],
    solution: `function ehBSTValida(raiz) {
  return validar(raiz, null, null);
}

function validar(no, minimo, maximo) {
  // Árvore vazia é válida
  if (no === null) return true;
  
  // Verificar se o nó viola os limites
  if ((minimo !== null && no.val <= minimo) ||
      (maximo !== null && no.val >= maximo)) {
    return false;
  }
  
  // Recursivamente validar subárvores
  return validar(no.esquerda, minimo, no.val) &&
         validar(no.direita, no.val, maximo);
}`,
    explanation: 'A chave é usar limites mínimo e máximo que se propagam pela recursão. Cada nó deve estar dentro dos limites definidos por seus ancestrais.',
    testCases: [
      {
        input: { val: 2, esquerda: { val: 1 }, direita: { val: 3 } },
        expectedOutput: true,
        description: 'BST válida simples'
      },
      {
        input: { val: 5, esquerda: { val: 1 }, direita: { val: 4, esquerda: { val: 3 }, direita: { val: 6 } } },
        expectedOutput: false,
        description: 'BST inválida - 3 está na subárvore direita mas é menor que raiz'
      }
    ],
    tags: ['binary-tree', 'validation', 'recursion']
  }
];

// AI Exercise Analyzer
class AIExerciseAnalyzer {
  static analyzeSubmission(
    exercise: ExerciseTemplate,
    submission: UserSubmission
  ): AIFeedback {
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    let correctness = false;
    let complexityCorrect = false;

    // Analyze code structure
    const codeAnalysis = this.analyzeCode(submission.code, exercise);
    score += codeAnalysis.score;
    feedback.push(...codeAnalysis.feedback);
    suggestions.push(...codeAnalysis.suggestions);
    correctness = codeAnalysis.correct;

    // Analyze complexity
    const complexityAnalysis = this.analyzeComplexity(
      submission.complexity,
      exercise.expectedComplexity || 'O(n)'
    );
    score += complexityAnalysis.score;
    feedback.push(...complexityAnalysis.feedback);
    complexityCorrect = complexityAnalysis.correct;

    // Analyze explanation
    const explanationScore = this.analyzeExplanation(submission.explanation);
    score += explanationScore;

    // Determine next difficulty level
    const nextLevel = this.determineNextLevel(score, exercise.difficulty);

    return {
      score: Math.min(100, score),
      correctness,
      complexityCorrect,
      feedback,
      suggestions,
      nextLevel,
    };
  }

  private static analyzeCode(code: string, exercise: ExerciseTemplate) {
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    let correct = false;

    // Basic code analysis
    if (!code.trim()) {
      feedback.push('❌ Código não fornecido');
      return { score: 0, feedback, suggestions, correct: false };
    }

    // Check for common patterns based on exercise type
    if (exercise.type === 'optimization') {
      if (code.includes('Set') || code.includes('Map')) {
        score += 30;
        feedback.push('✅ Boa escolha usando estruturas de dados eficientes');
      }
      
      if (code.includes('for') && !code.includes('for (let i') || code.includes('for (const')) {
        score += 20;
        feedback.push('✅ Uso eficiente de loops');
      }
      
      if (this.countNestedLoops(code) > 1) {
        feedback.push('⚠️ Loops aninhados podem indicar complexidade O(n²) ou maior');
        suggestions.push('Considere usar estruturas como Set ou Map para reduzir complexidade');
      } else {
        score += 25;
      }
    }

    if (exercise.type === 'data-structure') {
      if (code.includes('null') && code.includes('recursion')) {
        score += 25;
        feedback.push('✅ Tratamento adequado de casos base');
      }
    }

    // Check for good practices
    if (code.includes('//') || code.includes('/*')) {
      score += 10;
      feedback.push('✅ Código bem comentado');
    }

    if (this.hasDescriptiveVariableNames(code)) {
      score += 10;
      feedback.push('✅ Nomes de variáveis descritivos');
    }

    // Simulate correctness check (in real implementation, would run tests)
    correct = score >= 50;
    if (correct) {
      feedback.push('✅ Implementação parece correta');
    } else {
      feedback.push('❌ Implementação pode ter problemas');
      suggestions.push('Revise a lógica e teste com os casos fornecidos');
    }

    return { score, feedback, suggestions, correct };
  }

  private static analyzeComplexity(provided: string, expected: string) {
    const feedback: string[] = [];
    let score = 0;
    let correct = false;

    if (!provided.trim()) {
      feedback.push('❌ Análise de complexidade não fornecida');
      return { score: 0, feedback, correct: false };
    }

    // Normalize complexity strings
    const normalizeComplexity = (comp: string) => 
      comp.toLowerCase().replace(/\s/g, '').replace(/o\(/g, 'o(');

    const normalizedProvided = normalizeComplexity(provided);
    const normalizedExpected = normalizeComplexity(expected);

    if (normalizedProvided.includes(normalizedExpected)) {
      score = 40;
      correct = true;
      feedback.push('✅ Complexidade correta!');
    } else {
      feedback.push(`❌ Complexidade incorreta. Esperado: ${expected}`);
      
      // Give hints based on common mistakes
      if (normalizedProvided.includes('o(n²)') && normalizedExpected.includes('o(n)')) {
        feedback.push('💡 Você pode otimizar usando estruturas de dados mais eficientes');
      } else if (normalizedProvided.includes('o(n)') && normalizedExpected.includes('o(logn)')) {
        feedback.push('💡 Considere algoritmos que dividem o problema pela metade');
      }
    }

    return { score, feedback, correct };
  }

  private static analyzeExplanation(explanation: string): number {
    if (!explanation.trim()) return 0;
    
    let score = 0;
    if (explanation.length > 50) score += 10; // Minimum effort
    if (explanation.includes('porque') || explanation.includes('pois')) score += 5; // Shows reasoning
    if (explanation.includes('O(') || explanation.includes('complexidade')) score += 5; // Technical terms
    
    return Math.min(20, score);
  }

  private static determineNextLevel(score: number, currentDifficulty: string): 'easier' | 'similar' | 'harder' {
    if (score >= 80) {
      return currentDifficulty === 'hard' ? 'similar' : 'harder';
    } else if (score >= 60) {
      return 'similar';
    } else {
      return currentDifficulty === 'easy' ? 'similar' : 'easier';
    }
  }

  private static countNestedLoops(code: string): number {
    const lines = code.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;

    for (const line of lines) {
      if (line.includes('for') || line.includes('while')) {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      if (line.includes('}')) {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }

    return maxNesting;
  }

  private static hasDescriptiveVariableNames(code: string): boolean {
    // Simple heuristic: check for variables longer than 3 chars
    const variables = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]+\b/g) || [];
    const descriptiveVars = variables.filter(v => 
      v.length > 3 && 
      !['function', 'return', 'const', 'length'].includes(v)
    );
    return descriptiveVars.length > 0;
  }
}

// Main AI Exercise Generator Component
interface AIExerciseGeneratorProps {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onSubmissionComplete: (feedback: AIFeedback) => void;
}

export default function AIExerciseGenerator({ 
  userLevel, 
  onSubmissionComplete 
}: AIExerciseGeneratorProps) {
  const [currentExercise, setCurrentExercise] = useState<ExerciseTemplate | null>(null);
  const [userCode, setUserCode] = useState('');
  const [userComplexity, setUserComplexity] = useState('');
  const [userExplanation, setUserExplanation] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<number>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    generateNewExercise();
  }, [userLevel]);

  const generateNewExercise = () => {
    // Filter exercises based on user level
    const levelMapping = {
      beginner: ['easy'],
      intermediate: ['easy', 'medium'],
      advanced: ['medium', 'hard'],
    };

    const allowedDifficulties = levelMapping[userLevel];
    const filteredExercises = exerciseTemplates.filter(ex =>
      allowedDifficulties.includes(ex.difficulty)
    );

    // Select random exercise
    const randomIndex = Math.floor(Math.random() * filteredExercises.length);
    const exercise = filteredExercises[randomIndex];
    
    setCurrentExercise(exercise);
    setUserCode(exercise.codeTemplate || '');
    setUserComplexity('');
    setUserExplanation('');
    setShowHints(false);
    setUsedHints(new Set());
    setFeedback(null);
    setShowSolution(false);
  };

  const handleSubmission = async () => {
    if (!currentExercise) return;

    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const submission: UserSubmission = {
      code: userCode,
      complexity: userComplexity,
      explanation: userExplanation,
      timestamp: Date.now(),
    };

    const aiFeedback = AIExerciseAnalyzer.analyzeSubmission(currentExercise, submission);
    
    setFeedback(aiFeedback);
    setIsAnalyzing(false);
    onSubmissionComplete(aiFeedback);
  };

  const useHint = (hintIndex: number) => {
    setUsedHints(prev => new Set([...prev, hintIndex]));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!currentExercise) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Gerando exercício...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Exercise Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{currentExercise.title}</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(currentExercise.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>
              {currentExercise.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>{currentExercise.description}</Text>
        
        <View style={styles.tagsContainer}>
          {currentExercise.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Code Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💻 Sua Implementação</Text>
        <TextInput
          style={styles.codeInput}
          value={userCode}
          onChangeText={setUserCode}
          placeholder="Digite seu código aqui..."
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Complexity Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ Análise de Complexidade</Text>
        <TextInput
          style={styles.textInput}
          value={userComplexity}
          onChangeText={setUserComplexity}
          placeholder="Ex: O(n), O(log n), O(n²)..."
        />
      </View>

      {/* Explanation Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💭 Explique seu Raciocínio</Text>
        <TextInput
          style={styles.explanationInput}
          value={userExplanation}
          onChangeText={setUserExplanation}
          placeholder="Explique como sua solução funciona e por que escolheu essa abordagem..."
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Hints Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.hintsHeader}
          onPress={() => setShowHints(!showHints)}
        >
          <Text style={styles.sectionTitle}>💡 Dicas</Text>
          <Ionicons 
            name={showHints ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {showHints && (
          <View style={styles.hintsContainer}>
            {currentExercise.hints.map((hint, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.hint,
                  usedHints.has(index) && styles.usedHint
                ]}
                onPress={() => useHint(index)}
                disabled={usedHints.has(index)}
              >
                <Text style={[
                  styles.hintText,
                  usedHints.has(index) && styles.usedHintText
                ]}>
                  {usedHints.has(index) ? hint : `Dica ${index + 1} - Toque para revelar`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isAnalyzing && styles.submitButtonDisabled]}
        onPress={handleSubmission}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Solução</Text>
        )}
      </TouchableOpacity>

      {/* AI Feedback */}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>🤖 Feedback da IA</Text>
          
          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Pontuação: {feedback.score}/100</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[styles.scoreFill, { width: `${feedback.score}%` }]}
              />
            </View>
          </View>

          {/* Feedback Items */}
          {feedback.feedback.map((item, index) => (
            <Text key={index} style={styles.feedbackItem}>{item}</Text>
          ))}

          {/* Suggestions */}
          {feedback.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>📝 Sugestões:</Text>
              {feedback.suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
              ))}
            </View>
          )}

          {/* Show Solution Button */}
          <TouchableOpacity
            style={styles.solutionButton}
            onPress={() => setShowSolution(!showSolution)}
          >
            <Text style={styles.solutionButtonText}>
              {showSolution ? 'Ocultar' : 'Ver'} Solução
            </Text>
          </TouchableOpacity>

          {showSolution && (
            <View style={styles.solutionContainer}>
              <Text style={styles.solutionCode}>{currentExercise.solution}</Text>
              <Text style={styles.solutionExplanation}>
                {currentExercise.explanation}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Next Exercise Button */}
      <TouchableOpacity style={styles.nextButton} onPress={generateNewExercise}>
        <Text style={styles.nextButtonText}>Próximo Exercício</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  codeInput: {
    height: 200,
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  explanationInput: {
    height: 100,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  hintsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  hintsContainer: {
    marginTop: 12,
  },
  hint: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  usedHint: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  hintText: {
    fontSize: 14,
    color: '#6b7280',
  },
  usedHintText: {
    color: '#1e40af',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  feedbackItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 4,
  },
  solutionButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  solutionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  solutionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  solutionCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 18,
  },
  solutionExplanation: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#10b981',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});