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
import { learningTrails } from '../../data/learningTrails';

export default function LearningScreen({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aprenda Tecnologias</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.welcomeTitle}>Aprenda Programação</Text>
          <Text style={styles.welcomeText}>
            Trilhas completas com teoria, prática e exercícios para você dominar as principais tecnologias do mercado.
          </Text>
        </View>

        {/* Learning Trails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trilhas de Aprendizado</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha uma trilha e comece sua jornada de aprendizado
          </Text>
          
          {learningTrails.map((trail, index) => (
            <TouchableOpacity 
              key={trail.id} 
              style={[styles.trailCard, { borderLeftColor: trail.color }]}
              onPress={() => navigation.navigate('LearningTrail', { trailId: trail.id })}
            >
              <View style={styles.trailHeader}>
                <View style={[styles.trailIcon, { backgroundColor: `${trail.color}20` }]}>
                  <Ionicons name={trail.icon as any} size={32} color={trail.color} />
                </View>
                <View style={styles.trailInfo}>
                  <Text style={styles.trailName}>{trail.name}</Text>
                  <Text style={styles.trailLevel}>{trail.level}</Text>
                  <Text style={styles.trailDuration}>{trail.totalHours}h • {trail.modules.length} módulos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </View>
              
              <Text style={styles.trailDescription}>{trail.description}</Text>
              
              <View style={styles.trailModules}>
                <Text style={styles.modulesTitle}>Módulos:</Text>
                {trail.modules.slice(0, 3).map((module, idx) => (
                  <Text key={module.id} style={styles.moduleItem}>
                    • {module.title}
                  </Text>
                ))}
                {trail.modules.length > 3 && (
                  <Text style={styles.moduleItem}>
                    • +{trail.modules.length - 3} módulos
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Por que aprender conosco?</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="book-outline" size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Lições</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="code-slash-outline" size={24} color="#10b981" />
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Exercícios</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Projetos</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={24} color="#ef4444" />
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Prático</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  content: { 
    flex: 1 
  },
  headerInfo: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  trailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  trailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trailIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trailInfo: {
    flex: 1,
  },
  trailName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  trailLevel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  trailDuration: {
    fontSize: 11,
    color: '#9ca3af',
  },
  trailDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  trailModules: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  modulesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  moduleItem: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  statsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});