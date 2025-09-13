import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen({ navigation }: any) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Comunidade" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyState}>
          <Ionicons name="people-circle-outline" size={80} color={colors.textMuted} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Explore grupos e conexões</Text>
          <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
            Conecte-se com desenvolvedores, participe de grupos de interesse e construa sua rede.
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
