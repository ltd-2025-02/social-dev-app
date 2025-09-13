import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  creativity: number;
}

const DEFAULT_AI_CONFIG: AIConfig = {
  apiKey: '',
  model: 'Gemini',
  temperature: 0.7,
  creativity: 0.5,
};

const AI_MODELS = [
  { label: 'Google Gemini (Padrão)', value: 'Gemini', icon: 'sparkles' },
  { label: 'OpenAI GPT', value: 'OpenAI', icon: 'chatbox' },
  { label: 'Perplexity AI', value: 'Perplexity', icon: 'search' },
  { label: 'Anthropic Claude', value: 'Claude', icon: 'cloud' },
  { label: 'Grok', value: 'Grok', icon: 'rocket' },
  { label: 'DeepSeek', value: 'DeepSeek', icon: 'code' },
  { label: 'V0', value: 'V0', icon: 'cube' },
  { label: 'Microsoft Copilot', value: 'Copilot', icon: 'laptop' },
];

export default function AIAssistantConfigScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [config, setConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@ai_assistant_config');
      if (jsonValue != null) {
        setConfig(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load AI config from AsyncStorage", e);
      Alert.alert("Erro", "Não foi possível carregar as configurações da IA.");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem('@ai_assistant_config', jsonValue);
      Alert.alert("Sucesso", "Configurações da IA salvas com sucesso!");
      navigation.navigate('AIChat'); // Navigate to AI Chat after saving
    } catch (e) {
      console.error("Failed to save AI config to AsyncStorage", e);
      Alert.alert("Erro", "Não foi possível salvar as configurações da IA.");
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (key: keyof AIConfig, value: any) => {
    setConfig(prevConfig => ({ ...prevConfig, [key]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Configurações do IA Assistant" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Carregando configurações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Configurações do IA Assistant" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Chave de API</Text>
          <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
            Insira sua chave de API para o modelo de IA selecionado. Para Gemini, a chave padrão é usada.
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Sua chave de API"
            placeholderTextColor={colors.textMuted}
            value={config.apiKey}
            onChangeText={(text) => handleValueChange('apiKey', text)}
            editable={config.model !== 'Gemini'} // Gemini uses a default key
          />
          {config.model === 'Gemini' ? (
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
              A chave de API para Gemini é gerenciada internamente. Para usar outros modelos, selecione-os acima e insira sua chave.
            </Text>
          ) : (
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
              Insira sua chave de API para o modelo {config.model}.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Modelo de IA</Text>
          <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
            Escolha o modelo de inteligência artificial que deseja utilizar.
          </Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Picker
              selectedValue={config.model}
              onValueChange={(itemValue) => handleValueChange('model', itemValue as string)}
              style={[styles.picker, { color: colors.text }]}>
              {AI_MODELS.map((model) => (
                <Picker.Item key={model.value} label={model.label} value={model.value} />
              ))}
            </Picker>
          </View>
          <View style={styles.selectedModelInfo}>
            {AI_MODELS.find(m => m.value === config.model)?.icon && (
              <Ionicons 
                name={AI_MODELS.find(m => m.value === config.model)?.icon as any} 
                size={24} 
                color={colors.primary} 
                style={styles.selectedModelIcon}
              />
            )}
            <Text style={[styles.selectedModelText, { color: colors.text }]}>
              {AI_MODELS.find(m => m.value === config.model)?.label}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Temperatura ({config.temperature.toFixed(1)})</Text>
          <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
            Controla a aleatoriedade das respostas. Valores mais altos geram respostas mais criativas.
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={config.temperature}
            onValueChange={(value) => handleValueChange('temperature', value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Criatividade ({config.creativity.toFixed(1)})</Text>
          <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
            Ajusta o nível de originalidade e diversidade nas respostas da IA.
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={config.creativity}
            onValueChange={(value) => handleValueChange('creativity', value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={saveConfig}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={styles.buttonText}>Salvar Configurações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.primary }]} 
          onPress={() => navigation.navigate('AIAssistantPromptList')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Gerenciar Prompts</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 15 : 12,
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedModelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  selectedModelIcon: {
    marginRight: 10,
  },
  selectedModelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
