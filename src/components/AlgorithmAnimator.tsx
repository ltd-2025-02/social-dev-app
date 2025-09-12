import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface AnimationStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  description: string;
  highlightRange?: [number, number];
}

interface AlgorithmConfig {
  name: string;
  complexity: string;
  description: string;
  steps: (arr: number[]) => AnimationStep[];
}

const algorithms: Record<string, AlgorithmConfig> = {
  bubbleSort: {
    name: 'Bubble Sort',
    complexity: 'O(n²)',
    description: 'Compara elementos adjacentes e os troca se estiverem fora de ordem',
    steps: (arr: number[]): AnimationStep[] => {
      const steps: AnimationStep[] = [];
      const array = [...arr];
      const n = array.length;
      
      steps.push({
        array: [...array],
        description: 'Array inicial - Bubble Sort começando'
      });

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          // Comparando elementos
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            description: `Comparando ${array[j]} e ${array[j + 1]}`
          });

          if (array[j] > array[j + 1]) {
            // Trocando elementos
            steps.push({
              array: [...array],
              swapping: [j, j + 1],
              description: `${array[j]} > ${array[j + 1]}, trocando posições`
            });

            [array[j], array[j + 1]] = [array[j + 1], array[j]];

            steps.push({
              array: [...array],
              description: `Elementos trocados: ${array[j]} e ${array[j + 1]}`
            });
          }
        }
        
        // Elemento na posição correta
        steps.push({
          array: [...array],
          sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
          description: `${array[n - 1 - i]} está na posição correta`
        });
      }

      steps.push({
        array: [...array],
        sorted: Array.from({ length: n }, (_, i) => i),
        description: 'Array completamente ordenado!'
      });

      return steps;
    }
  },
  quickSort: {
    name: 'Quick Sort',
    complexity: 'O(n log n)',
    description: 'Divide o array usando um pivot e ordena recursivamente',
    steps: (arr: number[]): AnimationStep[] => {
      const steps: AnimationStep[] = [];
      const array = [...arr];
      
      steps.push({
        array: [...array],
        description: 'Array inicial - Quick Sort começando'
      });

      const quickSortHelper = (low: number, high: number, depth = 0) => {
        if (low < high) {
          const pivotIndex = partition(low, high, depth);
          quickSortHelper(low, pivotIndex - 1, depth + 1);
          quickSortHelper(pivotIndex + 1, high, depth + 1);
        }
      };

      const partition = (low: number, high: number, depth: number): number => {
        const pivot = array[high];
        
        steps.push({
          array: [...array],
          pivot: high,
          highlightRange: [low, high],
          description: `Escolhendo pivot ${pivot} (profundidade ${depth})`
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
          steps.push({
            array: [...array],
            comparing: [j],
            pivot: high,
            highlightRange: [low, high],
            description: `Comparando ${array[j]} com pivot ${pivot}`
          });

          if (array[j] < pivot) {
            i++;
            if (i !== j) {
              steps.push({
                array: [...array],
                swapping: [i, j],
                pivot: high,
                highlightRange: [low, high],
                description: `${array[j]} < ${pivot}, movendo para esquerda`
              });

              [array[i], array[j]] = [array[j], array[i]];

              steps.push({
                array: [...array],
                pivot: high,
                highlightRange: [low, high],
                description: 'Elementos trocados'
              });
            }
          }
        }

        steps.push({
          array: [...array],
          swapping: [i + 1, high],
          description: `Colocando pivot ${pivot} na posição correta`
        });

        [array[i + 1], array[high]] = [array[high], array[i + 1]];

        steps.push({
          array: [...array],
          sorted: [i + 1],
          description: `Pivot ${pivot} está na posição final`
        });

        return i + 1;
      };

      quickSortHelper(0, array.length - 1);

      steps.push({
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        description: 'Quick Sort concluído!'
      });

      return steps;
    }
  },
  binarySearch: {
    name: 'Binary Search',
    complexity: 'O(log n)',
    description: 'Busca eficiente em array ordenado dividindo pela metade',
    steps: (arr: number[]): AnimationStep[] => {
      const steps: AnimationStep[] = [];
      const array = [...arr].sort((a, b) => a - b);
      const target = array[Math.floor(Math.random() * array.length)];
      
      steps.push({
        array: [...array],
        description: `Buscando ${target} em array ordenado`
      });

      let left = 0;
      let right = array.length - 1;
      let found = false;

      while (left <= right && !found) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...array],
          comparing: [mid],
          highlightRange: [left, right],
          description: `Meio: índice ${mid}, valor ${array[mid]}`
        });

        if (array[mid] === target) {
          steps.push({
            array: [...array],
            sorted: [mid],
            description: `Encontrado! ${target} está no índice ${mid}`
          });
          found = true;
        } else if (array[mid] < target) {
          steps.push({
            array: [...array],
            comparing: [mid],
            highlightRange: [mid + 1, right],
            description: `${array[mid]} < ${target}, buscando na metade direita`
          });
          left = mid + 1;
        } else {
          steps.push({
            array: [...array],
            comparing: [mid],
            highlightRange: [left, mid - 1],
            description: `${array[mid]} > ${target}, buscando na metade esquerda`
          });
          right = mid - 1;
        }
      }

      if (!found) {
        steps.push({
          array: [...array],
          description: `${target} não encontrado no array`
        });
      }

      return steps;
    }
  }
};

