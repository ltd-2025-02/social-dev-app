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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Prompt {
  id: string;
  name: string;
  content: string;
}

export default function AIAssistantPromptListScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [promptName, setPromptName] = useState('');
  const [promptContent, setPromptContent] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@ai_assistant_prompts');
      if (jsonValue != null) {
        setPrompts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load prompts from AsyncStorage", e);
      Alert.alert("Erro", "Não foi possível carregar os prompts.");
    } finally {
      setLoading(false);
    }
  };

  const savePrompts = async (updatedPrompts: Prompt[]) => {
    try {
      const jsonValue = JSON.stringify(updatedPrompts);
      await AsyncStorage.setItem('@ai_assistant_prompts', jsonValue);
      setPrompts(updatedPrompts);
    } catch (e) {
      console.error("Failed to save prompts to AsyncStorage", e);
      Alert.alert("Erro", "Não foi possível salvar os prompts.");
    }
  };

  const handleAddPrompt = () => {
    setCurrentPrompt(null);
    setPromptName('');
    setPromptContent('');
    setModalVisible(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setPromptName(prompt.name);
    setPromptContent(prompt.content);
    setModalVisible(true);
  };

  const handleDeletePrompt = (id: string) => {
    Alert.alert(
      "Excluir Prompt",
      "Tem certeza que deseja excluir este prompt?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updatedPrompts = prompts.filter(p => p.id !== id);
            savePrompts(updatedPrompts);
          },
        },
      ]
    );
  };

  const handleSavePrompt = () => {
    if (!promptName.trim() || !promptContent.trim()) {
      Alert.alert("Erro", "Nome e conteúdo do prompt não podem ser vazios.");
      return;
    }

    let updatedPrompts: Prompt[];
    if (currentPrompt) {
      updatedPrompts = prompts.map(p =>
        p.id === currentPrompt.id ? { ...p, name: promptName, content: promptContent } : p
      );
    } else {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        name: promptName,
        content: promptContent,
      };
      updatedPrompts = [...prompts, newPrompt];
    }
    savePrompts(updatedPrompts);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Meus Prompts de IA" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Carregando prompts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Meus Prompts de IA" showBackButton={true} />
      <View style={styles.content}>
        <FlatList
          data={prompts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.promptItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.promptTextContent}>
                <Text style={[styles.promptName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.promptContent, { color: colors.textMuted }]} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
              <View style={styles.promptActions}>
                <TouchableOpacity onPress={() => handleEditPrompt(item)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePrompt(item.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={50} color={colors.textMuted} />
              <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
                Você ainda não tem nenhum prompt salvo.
              </Text>
            </View>
          )}
          contentContainerStyle={prompts.length === 0 ? styles.centerEmptyState : null}
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddPrompt}
        >
          <Ionicons name="add" size={24} color={colors.buttonText} />
          <Text style={styles.addButtonText}>Adicionar Novo Prompt</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {currentPrompt ? 'Editar Prompt' : 'Novo Prompt'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Nome do Prompt"
              placeholderTextColor={colors.textMuted}
              value={promptName}
              onChangeText={setPromptName}
            />
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Conteúdo do Prompt"
              placeholderTextColor={colors.textMuted}
              value={promptContent}
              onChangeText={setPromptContent}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSavePrompt}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
  },
  promptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  promptTextContent: {
    flex: 1,
    marginRight: 10,
  },
  promptName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promptContent: {
    fontSize: 13,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  centerEmptyState: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
