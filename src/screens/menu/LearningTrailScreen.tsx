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
import { getTrailById } from '../../data/learningTrails';

const { width } = Dimensions.get('window');

export default function LearningTrailScreen({ navigation, route }: any) {
  const { trailId } = route.params;
  const trail = getTrailById(trailId);
  const [activeTab, setActiveTab] = useState<'modules' | 'documentation'>('modules');

  if (!trail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Trilha não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderModulesTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Trail Overview */}
      <View style={styles.overviewCard}>
        <View style={[styles.trailIconLarge, { backgroundColor: `${trail.color}20` }]}>
          <Ionicons name={trail.icon as any} size={48} color={trail.color} />
        </View>
        <Text style={styles.trailTitle}>{trail.name}</Text>
        <Text style={styles.trailDescription}>{trail.description}</Text>
        
        <View style={styles.trailStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color="#6b7280" />
            <Text style={styles.statText}>{trail.totalHours}h</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="library-outline" size={20} color="#6b7280" />
            <Text style={styles.statText}>{trail.modules.length} módulos</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={20} color="#6b7280" />
            <Text style={styles.statText}>{trail.level}</Text>
          </View>
        </View>
      </View>

      {/* Modules List */}
      <View style={styles.modulesSection}>
        <Text style={styles.sectionTitle}>Módulos da Trilha</Text>
        {trail.modules.map((module, index) => (
          <TouchableOpacity
            key={module.id}
            style={styles.moduleCard}
            onPress={() => navigation.navigate('LearningModule', { 
              trailId: trail.id, 
              moduleId: module.id 
            })}
          >
            <View style={styles.moduleHeader}>
              <View style={styles.moduleNumber}>
                <Text style={styles.moduleNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
                <View style={styles.moduleStats}>
                  <Text style={styles.moduleStatText}>
                    {module.estimatedHours}h • {module.lessons.length} lições
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
            
            {/* Lessons Preview */}
            <View style={styles.lessonsPreview}>
              {module.lessons.slice(0, 3).map((lesson, idx) => (
                <View key={lesson.id} style={styles.lessonPreviewItem}>
                  <View style={[styles.lessonDot, { 
                    backgroundColor: idx < 2 ? '#10b981' : '#e5e7eb' 
                  }]} />
                  <Text style={[styles.lessonPreviewText, {
                    color: idx < 2 ? '#065f46' : '#9ca3af'
                  }]}>
                    {lesson.title}
                  </Text>
                </View>
              ))}
              {module.lessons.length > 3 && (
                <Text style={styles.moreLessons}>
                  +{module.lessons.length - 3} lições
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Seu Progresso</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Continue de onde parou</Text>
            <Text style={styles.progressText}>
              Módulo 1: Fundamentos • Lição 2 de 5
            </Text>
          </View>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continuar</Text>
            <Ionicons name="play" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '35%' }]} />
        </View>
        <Text style={styles.progressLabel}>35% completo</Text>
      </View>
    </ScrollView>
  );

  const renderDocumentationTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Overview */}
      <View style={styles.docSection}>
        <Text style={styles.docTitle}>Visão Geral</Text>
        <Text style={styles.docText}>{trail.documentation.overview}</Text>
      </View>

      {/* Syntax Reference */}
      <View style={styles.docSection}>
        <Text style={styles.docTitle}>Referência de Sintaxe</Text>
        {trail.documentation.syntax.map((category, index) => (
          <View key={index} style={styles.syntaxCategory}>
            <Text style={styles.syntaxCategoryTitle}>{category.category}</Text>
            {category.items.map((item, idx) => (
              <View key={idx} style={styles.syntaxItem}>
                <Text style={styles.syntaxName}>{item.name}</Text>
                <Text style={styles.syntaxDescription}>{item.description}</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.syntaxCode}>{item.syntax}</Text>
                </View>
                <Text style={styles.syntaxExample}>Exemplo: {item.example}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Best Practices */}
      <View style={styles.docSection}>
        <Text style={styles.docTitle}>Melhores Práticas</Text>
        {trail.documentation.bestPractices.map((practice, index) => (
          <View key={index} style={styles.practiceItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.practiceText}>{practice}</Text>
          </View>
        ))}
      </View>

      {/* Common Pitfalls */}
      <View style={styles.docSection}>
        <Text style={styles.docTitle}>Erros Comuns</Text>
        {trail.documentation.commonPitfalls.map((pitfall, index) => (
          <View key={index} style={styles.pitfallItem}>
            <Ionicons name="warning" size={16} color="#f59e0b" />
            <Text style={styles.pitfallText}>{pitfall}</Text>
          </View>
        ))}
      </View>

      {/* Resources */}
      <View style={styles.docSection}>
        <Text style={styles.docTitle}>Recursos Extras</Text>
        {trail.documentation.resources.map((resource, index) => (
          <TouchableOpacity key={index} style={styles.resourceItem}>
            <View style={styles.resourceIcon}>
              <Ionicons 
                name={
                  resource.type === 'documentation' ? 'document-text' :
                  resource.type === 'tutorial' ? 'school' :
                  resource.type === 'video' ? 'play' :
                  'book'
                } 
                size={16} 
                color="#3b82f6" 
              />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceType}>{resource.type}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trail.name}</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modules' && styles.activeTab]}
          onPress={() => setActiveTab('modules')}
        >
          <Ionicons 
            name="library-outline" 
            size={20} 
            color={activeTab === 'modules' ? '#3b82f6' : '#6b7280'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'modules' && styles.activeTabText
          ]}>
            Módulos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'documentation' && styles.activeTab]}
          onPress={() => setActiveTab('documentation')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={20} 
            color={activeTab === 'documentation' ? '#3b82f6' : '#6b7280'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'documentation' && styles.activeTabText
          ]}>
            Documentação
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'modules' ? renderModulesTab() : renderDocumentationTab()}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  trailIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  trailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  trailDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  trailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  modulesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  moduleStats: {
    marginTop: 4,
  },
  moduleStatText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  lessonsPreview: {
    paddingLeft: 44,
  },
  lessonPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  lessonPreviewText: {
    fontSize: 11,
  },
  moreLessons: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginLeft: 14,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  progressInfo: {
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  // Documentation styles
  docSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  docText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  syntaxCategory: {
    marginBottom: 20,
  },
  syntaxCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  syntaxItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  syntaxName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  syntaxDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  syntaxCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#374151',
  },
  syntaxExample: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  practiceText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
  pitfallItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pitfallText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resourceIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  resourceType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});