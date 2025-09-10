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
import { LinearGradient } from 'expo-linear-gradient';

interface CareerScreenProps {
  navigation: any;
}

export default function CareerScreen({ navigation }: CareerScreenProps) {
  const careerPaths = [
    {
      title: 'Frontend Developer',
      description: 'React, Vue, Angular, HTML/CSS',
      level: 'Junior → Senior',
      color: ['#3b82f6', '#1d4ed8'],
      icon: 'desktop-outline',
    },
    {
      title: 'Backend Developer',
      description: 'Node.js, Python, Java, APIs',
      level: 'Junior → Senior',
      color: ['#10b981', '#059669'],
      icon: 'server-outline',
    },
    {
      title: 'Mobile Developer',
      description: 'React Native, Flutter, iOS, Android',
      level: 'Junior → Senior',
      color: ['#f59e0b', '#d97706'],
      icon: 'phone-portrait-outline',
    },
    {
      title: 'DevOps Engineer',
      description: 'AWS, Docker, Kubernetes, CI/CD',
      level: 'Mid → Senior',
      color: ['#8b5cf6', '#7c3aed'],
      icon: 'cloud-outline',
    },
    {
      title: 'Data Scientist',
      description: 'Python, Machine Learning, Analytics',
      level: 'Junior → Senior',
      color: ['#ef4444', '#dc2626'],
      icon: 'analytics-outline',
    },
    {
      title: 'Tech Lead',
      description: 'Leadership, Architecture, Strategy',
      level: 'Senior → Staff',
      color: ['#6366f1', '#4f46e5'],
      icon: 'people-outline',
    },
  ];

  const skills = [
    { name: 'JavaScript', progress: 85, color: '#f7df1e' },
    { name: 'React', progress: 75, color: '#61dafb' },
    { name: 'Node.js', progress: 70, color: '#8cc84b' },
    { name: 'Python', progress: 60, color: '#3776ab' },
    { name: 'TypeScript', progress: 65, color: '#3178c6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carreira</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Seu Progresso</Text>
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillPercentage}>{skill.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color,
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Career Paths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trilhas de Carreira</Text>
          <Text style={styles.sectionSubtitle}>
            Explore diferentes caminhos na tecnologia
          </Text>
          
          <View style={styles.careerGrid}>
            {careerPaths.map((career, index) => (
              <TouchableOpacity key={index} style={styles.careerCard}>
                <LinearGradient
                  colors={career.color}
                  style={styles.careerGradient}
                >
                  <View style={styles.careerIcon}>
                    <Ionicons name={career.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.careerInfo}>
                    <Text style={styles.careerTitle}>{career.title}</Text>
                    <Text style={styles.careerDescription}>{career.description}</Text>
                    <Text style={styles.careerLevel}>{career.level}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#ddd6fe' }]}>
                <Ionicons name="document-text-outline" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionTitle}>Criar Currículo</Text>
              <Text style={styles.actionSubtitle}>Template profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="search-outline" size={24} color="#16a34a" />
              </View>
              <Text style={styles.actionTitle}>Buscar Vagas</Text>
              <Text style={styles.actionSubtitle}>Oportunidades</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="school-outline" size={24} color="#d97706" />
              </View>
              <Text style={styles.actionTitle}>Certificações</Text>
              <Text style={styles.actionSubtitle}>Validar skills</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#fce7f3' }]}>
                <Ionicons name="people-outline" size={24} color="#ec4899" />
              </View>
              <Text style={styles.actionTitle}>Mentoria</Text>
              <Text style={styles.actionSubtitle}>Encontrar mentor</Text>
            </TouchableOpacity>
          </View>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  skillsList: {
    marginTop: 16,
  },
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  skillPercentage: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  careerGrid: {
    gap: 12,
  },
  careerCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  careerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  careerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  careerInfo: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  careerDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  careerLevel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});