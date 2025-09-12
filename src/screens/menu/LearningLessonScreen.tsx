import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById, getTrailById } from '../../data/learningTrails';

const { width } = Dimensions.get('window');

export default function LearningLessonScreen({ navigation, route }: any) {
  const { trailId, moduleId, lessonId } = route.params;
  const [currentSection, setCurrentSection] = useState<'theory' | 'examples' | 'exercises'>('theory');
  const [currentExercise, setCurrentExercise] = useState(0);
  
  const trail = getTrailById(trailId);
  const lesson = getLessonById(trailId, moduleId, lessonId);

  if (!trail || !lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Lição não encontrada</Text>
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

  const renderTheorySection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.theoryText}>{lesson.content.theory}</Text>
      
      <View style={styles.keyPointsSection}>
        <Text style={styles.sectionSubTitle}>Pontos Principais:</Text>
        {lesson.content.keyPoints.map((point, index) => (
          <View key={index} style={styles.keyPointItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderExamplesSection = () => (
    <View style={styles.sectionContent}>
      {lesson.content.codeExamples.map((example, index) => (
        <View key={index} style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>{example.title}</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{example.code}</Text>
          </View>
          <Text style={styles.exampleExplanation}>{example.explanation}</Text>
        </View>
      ))}
    </View>
  );

  const renderExercisesSection = () => {
    const exercise = lesson.exercises[currentExercise];
    if (!exercise) return null;

    return (
      <View style={styles.sectionContent}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <View style={[styles.difficultyBadge, {
            backgroundColor: `${getDifficultyColor(exercise.difficulty)}20`
          }]}>
            <Text style={[styles.difficultyText, {
              color: getDifficultyColor(exercise.difficulty)
            }]}>
              {getDifficultyLabel(exercise.difficulty)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        
        {exercise.code && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{exercise.code}</Text>
          </View>
        )}
        
        {exercise.hint && (
          <View style={styles.hintContainer}>
            <View style={styles.hintHeader}>
              <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
              <Text style={styles.hintTitle}>Dica:</Text>
            </View>
            <Text style={styles.hintText}>{exercise.hint}</Text>
          </View>
        )}

        {exercise.expectedOutput && (
          <View style={styles.outputContainer}>
            <Text style={styles.outputTitle}>Saída esperada:</Text>
            <Text style={styles.outputText}>{exercise.expectedOutput}</Text>
          </View>
        )}

        <View style={styles.exerciseNavigation}>
          <TouchableOpacity
            style={[styles.exerciseButton, currentExercise === 0 && styles.buttonDisabled]}
            onPress={() => setCurrentExercise(prev => Math.max(0, prev - 1))}
            disabled={currentExercise === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentExercise === 0 ? '#9ca3af' : '#3b82f6'} />
            <Text style={[styles.exerciseButtonText, currentExercise === 0 && styles.buttonTextDisabled]}>
              Anterior
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.exerciseCounter}>
            {currentExercise + 1} de {lesson.exercises.length}
          </Text>
          
          <TouchableOpacity
            style={[styles.exerciseButton, currentExercise === lesson.exercises.length - 1 && styles.buttonDisabled]}
            onPress={() => setCurrentExercise(prev => Math.min(lesson.exercises.length - 1, prev + 1))}
            disabled={currentExercise === lesson.exercises.length - 1}
          >
            <Text style={[styles.exerciseButtonText, currentExercise === lesson.exercises.length - 1 && styles.buttonTextDisabled]}>
              Próximo
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentExercise === lesson.exercises.length - 1 ? '#9ca3af' : '#3b82f6'} />
          </TouchableOpacity>
        </div>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <View style={styles.headerMeta}>
            <View style={[styles.headerDifficulty, {
              backgroundColor: `${getDifficultyColor(lesson.difficulty)}20`
            }]}>
              <Text style={[styles.headerDifficultyText, {
                color: getDifficultyColor(lesson.difficulty)
              }]}>
                {getDifficultyLabel(lesson.difficulty)}
              </Text>
            </View>
            <View style={styles.headerDuration}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.headerDurationText}>{lesson.duration}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Section Navigation */}
      <View style={styles.sectionNav}>
        <TouchableOpacity
          style={[styles.sectionButton, currentSection === 'theory' && styles.sectionButtonActive]}
          onPress={() => setCurrentSection('theory')}
        >
          <Ionicons 
            name="book-outline" 
            size={20} 
            color={currentSection === 'theory' ? '#3b82f6' : '#6b7280'} 
          />
          <Text style={[styles.sectionButtonText, currentSection === 'theory' && styles.sectionButtonTextActive]}>
            Teoria
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sectionButton, currentSection === 'examples' && styles.sectionButtonActive]}
          onPress={() => setCurrentSection('examples')}
        >
          <Ionicons 
            name="code-slash-outline" 
            size={20} 
            color={currentSection === 'examples' ? '#3b82f6' : '#6b7280'} 
          />
          <Text style={[styles.sectionButtonText, currentSection === 'examples' && styles.sectionButtonTextActive]}>
            Exemplos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sectionButton, currentSection === 'exercises' && styles.sectionButtonActive]}
          onPress={() => setCurrentSection('exercises')}
        >
          <Ionicons 
            name="fitness-outline" 
            size={20} 
            color={currentSection === 'exercises' ? '#3b82f6' : '#6b7280'} 
          />
          <Text style={[styles.sectionButtonText, currentSection === 'exercises' && styles.sectionButtonTextActive]}>
            Exercícios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentSection === 'theory' && renderTheorySection()}
        {currentSection === 'examples' && renderExamplesSection()}
        {currentSection === 'exercises' && renderExercisesSection()}
      </ScrollView>

      {/* Progress Footer */}
      <View style={styles.footer}>
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progresso da lição</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.completeButton}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.completeButtonText}>Marcar como Concluída</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 12,
  },
  headerDifficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  headerDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDurationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  sectionNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sectionButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  sectionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  sectionButtonTextActive: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContent: {
    paddingBottom: 20,
  },
  theoryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 20,
  },
  keyPointsSection: {
    marginTop: 16,
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  keyPointText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exampleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  codeContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  codeText: {
    color: '#f9fafb',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  exampleExplanation: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  hintContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 6,
  },
  hintText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
  },
  outputContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  outputTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  outputText: {
    fontSize: 12,
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  exerciseNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  exerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  buttonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  exerciseButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginHorizontal: 4,
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  exerciseCounter: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 12,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});