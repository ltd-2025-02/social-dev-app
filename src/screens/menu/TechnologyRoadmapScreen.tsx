import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Technology {
  id: string;
  name: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  progress?: number; // 0-100
  resources?: { label: string; url: string }[];
}

interface Category {
  id: string;
  name: string;
  technologies: Technology[];
}

const ROADMAP_DATA: Category[] = [
  {
    id: 'frontend',
    name: 'Desenvolvimento Frontend',
    technologies: [
      {
        id: 'html-css',
        name: 'HTML & CSS',
        description: 'Fundamentos da web, estrutura e estilização.',
        level: 'Iniciante',
        progress: 80,
        resources: [
          { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML' },
        ],
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        description: 'Linguagem de programação para interatividade web.',
        level: 'Iniciante',
        progress: 60,
        resources: [
          { label: 'JavaScript.info', url: 'https://javascript.info/' },
        ],
      },
      {
        id: 'react',
        name: 'React',
        description: 'Biblioteca JavaScript para construção de interfaces de usuário.',
        level: 'Intermediário',
        progress: 40,
        resources: [
          { label: 'Documentação React', url: 'https://react.dev/' },
        ],
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        description: 'Framework React para aplicações full-stack e renderização no servidor.',
        level: 'Avançado',
        progress: 20,
        resources: [
          { label: 'Documentação Next.js', url: 'https://nextjs.org/docs' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    name: 'Desenvolvimento Backend',
    technologies: [
      {
        id: 'nodejs',
        name: 'Node.js',
        description: 'Ambiente de execução JavaScript server-side.',
        level: 'Intermediário',
        progress: 70,
        resources: [
          { label: 'Documentação Node.js', url: 'https://nodejs.org/docs/' },
        ],
      },
      {
        id: 'python',
        name: 'Python',
        description: 'Linguagem versátil para web, dados e automação.',
        level: 'Iniciante',
        progress: 90,
        resources: [
          { label: 'Python.org', url: 'https://www.python.org/doc/' },
        ],
      },
      {
        id: 'java',
        name: 'Java',
        description: 'Linguagem robusta para aplicações empresariais.',
        level: 'Avançado',
        progress: 50,
        resources: [
          { label: 'Oracle Java Docs', url: 'https://docs.oracle.com/en/java/' },
        ],
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Desenvolvimento Mobile',
    technologies: [
      {
        id: 'react-native',
        name: 'React Native',
        description: 'Framework para apps mobile nativos com JavaScript/React.',
        level: 'Intermediário',
        progress: 75,
        resources: [
          { label: 'Documentação React Native', url: 'https://reactnative.dev/docs/getting-started' },
        ],
      },
      {
        id: 'flutter',
        name: 'Flutter',
        description: 'UI toolkit do Google para apps nativos multiplataforma.',
        level: 'Intermediário',
        progress: 30,
        resources: [
          { label: 'Documentação Flutter', url: 'https://docs.flutter.dev/' },
        ],
      },
    ],
  },
];

export default function TechnologyRoadmapScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getLevelColor = (level: Technology['level']) => {
    switch (level) {
      case 'Iniciante': return colors.success;
      case 'Intermediário': return colors.warning;
      case 'Avançado': return colors.error;
      default: return colors.textMuted;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Roadmap de Tecnologias" showBackButton={true} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.introText, { color: colors.textMuted }]}>
          Explore as trilhas de aprendizado recomendadas para diversas tecnologias e áreas do desenvolvimento.
        </Text>

        {ROADMAP_DATA.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity 
              style={[styles.categoryHeader, { backgroundColor: colors.surface }]}
              onPress={() => toggleCategory(category.id)}
            >
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.name}</Text>
              <Ionicons 
                name={expandedCategories.includes(category.id) ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textMuted} 
              />
            </TouchableOpacity>

            {expandedCategories.includes(category.id) && (
              <View style={styles.technologiesList}>
                {category.technologies.map(tech => (
                  <View key={tech.id} style={[styles.techItem, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.techHeader}>
                      <Text style={[styles.techName, { color: colors.text }]}>{tech.name}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: getLevelColor(tech.level) }]}>
                        <Text style={styles.levelText}>{tech.level}</Text>
                      </View>
                    </View>
                    <Text style={[styles.techDescription, { color: colors.textMuted }]}>{tech.description}</Text>
                    
                    {tech.progress !== undefined && (
                      <View style={styles.progressBarContainer}>
                        <Text style={[styles.progressText, { color: colors.textMuted }]}>Progresso: {tech.progress}%</Text>
                        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                          <View style={[styles.progressBarFill, { width: `${tech.progress}%`, backgroundColor: colors.primary }]} />
                        </View>
                      </View>
                    )}

                    {tech.resources && tech.resources.length > 0 && (
                      <View style={styles.resourcesContainer}>
                        <Text style={[styles.resourcesTitle, { color: colors.text }]}>Recursos:</Text>
                        {tech.resources.map((resource, resIndex) => (
                          <TouchableOpacity 
                            key={resIndex} 
                            onPress={() => Linking.openURL(resource.url)}
                            style={styles.resourceLink}
                          >
                            <Ionicons name="link-outline" size={16} color={colors.link} />
                            <Text style={[styles.resourceLinkText, { color: colors.link }]}>{resource.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  introText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  categoryContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  technologiesList: {
    padding: 10,
  },
  techItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  techHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  techName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  levelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  techDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 5,
},
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  resourcesContainer: {
    marginTop: 15,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  resourceLinkText: {
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});