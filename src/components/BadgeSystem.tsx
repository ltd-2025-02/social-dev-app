import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { progressService, Badge, UserBadge } from '../services/progressService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface BadgeSystemProps {
  trackId?: string;
  moduleId?: string;
  onBadgeEarned?: (badge: Badge) => void;
}

interface BadgeWithStatus extends Badge {
  isEarned: boolean;
  earnedAt?: string;
  isNew?: boolean;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  trackId,
  moduleId,
  onBadgeEarned,
}) => {
  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBadgeAnimation] = useState(new Animated.Value(0));
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      loadBadges();
    }
  }, [user?.id, trackId, moduleId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const [userBadges, allBadges] = await Promise.all([
        progressService.getUserBadges(user!.id),
        progressService.getAllBadges()
      ]);
      
      const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
      
      // Use badges from database if available, otherwise fallback to predefined
      const algorithmBadges: Badge[] = allBadges.length > 0 ? allBadges : [
        {
          id: '1',
          name: 'Primeiro Passo',
          description: 'Complete sua primeira lição de algoritmos',
          icon: '🎯',
          image_path: 'badge_first_lesson.png',
          criteria: 'complete_first_lesson',
          color: '#3b82f6',
          rarity: 'common'
        },
        {
          id: '2',
          name: 'Mestre da Complexidade',
          description: 'Domine a análise de complexidade Big O',
          icon: '📊',
          image_path: 'badge_big_o_master.png',
          criteria: 'complete_big_o_module',
          color: '#3b82f6',
          rarity: 'common'
        },
        {
          id: '3',
          name: 'Especialista em Arrays',
          description: 'Complete todos os exercícios de arrays',
          icon: '🔢',
          image_path: 'badge_array_expert.png',
          criteria: 'master_arrays',
          color: '#10b981',
          rarity: 'uncommon'
        },
        {
          id: '4',
          name: 'Guru da Recursão',
          description: 'Resolva 10 problemas recursivos consecutivos',
          icon: '🌀',
          image_path: 'badge_recursion_guru.png',
          criteria: 'recursion_master',
          color: '#8b5cf6',
          rarity: 'rare'
        },
        {
          id: '5',
          name: 'Velocista do Código',
          description: 'Resolva um exercício em menos de 5 minutos',
          icon: '⚡',
          image_path: 'badge_speed_coder.png',
          criteria: 'speed_coder',
          color: '#ef4444',
          rarity: 'rare'
        },
        {
          id: '6',
          name: 'Perfeccionista',
          description: 'Obtenha 100% de pontuação em 5 exercícios seguidos',
          icon: '⭐',
          image_path: 'badge_perfectionist.png',
          criteria: 'perfectionist',
          color: '#10b981',
          rarity: 'rare'
        },
        {
          id: '7',
          name: 'Maratonista',
          description: 'Estude por mais de 2 horas seguidas',
          icon: '🏃',
          image_path: 'badge_marathon_learner.png',
          criteria: 'marathon_learner',
          color: '#f59e0b',
          rarity: 'uncommon'
        },
        {
          id: '8',
          name: 'Explorador de Estruturas',
          description: 'Experimente todas as estruturas de dados interativas',
          icon: '🗂️',
          image_path: 'badge_data_structure_explorer.png',
          criteria: 'data_structure_explorer',
          color: '#10b981',
          rarity: 'uncommon'
        }
      ];

      const badgesWithStatus: BadgeWithStatus[] = algorithmBadges.map(badge => {
        const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
        return {
          ...badge,
          isEarned: earnedBadgeIds.has(badge.id),
          earnedAt: userBadge?.earned_at,
        };
      });

      setBadges(badgesWithStatus);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBadgePress = (badge: BadgeWithStatus) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const animateNewBadge = () => {
    Animated.sequence([
      Animated.timing(newBadgeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(newBadgeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderBadge = (badge: BadgeWithStatus, index: number) => {
    const isEarned = badge.isEarned;
    const badgeStyle = isEarned ? styles.earnedBadge : styles.lockedBadge;
    
    return (
      <TouchableOpacity
        key={badge.id}
        style={[styles.badgeContainer, badgeStyle]}
        onPress={() => handleBadgePress(badge)}
        disabled={!isEarned}
      >
        <View style={[styles.badgeIcon, !isEarned && styles.lockedIcon]}>
          {isEarned ? (
            badge.image_path ? (
              <Image 
                source={{ uri: `../../../assets/badges/${badge.image_path}` }}
                style={styles.badgeImage}
                defaultSource={require('../../../assets/badges/default_badge.png')}
              />
            ) : (
              <Text style={styles.badgeEmoji}>{badge.icon}</Text>
            )
          ) : (
            <Ionicons name="lock-closed" size={24} color="#666" />
          )}
        </View>
        <Text style={[styles.badgeName, !isEarned && styles.lockedText]} numberOfLines={2}>
          {badge.name}
        </Text>
        {badge.isNew && (
          <View style={styles.newBadgeIndicator}>
            <Text style={styles.newBadgeText}>NOVO!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderBadgeModal = () => {
    if (!selectedBadge) return null;

    return (
      <Modal
        visible={showBadgeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBadgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBadgeModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            
            <View style={styles.modalBadgeIcon}>
              {selectedBadge.image_path ? (
                <Image 
                  source={{ uri: `../../../assets/badges/${selectedBadge.image_path}` }}
                  style={styles.modalBadgeImage}
                  defaultSource={require('../../../assets/badges/default_badge.png')}
                />
              ) : (
                <Text style={styles.modalBadgeEmoji}>{selectedBadge.icon}</Text>
              )}
            </View>
            
            <Text style={styles.modalBadgeName}>{selectedBadge.name}</Text>
            <Text style={styles.modalBadgeDescription}>{selectedBadge.description}</Text>
            
            {selectedBadge.isEarned && selectedBadge.earnedAt && (
              <View style={styles.earnedInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.earnedText}>
                  Conquistado em {new Date(selectedBadge.earnedAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            )}
            
            {!selectedBadge.isEarned && (
              <View style={styles.lockedInfo}>
                <Ionicons name="lock-closed" size={20} color="#ef4444" />
                <Text style={styles.lockedInfoText}>Continue estudando para desbloquear!</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando badges...</Text>
      </View>
    );
  }

  const earnedCount = badges.filter(b => b.isEarned).length;
  const totalCount = badges.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suas Conquistas</Text>
        <Text style={styles.progress}>
          {earnedCount}/{totalCount} badges conquistados
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgesList}
      >
        {badges.map(renderBadge)}
      </ScrollView>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(earnedCount / totalCount) * 100}%` }
          ]} 
        />
      </View>

      {renderBadgeModal()}
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
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  badgesList: {
    paddingHorizontal: 8,
  },
  badgeContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
    position: 'relative',
  },
  earnedBadge: {
    opacity: 1,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  lockedIcon: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d1d5db',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  lockedText: {
    color: '#666',
  },
  newBadgeIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
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
    padding: 24,
    width: Dimensions.get('window').width - 64,
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalBadgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  modalBadgeEmoji: {
    fontSize: 32,
  },
  modalBadgeImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  modalBadgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalBadgeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  earnedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  earnedText: {
    fontSize: 14,
    color: '#065f46',
    marginLeft: 8,
  },
  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lockedInfoText: {
    fontSize: 14,
    color: '#991b1b',
    marginLeft: 8,
  },
});