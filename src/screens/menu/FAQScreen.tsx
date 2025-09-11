import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Conta',
    question: 'Como criar uma conta no SocialDev?',
    answer: 'Para criar uma conta, baixe o app e toque em "Cadastrar". Preencha seus dados pessoais e profissionais. Você receberá um email de confirmação para ativar sua conta.',
  },
  {
    id: '2',
    category: 'Conta',
    question: 'Esqueci minha senha, como recuperar?',
    answer: 'Na tela de login, toque em "Esqueci minha senha". Digite seu email cadastrado e você receberá instruções para criar uma nova senha.',
  },
  {
    id: '3',
    category: 'Perfil',
    question: 'Como atualizar meu perfil profissional?',
    answer: 'Vá para a aba "Perfil", toque em "Editar" e atualize suas informações como cargo, empresa, habilidades e experiência. Não se esqueça de salvar as alterações.',
  },
  {
    id: '4',
    category: 'Perfil',
    question: 'Posso alterar minha foto de perfil?',
    answer: 'Sim! No seu perfil, toque na foto atual e escolha "Alterar foto". Você pode usar uma foto da galeria, tirar uma nova ou escolher um avatar personalizável.',
  },
  {
    id: '5',
    category: 'Posts',
    question: 'Como criar um post no feed?',
    answer: 'Na aba "Feed", toque no botão "+" ou na área "O que você está pensando?". Digite seu conteúdo, adicione imagens se desejar e toque em "Publicar".',
  },
  {
    id: '6',
    category: 'Posts',
    question: 'Posso editar ou excluir um post após publicar?',
    answer: 'Sim! Toque nos três pontos no canto do seu post. Você pode editar o texto, adicionar/remover imagens ou excluir o post completamente.',
  },
  {
    id: '7',
    category: 'Vagas',
    question: 'Como procurar vagas de emprego?',
    answer: 'Vá para a aba "Vagas" e use os filtros de busca por localização, tipo de vaga, nível de experiência e tecnologias. Toque na vaga para ver detalhes e candidatar-se.',
  },
  {
    id: '8',
    category: 'Vagas',
    question: 'Como me candidatar a uma vaga?',
    answer: 'Abra a vaga desejada, revise os requisitos e toque em "Candidatar-se". Seus dados do perfil serão enviados automaticamente para o recrutador.',
  },
  {
    id: '9',
    category: 'Chat',
    question: 'Como enviar mensagens privadas?',
    answer: 'Vá para a aba "Chat" ou visite o perfil de alguém e toque em "Enviar mensagem". Digite sua mensagem e toque em enviar.',
  },
  {
    id: '10',
    category: 'Chat',
    question: 'Posso enviar arquivos no chat?',
    answer: 'Sim! No chat, toque no ícone de anexo (+) para enviar imagens, documentos ou outros arquivos (máximo 10MB por arquivo).',
  },
  {
    id: '11',
    category: 'IA Assistant',
    question: 'Como usar o assistente de IA?',
    answer: 'Acesse o "IA Assistant" no menu principal. Faça perguntas sobre programação, tecnologia ou carreira. A IA pode ajudar com código, dúvidas técnicas e conselhos profissionais.',
  },
  {
    id: '12',
    category: 'IA Assistant',
    question: 'A IA pode revisar meu código?',
    answer: 'Sim! Cole seu código no chat da IA e peça para revisar, explicar ou otimizar. A IA pode detectar bugs, sugerir melhorias e explicar conceitos.',
  },
  {
    id: '13',
    category: 'Notificações',
    question: 'Como controlar as notificações?',
    answer: 'Vá em "Configurações" > "Notificações". Você pode ativar/desativar notificações para curtidas, comentários, mensagens, vagas e outras atividades.',
  },
  {
    id: '14',
    category: 'Privacidade',
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Seguimos rigorosas práticas de segurança e privacidade. Seus dados são criptografados e nunca compartilhados sem sua permissão. Veja nossa Política de Privacidade para detalhes.',
  },
  {
    id: '15',
    category: 'Problemas Técnicos',
    question: 'O app está lento, o que fazer?',
    answer: 'Tente fechar e abrir o app novamente. Se persistir, verifique sua conexão com internet, atualize o app ou reinicie seu dispositivo. Entre em contato se o problema continuar.',
  },
];

const categories = ['Todos', 'Conta', 'Perfil', 'Posts', 'Vagas', 'Chat', 'IA Assistant', 'Notificações', 'Privacidade', 'Problemas Técnicos'];

export default function FAQScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar nas perguntas frequentes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesSection}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ Items */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Resultados para "${searchQuery}"` : 
             selectedCategory === 'Todos' ? 'Todas as Perguntas' : selectedCategory}
          </Text>
          <Text style={styles.resultsCount}>
            {filteredFAQ.length} pergunta{filteredFAQ.length !== 1 ? 's' : ''} encontrada{filteredFAQ.length !== 1 ? 's' : ''}
          </Text>

          {filteredFAQ.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhuma pergunta encontrada</Text>
              <Text style={styles.emptyText}>
                Tente buscar com outros termos ou selecione uma categoria diferente.
              </Text>
            </View>
          ) : (
            filteredFAQ.map((item, index) => (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.questionContainer}
                  onPress={() => toggleExpand(item.id)}
                >
                  <View style={styles.questionContent}>
                    <Text style={styles.categoryTag}>{item.category}</Text>
                    <Text style={styles.question}>{item.question}</Text>
                  </View>
                  <Ionicons 
                    name={expandedItems.includes(item.id) ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                
                {expandedItems.includes(item.id) && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Ionicons name="help-buoy-outline" size={32} color="#3b82f6" />
          <Text style={styles.helpTitle}>Não encontrou sua resposta?</Text>
          <Text style={styles.helpText}>
            Nossa equipe de suporte está sempre pronta para ajudar!
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('Support')}
          >
            <Text style={styles.contactButtonText}>Entrar em Contato</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
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
  searchSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesSection: {
    paddingBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  faqSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  questionContent: {
    flex: 1,
  },
  categoryTag: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 4,
  },
  question: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: 22,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  answer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    paddingTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  helpSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
});