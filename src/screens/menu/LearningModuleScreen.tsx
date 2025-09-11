import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTrailById, getModuleById } from '../../data/learningTrails';

export default function LearningModuleScreen({ navigation, route }: any) {
  const { trailId, moduleId } = route.params;
  const trail = getTrailById(trailId);
  const module = getModuleById(trailId, moduleId);

  if (!trail || !module) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Módulo não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{module.title}</Text>
          <Text style={styles.headerSubtitle}>{trail.name}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Module Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.moduleHeader}>
            <View style={[styles.moduleIcon, { backgroundColor: `${trail.color}20` }]}>
              <Ionicons name={module.icon as any} size={32} color={trail.color} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </View>
          </View>
          
          <View style={styles.moduleStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#6b7280" />
              <Text style={styles.statText}>{module.estimatedHours}h</Text>
              <Text style={styles.statLabel}>Duração</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="library-outline" size={20} color="#6b7280" />
              <Text style={styles.statText}>{module.lessons.length}</Text>
              <Text style={styles.statLabel}>Lições</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={20} color="#6b7280" />
              <Text style={styles.statText}>
                {module.lessons.reduce((acc, lesson) => acc + lesson.exercises.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Exercícios</Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progresso do Módulo</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>40% completo • 2 de 5 lições</Text>
          </View>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lições do Módulo</Text>
          
          {module.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => navigation.navigate('LearningLesson', {
                trailId,
                moduleId,
                lessonId: lesson.id
              })}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>
                  
                  <View style={styles.lessonMeta}>
                    <View style={styles.lessonDuration}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
                    </View>
                    <View style={[styles.lessonDifficulty, { 
                      backgroundColor: `${getDifficultyColor(lesson.difficulty)}20` 
                    }]}>
                      <Text style={[styles.lessonDifficultyText, {
                        color: getDifficultyColor(lesson.difficulty)
                      }]}>
                        {getDifficultyLabel(lesson.difficulty)}
                      </Text>
                    </View>
                    <View style={styles.lessonExercises}>
                      <Ionicons name="code-slash-outline" size={14} color="#6b7280" />
                      <Text style={styles.lessonMetaText}>
                        {lesson.exercises.length} exercícios
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.lessonActions}>
                  <View style={[styles.lessonStatus, {
                    backgroundColor: index < 2 ? '#10b981' : '#e5e7eb'
                  }]}>
                    <Ionicons 
                      name={index < 2 ? "checkmark" : "lock-closed"} 
                      size={12} 
                      color={index < 2 ? '#fff' : '#9ca3af'} 
                    />
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </View>

              {/* Lesson Preview */}
              <View style={styles.lessonPreview}>
                <Text style={styles.previewTitle}>Tópicos principais:</Text>
                <View style={styles.keyPoints}>
                  {lesson.content.keyPoints.slice(0, 3).map((point, idx) => (
                    <Text key={idx} style={styles.keyPoint}>• {point}</Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Learning */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('LearningLesson', {
              trailId,
              moduleId,
              lessonId: module.lessons[0].id
            })}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.startButtonText}>Começar Módulo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.previewButton}>
            <Ionicons name="eye-outline" size={20} color="#3b82f6" />
            <Text style={styles.previewButtonText}>Prévia do Conteúdo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  lessonsSection: {
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  lessonMetaText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
  lessonDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 12,
    marginBottom: 4,
  },
  lessonDifficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  lessonExercises: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonActions: {
    alignItems: 'center',
  },
  lessonStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonPreview: {
    paddingLeft: 44,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  keyPoints: {
    paddingLeft: 8,
  },
  keyPoint: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  actionSection: {
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 8,
  },
});