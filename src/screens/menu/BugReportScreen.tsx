import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const bugCategories = [
  { id: 'crash', label: 'App Travando', icon: 'warning-outline' },
  { id: 'ui', label: 'Problema de Interface', icon: 'phone-portrait-outline' },
  { id: 'feature', label: 'Funcionalidade', icon: 'settings-outline' },
  { id: 'performance', label: 'Performance', icon: 'speedometer-outline' },
  { id: 'login', label: 'Login/Conta', icon: 'person-outline' },
  { id: 'notification', label: 'Notificações', icon: 'notifications-outline' },
  { id: 'data', label: 'Dados/Sincronização', icon: 'cloud-outline' },
  { id: 'other', label: 'Outro', icon: 'help-outline' },
];

const severityLevels = [
  { id: 'low', label: 'Baixa', color: '#10b981', description: 'Problema menor que não impacta o uso' },
  { id: 'medium', label: 'Média', color: '#f59e0b', description: 'Problema que causa algum inconveniente' },
  { id: 'high', label: 'Alta', color: '#ef4444', description: 'Problema que impede o uso de funcionalidades' },
  { id: 'critical', label: 'Crítica', color: '#dc2626', description: 'App não funciona ou perde dados' },
];

export default function BugReportScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
  const [includeUserInfo, setIncludeUserInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria para o bug');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Erro', 'Digite um título para o bug');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Digite uma descrição do problema');
      return false;
    }
    return true;
  };

  const submitBugReport = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular envio do relatório
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Bug Reportado!',
        `Obrigado por reportar este problema. Seu relatório foi enviado com o ID: #BUG${Date.now().toString().slice(-6)}. Nossa equipe irá analisar e você receberá uma resposta em até 24 horas.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o relatório. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedSeverityInfo = () => {
    return severityLevels.find(level => level.id === selectedSeverity);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Bug</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="bug-outline" size={32} color="#ef4444" />
          <Text style={styles.infoTitle}>Encontrou um problema?</Text>
          <Text style={styles.infoText}>
            Ajude-nos a melhorar o SocialDev reportando bugs e problemas. 
            Quanto mais detalhes você fornecer, mais rápido conseguiremos resolver.
          </Text>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria do Problema *</Text>
          <Text style={styles.sectionSubtitle}>Selecione a categoria que melhor descreve o problema</Text>
          
          <View style={styles.categoriesGrid}>
            {bugCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? '#3b82f6' : '#6b7280'} 
                />
                <Text style={[
                  styles.categoryLabel,
                  selectedCategory === category.id && styles.categoryLabelSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Severidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nível de Severidade</Text>
          <Text style={styles.sectionSubtitle}>Quão grave é este problema?</Text>
          
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.severityCard,
                selectedSeverity === level.id && styles.severityCardSelected
              ]}
              onPress={() => setSelectedSeverity(level.id)}
            >
              <View style={styles.severityInfo}>
                <View style={styles.severityHeader}>
                  <View style={[styles.severityDot, { backgroundColor: level.color }]} />
                  <Text style={[
                    styles.severityLabel,
                    selectedSeverity === level.id && styles.severityLabelSelected
                  ]}>
                    {level.label}
                  </Text>
                </View>
                <Text style={styles.severityDescription}>{level.description}</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedSeverity === level.id && styles.radioButtonSelected
              ]}>
                {selectedSeverity === level.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título do Bug *</Text>
          <Text style={styles.sectionSubtitle}>Descreva o problema em uma frase</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: App trava ao enviar mensagem"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{title.length}/100</Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do Problema *</Text>
          <Text style={styles.sectionSubtitle}>Descreva o que está acontecendo</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Descreva detalhadamente o problema que você está enfrentando..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        {/* Passos para reproduzir */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passos para Reproduzir</Text>
          <Text style={styles.sectionSubtitle}>Como podemos reproduzir este problema?</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="1. Abra a tela de chat&#10;2. Digite uma mensagem longa&#10;3. Pressione enviar&#10;4. O app trava"
            value={stepsToReproduce}
            onChangeText={setStepsToReproduce}
            multiline
            numberOfLines={4}
            maxLength={300}
          />
          <Text style={styles.characterCount}>{stepsToReproduce.length}/300</Text>
        </View>

        {/* Comportamento Esperado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comportamento Esperado</Text>
          <Text style={styles.sectionSubtitle}>O que deveria acontecer?</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="A mensagem deveria ser enviada normalmente..."
            value={expectedBehavior}
            onChangeText={setExpectedBehavior}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
          <Text style={styles.characterCount}>{expectedBehavior.length}/300</Text>
        </View>

        {/* Comportamento Atual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comportamento Atual</Text>
          <Text style={styles.sectionSubtitle}>O que está acontecendo na realidade?</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="O app trava e fecha automaticamente..."
            value={actualBehavior}
            onChangeText={setActualBehavior}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
          <Text style={styles.characterCount}>{actualBehavior.length}/300</Text>
        </View>

        {/* Configurações de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Sistema</Text>
          <Text style={styles.sectionSubtitle}>Nos ajude a diagnosticar o problema</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Incluir informações do dispositivo</Text>
              <Text style={styles.switchDescription}>Modelo, OS, versão do app</Text>
            </View>
            <Switch
              value={includeDeviceInfo}
              onValueChange={setIncludeDeviceInfo}
              trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
              thumbColor={includeDeviceInfo ? '#3b82f6' : '#9ca3af'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Incluir ID do usuário</Text>
              <Text style={styles.switchDescription}>Para acompanhar o progresso</Text>
            </View>
            <Switch
              value={includeUserInfo}
              onValueChange={setIncludeUserInfo}
              trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
              thumbColor={includeUserInfo ? '#3b82f6' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Botão de Envio */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={submitBugReport}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Ionicons name="hourglass-outline" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Enviando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="send-outline" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Enviar Relatório</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            Ao enviar este relatório, você concorda com nossos termos de uso e política de privacidade.
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
    borderLeftColor: '#ef4444',
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
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  categoryCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#3b82f6',
  },
  severityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  severityCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  severityInfo: {
    flex: 1,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  severityLabelSelected: {
    color: '#3b82f6',
  },
  severityDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
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
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  submitSection: {
    padding: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
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