import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ResourceItemProps {
  icon: string;
  title: string;
  description: string;
  url: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, title, description, url }) => {
  const { colors } = useTheme();
  const handlePress = () => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <TouchableOpacity 
      style={[styles.resourceItem, { backgroundColor: colors.surface, borderColor: colors.border }] }
      onPress={handlePress}
    >
      <Ionicons name={icon as any} size={30} color={colors.primary} style={styles.resourceIcon} />
      <View style={styles.resourceTextContent}>
        <Text style={[styles.resourceTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.resourceDescription, { color: colors.textMuted }]}>{description}</Text>
      </View>
      <Ionicons name="open-outline" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

export default function ResourcesScreen({ navigation }: any) {
  const { colors } = useTheme();

  const resources = [
    {
      icon: 'book-outline',
      title: 'Documentação Oficial',
      description: 'Acesse a documentação oficial das principais tecnologias.',
      url: 'https://docs.github.com/pt/get-started/getting-started-with-git/git-basics',
    },
    {
      icon: 'code-slash-outline',
      title: 'Ferramentas de Desenvolvimento',
      description: 'Descubra ferramentas essenciais para otimizar seu fluxo de trabalho.',
      url: 'https://code.visualstudio.com/',
    },
    {
      icon: 'globe-outline',
      title: 'Blogs e Artigos',
      description: 'Mantenha-se atualizado com as últimas tendências e conhecimentos.',
      url: 'https://dev.to/',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Recursos" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recursos Úteis</Text>
          <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
            Explore uma curadoria de links e ferramentas para impulsionar seu desenvolvimento.
          </Text>
          {resources.map((resource, index) => (
            <ResourceItem key={index} {...resource} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceIcon: {
    marginRight: 15,
  },
  resourceTextContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 13,
  },
});