interface AlgorithmAnimatorProps {
  algorithm: keyof typeof algorithms;
  data?: number[];
  autoPlay?: boolean;
  speed?: number;
}

export default function AlgorithmAnimator({
  algorithm,
  data = [64, 34, 25, 12, 22, 11, 90],
  autoPlay = false,
  speed = 1000,
}: AlgorithmAnimatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);

  const config = algorithms[algorithm];

  useEffect(() => {
    const algorithmSteps = config.steps(data);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    
    // Inicializar valores animados
    animatedValues.current = data.map(() => new Animated.Value(0));
  }, [algorithm, data]);

  useEffect(() => {
    if (autoPlay && !isPlaying) {
      play();
    }
  }, [autoPlay, steps]);

  const play = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, speed]);

  const getCurrentStep = (): AnimationStep => {
    return steps[currentStep] || { array: data, description: 'Inicializing...' };
  };

  const getBarColor = (index: number): string => {
    const step = getCurrentStep();
    
    if (step.sorted?.includes(index)) return '#10b981';
    if (step.swapping?.includes(index)) return '#ef4444';
    if (step.comparing?.includes(index)) return '#3b82f6';
    if (step.pivot === index) return '#8b5cf6';
    if (step.highlightRange && 
        index >= step.highlightRange[0] && 
        index <= step.highlightRange[1]) return '#f59e0b';
    
    return '#6b7280';
  };

  const getBarHeight = (value: number): number => {
    const maxValue = Math.max(...data);
    const minHeight = 20;
    const maxHeight = 120;
    return minHeight + (value / maxValue) * (maxHeight - minHeight);
  };

  const renderArray = () => {
    const step = getCurrentStep();
    const barWidth = Math.min(40, (screenWidth - 80) / step.array.length);
    
    return (
      <View style={styles.arrayContainer}>
        {step.array.map((value, index) => (
          <View key={`${index}-${value}`} style={styles.barContainer}>
            <Animated.View
              style={[
                styles.bar,
                {
                  height: getBarHeight(value),
                  width: barWidth,
                  backgroundColor: getBarColor(index),
                },
              ]}
            />
            <Text style={styles.barLabel}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.algorithmInfo}>
          <Text style={styles.algorithmName}>{config.name}</Text>
          <Text style={styles.complexity}>{config.complexity}</Text>
        </View>
        <Text style={styles.description}>{config.description}</Text>
      </View>

      {/* Array Visualization */}
      <View style={styles.visualizationContainer}>
        {renderArray()}
      </View>

      {/* Current Step Info */}
      <View style={styles.stepInfo}>
        <Text style={styles.stepCounter}>
          Passo {currentStep + 1} de {steps.length}
        </Text>
        <Text style={styles.stepDescription}>
          {getCurrentStep().description}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={reset}
          disabled={isPlaying}
        >
          <Ionicons name="refresh" size={20} color="#4b5563" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={prevStep}
          disabled={isPlaying || currentStep === 0}
        >
          <Ionicons name="play-back" size={20} color="#4b5563" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={isPlaying ? pause : play}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={nextStep}
          disabled={isPlaying || currentStep === steps.length - 1}
        >
          <Ionicons name="play-forward" size={20} color="#4b5563" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            setCurrentStep(steps.length - 1);
            setIsPlaying(false);
          }}
          disabled={isPlaying}
        >
          <Ionicons name="play-skip-forward" size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${((currentStep + 1) / steps.length) * 100}%` 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#6b7280" label="Normal" />
        <LegendItem color="#3b82f6" label="Comparando" />
        <LegendItem color="#ef4444" label="Trocando" />
        <LegendItem color="#10b981" label="Ordenado" />
        {algorithm === 'quickSort' && (
          <LegendItem color="#8b5cf6" label="Pivot" />
        )}
      </View>
    </View>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 20,
  },
  algorithmInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  algorithmName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  complexity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  visualizationContainer: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  arrayContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  stepInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  stepCounter: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#3b82f6',
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 32,
    textAlign: 'right',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
});