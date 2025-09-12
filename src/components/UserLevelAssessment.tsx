import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { progressService } from '../services/progressService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserStats {
  totalExperience: number;
  currentLevel: number;
  badgesEarned: number;
  exercisesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
}

interface LevelRequirement {
  level: number;
  name: string;
  description: string;
  experienceRequired: number;
  skills: string[];
  nextLevelAdvice?: string;
}

export const UserLevelAssessment: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state: RootState) => state.auth);

  const levelRequirements: LevelRequirement[] = [
    {
      level: 1,
      name: 'Iniciante',
      description: 'Começando a jornada de algoritmos',
      experienceRequired: 0,
      skills: ['Conceitos básicos', 'Primeira lição completa'],
      nextLevelAdvice: 'Continue praticando! Complete mais lições para avançar.'
    },
    {
      level: 2,
      name: 'Aprendiz',
      description: 'Entendendo os fundamentos',
      experienceRequired: 1000,
      skills: ['Complexidade O(1) e O(n)', 'Arrays básicos', 'Loops simples'],
      nextLevelAdvice: 'Foque em exercícios de complexidade para dominar Big O.'
    },
    {
      level: 3,
      name: 'Praticante',
      description: 'Aplicando conhecimentos',
      experienceRequired: 3000,
      skills: ['Big O avançado', 'Estruturas de dados básicas', 'Recursão simples'],
      nextLevelAdvice: 'Pratique mais estruturas de dados complexas.'
    },
    {
      level: 4,
      name: 'Competente',
      description: 'Resolvendo problemas complexos',
      experienceRequired: 6000,
      skills: ['Árvores', 'Grafos básicos', 'Algoritmos de busca', 'Ordenação'],
      nextLevelAdvice: 'Explore algoritmos mais avançados e otimizações.'
    },
    {
      level: 5,
      name: 'Proficiente',
      description: 'Dominando técnicas avançadas',
      experienceRequired: 10000,
      skills: ['Programação dinâmica', 'Grafos avançados', 'Backtracking'],
      nextLevelAdvice: 'Desafie-se com problemas de alta complexidade.'
    },
    {
      level: 6,
      name: 'Especialista',
      description: 'Expert em algoritmos',
      experienceRequired: 15000,
      skills: ['Algoritmos complexos', 'Otimizações avançadas', 'Estruturas especializadas'],
      nextLevelAdvice: 'Continue praticando para manter-se atualizado!'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const stats = await progressService.getUserStats(user!.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas estatísticas.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLevelInfo = (): LevelRequirement => {
    const currentLevel = userStats?.currentLevel || 1;
    return levelRequirements.find(req => req.level === currentLevel) || levelRequirements[0];
  };

  const getNextLevelInfo = (): LevelRequirement | null => {
    const currentLevel = userStats?.currentLevel || 1;
    return levelRequirements.find(req => req.level === currentLevel + 1) || null;
  };

  const getProgressToNextLevel = (): number => {
    const nextLevel = getNextLevelInfo();
    if (!nextLevel || !userStats) return 100;
    
    const currentExp = userStats.totalExperience;
    const currentLevelReq = getCurrentLevelInfo().experienceRequired;
    const nextLevelReq = nextLevel.experienceRequired;
    
    const progress = ((currentExp - currentLevelReq) / (nextLevelReq - currentLevelReq)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${Math.round(remainingMinutes)}min`;
  };

  const renderLevelProgress = () => {
    const currentLevelInfo = getCurrentLevelInfo();
    const nextLevelInfo = getNextLevelInfo();
    const progress = getProgressToNextLevel();

    return (
      <View style={styles.levelProgressContainer}>
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>{currentLevelInfo.name}</Text>
            <Text style={styles.levelNumber}>Nível {userStats?.currentLevel || 1}</Text>
          </View>
          <View style={styles.experienceInfo}>
            <Text style={styles.experienceText}>
              {userStats?.totalExperience || 0} XP
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {nextLevelInfo ? 
              `${Math.round(progress)}% para ${nextLevelInfo.name}` : 
              'Nível máximo atingido!'
            }
          </Text>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    if (!userStats) return null;

    const stats = [
      {
        icon: 'trophy',
        label: 'Badges',
        value: userStats.badgesEarned,
        color: '#f59e0b'
      },
      {
        icon: 'checkmark-circle',
        label: 'Exercícios',
        value: userStats.exercisesCompleted,
        color: '#10b981'
      },
      {
        icon: 'star',
        label: 'Média',
        value: `${userStats.averageScore}%`,
        color: '#3b82f6'
      },
      {
        icon: 'time',
        label: 'Tempo',
        value: formatTime(userStats.totalTimeSpent),
        color: '#8b5cf6'
      }
    ];

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSkillsModal = () => {
    const currentLevelInfo = getCurrentLevelInfo();
    const nextLevelInfo = getNextLevelInfo();

    return (
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Nível</Text>
              <TouchableOpacity
                onPress={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.currentLevelSection}>
                <Text style={styles.sectionTitle}>Nível Atual: {currentLevelInfo.name}</Text>
                <Text style={styles.sectionDescription}>{currentLevelInfo.description}</Text>
                
                <Text style={styles.skillsTitle}>Habilidades Dominadas:</Text>
                {currentLevelInfo.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Ionicons name="checkmark" size={16} color="#10b981" />
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {nextLevelInfo && (
                <View style={styles.nextLevelSection}>
                  <Text style={styles.sectionTitle}>Próximo Nível: {nextLevelInfo.name}</Text>
                  <Text style={styles.sectionDescription}>{nextLevelInfo.description}</Text>
                  <Text style={styles.expRequired}>
                    Experiência necessária: {nextLevelInfo.experienceRequired} XP
                  </Text>
                  
                  <Text style={styles.skillsTitle}>Novas Habilidades:</Text>
                  {nextLevelInfo.skills.map((skill, index) => (
                    <View key={index} style={styles.skillItem}>
                      <Ionicons name="radio-button-off" size={16} color="#94a3b8" />
                      <Text style={[styles.skillText, styles.futureSkill]}>{skill}</Text>
                    </View>
                  ))}

                  {currentLevelInfo.nextLevelAdvice && (
                    <View style={styles.adviceSection}>
                      <Ionicons name="lightbulb" size={20} color="#f59e0b" />
                      <Text style={styles.adviceText}>{currentLevelInfo.nextLevelAdvice}</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando avaliação...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seu Progresso</Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => setShowDetailModal(true)}
        >
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.detailsButtonText}>Detalhes</Text>
        </TouchableOpacity>
      </View>

      {renderLevelProgress()}
      {renderStats()}
      {renderSkillsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailsButtonText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  levelProgressContainer: {
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  levelNumber: {
    fontSize: 14,
    color: '#666',
  },
  experienceInfo: {
    alignItems: 'flex-end',
  },
  experienceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  currentLevelSection: {
    marginBottom: 24,
  },
  nextLevelSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  expRequired: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 12,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  futureSkill: {
    color: '#94a3b8',
  },
  adviceSection: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  adviceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#92400e',
    flex: 1,
  },
});