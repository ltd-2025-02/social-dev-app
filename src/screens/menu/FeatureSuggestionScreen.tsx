import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const featureCategories = [
  { id: 'social', label: 'Recursos Sociais', icon: 'people-outline', color: '#3b82f6' },
  { id: 'profile', label: 'Perfil', icon: 'person-outline', color: '#10b981' },
  { id: 'jobs', label: 'Vagas de Emprego', icon: 'briefcase-outline', color: '#f59e0b' },
  { id: 'chat', label: 'Chat/Mensagens', icon: 'chatbubbles-outline', color: '#ef4444' },
  { id: 'ai', label: 'IA Assistant', icon: 'chatbubble-ellipses-outline', color: '#8b5cf6' },
  { id: 'notifications', label: 'Notificações', icon: 'notifications-outline', color: '#06b6d4' },
  { id: 'ui', label: 'Interface', icon: 'phone-portrait-outline', color: '#ec4899' },
  { id: 'performance', label: 'Performance', icon: 'speedometer-outline', color: '#84cc16' },
  { id: 'integration', label: 'Integrações', icon: 'link-outline', color: '#f97316' },
  { id: 'other', label: 'Outro', icon: 'add-outline', color: '#6b7280' },
];

const priorityLevels = [
  { 
    id: 'low', 
    label: 'Baixa', 
    icon: 'arrow-down', 
    color: '#6b7280',
    description: 'Seria legal ter, mas não é urgente'
  },
  { 
    id: 'medium', 
    label: 'Média', 
    icon: 'remove', 
    color: '#f59e0b',
    description: 'Melhoraria significativamente a experiência'
  },
  { 
    id: 'high', 
    label: 'Alta', 
    icon: 'arrow-up', 
    color: '#ef4444',
    description: 'Funcionalidade muito importante ou necessária'
  },
];

export default function FeatureSuggestionScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useCases, setUseCases] = useState('');
  const [expectedBenefit, setExpectedBenefit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria para sua sugestão');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Erro', 'Digite um título para sua sugestão');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Digite uma descrição da funcionalidade');
      return false;
    }
    return true;
  };

  const submitSuggestion = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular envio da sugestão
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sugestão Enviada!',
        `Obrigado pela sua sugestão! Recebemos sua ideia com o ID: #FEAT${Date.now().toString().slice(-6)}. Nossa equipe de produto irá analisar e você poderá acompanhar o status no seu email.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a sugestão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCategoryInfo = () => {
    return featureCategories.find(cat => cat.id === selectedCategory);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugerir Funcionalidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="bulb" size={32} color="#f59e0b" />
          <Text style={styles.infoTitle}>Sua ideia é importante!</Text>
          <Text style={styles.infoText}>
            Ajude-nos a construir um SocialDev ainda melhor! Compartilhe suas ideias 
            e sugestões de novas funcionalidades. Nossa equipe de produto analisa 
            todas as sugestões cuidadosamente.
          </Text>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria *</Text>
          <Text style={styles.sectionSubtitle}>Em qual área do app sua sugestão se encaixa?</Text>
          
          <View style={styles.categoriesGrid}>
            {featureCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected,
                  selectedCategory === category.id && { borderColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? category.color : '#6b7280'} 
                />
                <Text style={[
                  styles.categoryLabel,
                  selectedCategory === category.id && { color: category.color }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prioridade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nível de Prioridade</Text>
          <Text style={styles.sectionSubtitle}>O quão importante é esta funcionalidade para você?</Text>
          
          {priorityLevels.map((priority) => (
            <TouchableOpacity
              key={priority.id}
              style={[
                styles.priorityCard,
                selectedPriority === priority.id && styles.priorityCardSelected
              ]}
              onPress={() => setSelectedPriority(priority.id)}
            >
              <View style={styles.priorityHeader}>
                <Ionicons 
                  name={priority.icon as any} 
                  size={20} 
                  color={selectedPriority === priority.id ? priority.color : '#6b7280'} 
                />
                <Text style={[
                  styles.priorityLabel,
                  selectedPriority === priority.id && { color: priority.color }
                ]}>
                  {priority.label}
                </Text>
              </View>
              <Text style={styles.priorityDescription}>{priority.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título da Sugestão *</Text>
          <Text style={styles.sectionSubtitle}>Descreva sua ideia em uma frase</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Sistema de comentários em tempo real"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />
          <Text style={styles.characterCount}>{title.length}/80</Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição Detalhada *</Text>
          <Text style={styles.sectionSubtitle}>Explique como esta funcionalidade deveria funcionar</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Descreva detalhadamente como você imagina que esta funcionalidade deveria funcionar, quais elementos teria na interface, como os usuários interagiriam com ela..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={800}
          />
          <Text style={styles.characterCount}>{description.length}/800</Text>
        </View>

        {/* Casos de Uso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casos de Uso</Text>
          <Text style={styles.sectionSubtitle}>Quando e como você usaria esta funcionalidade?</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Exemplo:&#10;• Durante uma entrevista online para compartilhar código em tempo real&#10;• Ao colaborar em projetos com outros desenvolvedores&#10;• Para fazer code reviews mais interativos"
            value={useCases}
            onChangeText={setUseCases}
            multiline
            numberOfLines={4}
            maxLength={400}
          />
          <Text style={styles.characterCount}>{useCases.length}/400</Text>
        </View>

        {/* Benefício Esperado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefício Esperado</Text>
          <Text style={styles.sectionSubtitle}>Que problema esta funcionalidade resolveria?</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Esta funcionalidade resolveria o problema de... e tornaria mais fácil para os usuários..."
            value={expectedBenefit}
            onChangeText={setExpectedBenefit}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
          <Text style={styles.characterCount}>{expectedBenefit.length}/300</Text>
        </View>

        {/* Resumo da Sugestão */}
        {selectedCategory && title && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="document-text-outline" size={24} color="#3b82f6" />
              <Text style={styles.summaryTitle}>Resumo da Sugestão</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Categoria:</Text>
              <View style={styles.summaryValue}>
                <Ionicons 
                  name={getSelectedCategoryInfo()?.icon as any} 
                  size={16} 
                  color={getSelectedCategoryInfo()?.color} 
                />
                <Text style={styles.summaryText}>{getSelectedCategoryInfo()?.label}</Text>
              </View>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Prioridade:</Text>
              <Text style={styles.summaryText}>
                {priorityLevels.find(p => p.id === selectedPriority)?.label}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Título:</Text>
              <Text style={styles.summaryText}>{title || 'Não definido'}</Text>
            </View>
          </View>
        )}

        {/* Botão de Envio */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={submitSuggestion}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Ionicons name="hourglass-outline" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Enviando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="rocket-outline" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Enviar Sugestão</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            Sua sugestão será analisada pela equipe de produto. Você receberá updates sobre o status por email.
          </Text>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  categoryCardSelected: {
    backgroundColor: '#f8fafc',
  },
  categoryLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  priorityCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  priorityCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  priorityDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 28,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    width: 80,
  },
  summaryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryText: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 6,
    flex: 1,
  },
  submitSection: {
    padding: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  submitNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});