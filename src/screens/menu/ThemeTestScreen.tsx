import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeTestScreenProps {
  navigation: any;
}

export default function ThemeTestScreen({ navigation }: ThemeTestScreenProps) {
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.border : 'transparent',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    colorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    colorBox: {
      width: 30,
      height: 30,
      borderRadius: 8,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    colorName: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
      fontWeight: '500',
    },
    colorValue: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: 'monospace',
    },
    gradientDemo: {
      height: 60,
      borderRadius: 12,
      marginVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradientText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginVertical: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    themeInfo: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 16,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: isDark ? colors.purple + '20' : colors.primary + '20',
      marginBottom: 16,
    },
    statusText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? colors.purple : colors.primary,
      marginLeft: 8,
    },
  });

  const draculaColors = [
    { name: 'Purple', color: colors.purple, value: '#bd93f9' },
    { name: 'Pink', color: colors.pink, value: '#ff79c6' },
    { name: 'Cyan', color: colors.cyan, value: '#8be9fd' },
    { name: 'Green', color: colors.green, value: '#50fa7b' },
    { name: 'Orange', color: colors.orange, value: '#ffb86c' },
    { name: 'Red', color: colors.red, value: '#ff5555' },
    { name: 'Yellow', color: colors.yellow, value: '#f1fa8c' },
  ];

  const baseColors = [
    { name: 'Background', color: colors.background, value: colors.background },
    { name: 'Surface', color: colors.surface, value: colors.surface },
    { name: 'Text', color: colors.text, value: colors.text },
    { name: 'Border', color: colors.border, value: colors.border },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Teste de Tema Dracula</Text>
        
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDark ? "sunny" : "moon"} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Status Indicator */}
        <View style={styles.statusIndicator}>
          <Ionicons 
            name={isDark ? "moon" : "sunny"} 
            size={20} 
            color={isDark ? colors.purple : colors.primary} 
          />
          <Text style={styles.statusText}>
            Tema {isDark ? 'Dracula (Dark)' : 'Light'} Ativo
          </Text>
        </View>

        {/* Theme Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧛‍♂️ Sobre o Tema Dracula</Text>
          <Text style={styles.themeInfo}>
            O tema Dracula é um tema escuro popular entre desenvolvedores, com uma paleta de cores vibrantes 
            e alta legibilidade. Ele usa tons roxos como cor primária e cores saturadas para destacar elementos importantes.
          </Text>
          <Text style={styles.themeInfo}>
            {isDark 
              ? 'Você está visualizando o tema Dracula completo com todas as cores oficiais da paleta.'
              : 'Alterne para o modo escuro para ver o tema Dracula em ação!'
            }
          </Text>
        </View>

        {/* Dracula Color Palette */}
        {isDark && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Paleta de Cores Dracula</Text>
            {draculaColors.map((color, index) => (
              <View key={index} style={styles.colorRow}>
                <View style={[styles.colorBox, { backgroundColor: color.color }]} />
                <Text style={styles.colorName}>{color.name}</Text>
                <Text style={styles.colorValue}>{color.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Base Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Cores Base do Tema</Text>
          {baseColors.map((color, index) => (
            <View key={index} style={styles.colorRow}>
              <View style={[styles.colorBox, { backgroundColor: color.color }]} />
              <Text style={styles.colorName}>{color.name}</Text>
              <Text style={styles.colorValue}>{color.value}</Text>
            </View>
          ))}
        </View>

        {/* Gradient Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌈 Demonstração de Gradientes</Text>
          <LinearGradient
            colors={isDark ? [colors.purple, colors.pink] : [colors.primary, '#8b5cf6']}
            style={styles.gradientDemo}
          >
            <Text style={styles.gradientText}>
              Gradiente {isDark ? 'Dracula' : 'Light'}
            </Text>
          </LinearGradient>
        </View>

        {/* Button Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔘 Teste de Botões</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Botão Primário', 'Cor primária do tema!')}
            >
              <Text style={[styles.buttonText, { color: colors.primaryText }]}>
                Primário
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.success }]}
              onPress={() => Alert.alert('Botão Sucesso', 'Cor de sucesso!')}
            >
              <Text style={[styles.buttonText, { color: isDark ? colors.background : 'white' }]}>
                Sucesso
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.warning }]}
              onPress={() => Alert.alert('Botão Aviso', 'Cor de aviso!')}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Aviso
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={() => Alert.alert('Botão Erro', 'Cor de erro!')}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                Erro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Como Usar</Text>
          <Text style={styles.themeInfo}>
            • Toque no ícone da lua/sol no canto superior direito para alternar entre os temas
          </Text>
          <Text style={styles.themeInfo}>
            • O tema será salvo automaticamente e aplicado em toda a aplicação
          </Text>
          <Text style={styles.themeInfo}>
            • Todas as telas usam o sistema de cores dinâmico para se adaptar ao tema escolhido
          </Text>
          <Text style={styles.themeInfo}>
            • O tema Dracula está otimizado para melhor legibilidade em ambientes com pouca luz
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}