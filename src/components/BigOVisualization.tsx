import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface ComplexityData {
  name: string;
  notation: string;
  color: string;
  description: string;
  example: string;
  getData: (n: number) => number;
}

const complexities: ComplexityData[] = [
  {
    name: 'Constante',
    notation: 'O(1)',
    color: '#10b981',
    description: 'Tempo constante, independente do tamanho da entrada',
    example: 'Acesso a array por índice',
    getData: (n: number) => 1,
  },
  {
    name: 'Logarítmica',
    notation: 'O(log n)',
    color: '#3b82f6',
    description: 'Cresce lentamente, divide o problema pela metade',
    example: 'Busca binária',
    getData: (n: number) => Math.log2(n),
  },
  {
    name: 'Linear',
    notation: 'O(n)',
    color: '#f59e0b',
    description: 'Proporcional ao tamanho da entrada',
    example: 'Percorrer array',
    getData: (n: number) => n,
  },
  {
    name: 'Linearítmica',
    notation: 'O(n log n)',
    color: '#8b5cf6',
    description: 'Comum em algoritmos de ordenação eficientes',
    example: 'Merge Sort, Quick Sort',
    getData: (n: number) => n * Math.log2(n),
  },
  {
    name: 'Quadrática',
    notation: 'O(n²)',
    color: '#ef4444',
    description: 'Cresce quadraticamente com a entrada',
    example: 'Bubble Sort, loops aninhados',
    getData: (n: number) => n * n,
  },
  {
    name: 'Exponencial',
    notation: 'O(2ⁿ)',
    color: '#dc2626',
    description: 'Cresce exponencialmente - evitar!',
    example: 'Fibonacci recursivo',
    getData: (n: number) => Math.pow(2, n),
  },
];

interface BigOVisualizationProps {
  maxN?: number;
  selectedComplexities?: string[];
  showComparison?: boolean;
}

export default function BigOVisualization({
  maxN = 10,
  selectedComplexities = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
  showComparison = true,
}: BigOVisualizationProps) {
  const [activeComplexity, setActiveComplexity] = useState<string | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const generateChartData = () => {
    const labels: string[] = [];
    const datasets: any[] = [];

    // Gerar labels (valores de n)
    for (let i = 1; i <= maxN; i++) {
      labels.push(i.toString());
    }

    // Gerar datasets para cada complexidade selecionada
    const filteredComplexities = complexities.filter(c => 
      selectedComplexities.includes(c.notation)
    );

    filteredComplexities.forEach((complexity, index) => {
      const data: number[] = [];
      let maxValue = 0;

      for (let i = 1; i <= maxN; i++) {
        let value = complexity.getData(i);
        
        // Limitar valores muito grandes para visualização
        if (complexity.notation === 'O(2ⁿ)' && i > 8) {
          value = Math.min(value, 1000);
        }
        if (complexity.notation === 'O(n²)' && i > 20) {
          value = Math.min(value, 400);
        }
        
        data.push(value);
        maxValue = Math.max(maxValue, value);
      }

      datasets.push({
        data,
        color: () => complexity.color,
        strokeWidth: activeComplexity === complexity.notation ? 4 : 2,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const chartData = generateChartData();

  const renderComplexityCard = (complexity: ComplexityData, index: number) => {
    const isActive = activeComplexity === complexity.notation;
    const isSelected = selectedComplexities.includes(complexity.notation);
    
    if (!isSelected) return null;

    return (
      <TouchableOpacity
        key={complexity.notation}
        style={[
          styles.complexityCard,
          { borderLeftColor: complexity.color },
          isActive && styles.activeCard,
        ]}
        onPress={() => setActiveComplexity(isActive ? null : complexity.notation)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.complexityInfo}>
            <Text style={[styles.notation, { color: complexity.color }]}>
              {complexity.notation}
            </Text>
            <Text style={styles.complexityName}>{complexity.name}</Text>
          </View>
          <Ionicons 
            name={isActive ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6b7280" 
          />
        </View>
        
        <Text style={styles.description}>{complexity.description}</Text>
        <Text style={styles.example}>Exemplo: {complexity.example}</Text>

        {isActive && (
          <Animated.View style={[
            styles.detailsContainer,
            {
              opacity: animatedValue,
              maxHeight: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
            },
          ]}>
            <Text style={styles.detailsTitle}>Comportamento:</Text>
            <View style={styles.behaviorGrid}>
              {[10, 100, 1000].map(n => (
                <View key={n} style={styles.behaviorItem}>
                  <Text style={styles.behaviorLabel}>n = {n}</Text>
                  <Text style={styles.behaviorValue}>
                    {formatOperations(complexity.getData(n))}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  const formatOperations = (ops: number): string => {
    if (ops < 1000) return Math.round(ops).toString();
    if (ops < 1000000) return `${(ops / 1000).toFixed(1)}K`;
    if (ops < 1000000000) return `${(ops / 1000000).toFixed(1)}M`;
    return `${(ops / 1000000000).toFixed(1)}B`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Crescimento de Complexidade</Text>
        <Text style={styles.chartSubtitle}>
          Como diferentes algoritmos escalam com o tamanho da entrada
        </Text>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '1',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartLegend}>
          {complexities
            .filter(c => selectedComplexities.includes(c.notation))
            .map(complexity => (
              <View key={complexity.notation} style={styles.legendItem}>
                <View 
                  style={[styles.legendColor, { backgroundColor: complexity.color }]} 
                />
                <Text style={styles.legendText}>{complexity.notation}</Text>
              </View>
            ))
          }
        </View>
      </View>

      {/* Complexity Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Detalhes das Complexidades</Text>
        {complexities.map(renderComplexityCard)}
      </View>

      {showComparison && (
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Comparação Prática</Text>
          <Text style={styles.comparisonSubtitle}>
            Tempo aproximado para processar 1 milhão de elementos:
          </Text>
          
          <View style={styles.comparisonGrid}>
            <ComparisonItem
              notation="O(1)"
              time="1ms"
              description="Instantâneo"
              color="#10b981"
            />
            <ComparisonItem
              notation="O(log n)"
              time="20ms"
              description="Muito rápido"
              color="#3b82f6"
            />
            <ComparisonItem
              notation="O(n)"
              time="1s"
              description="Aceitável"
              color="#f59e0b"
            />
            <ComparisonItem
              notation="O(n log n)"
              time="20s"
              description="Razoável"
              color="#8b5cf6"
            />
            <ComparisonItem
              notation="O(n²)"
              time="11 dias"
              description="Problemático"
              color="#ef4444"
            />
            <ComparisonItem
              notation="O(2ⁿ)"
              time="Eternidade"
              description="Impossível"
              color="#dc2626"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

interface ComparisonItemProps {
  notation: string;
  time: string;
  description: string;
  color: string;
}

function ComparisonItem({ notation, time, description, color }: ComparisonItemProps) {
  return (
    <View style={[styles.comparisonItem, { borderLeftColor: color }]}>
      <Text style={[styles.comparisonNotation, { color }]}>{notation}</Text>
      <Text style={styles.comparisonTime}>{time}</Text>
      <Text style={styles.comparisonDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chartSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4b5563',
  },
  cardsSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  complexityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCard: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complexityInfo: {
    flex: 1,
  },
  notation: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  complexityName: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  example: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  behaviorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  behaviorItem: {
    alignItems: 'center',
    flex: 1,
  },
  behaviorLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  behaviorValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  comparisonSection: {
    margin: 16,
    marginTop: 0,
  },
  comparisonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  comparisonGrid: {
    gap: 8,
  },
  comparisonItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonNotation: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  comparisonTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  comparisonDescription: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
});