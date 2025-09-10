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

export default function LearningScreen({ navigation }: any) {
  const technologies = [
    { name: 'JavaScript', level: 'Básico → Avançado', color: '#f7df1e', icon: 'logo-javascript' },
    { name: 'React', level: 'Básico → Avançado', color: '#61dafb', icon: 'logo-react' },
    { name: 'Python', level: 'Básico → Intermediário', color: '#3776ab', icon: 'logo-python' },
    { name: 'Node.js', level: 'Básico → Avançado', color: '#8cc84b', icon: 'logo-nodejs' },
  ];

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trilhas de Aprendizado</Text>
          {technologies.map((tech, index) => (
            <TouchableOpacity key={index} style={styles.techCard}>
              <Ionicons name={tech.icon as any} size={32} color={tech.color} />
              <View style={styles.techInfo}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techLevel}>{tech.level}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  content: { flex: 1 },
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
    marginBottom: 16,
  },
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  techInfo: {
    flex: 1,
    marginLeft: 12,
  },
  techName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  techLevel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});