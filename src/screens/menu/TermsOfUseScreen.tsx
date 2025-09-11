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

export default function TermsOfUseScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>
            Última atualização: 11 de setembro de 2024
          </Text>

          <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
          <Text style={styles.paragraph}>
            Ao acessar e usar o SocialDev, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
          </Text>

          <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
          <Text style={styles.paragraph}>
            O SocialDev é uma rede social profissional voltada para desenvolvedores e profissionais de tecnologia. Nossa plataforma oferece funcionalidades como:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Compartilhamento de posts e conteúdo técnico</Text>
            <Text style={styles.listItem}>• Busca e aplicação para vagas de emprego</Text>
            <Text style={styles.listItem}>• Chat e mensagens privadas</Text>
            <Text style={styles.listItem}>• Criação e gerenciamento de perfil profissional</Text>
            <Text style={styles.listItem}>• Assistente de IA para suporte técnico</Text>
          </View>

          <Text style={styles.sectionTitle}>3. Cadastro e Conta do Usuário</Text>
          <Text style={styles.paragraph}>
            Para usar certas funcionalidades do SocialDev, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.
          </Text>

          <Text style={styles.sectionTitle}>4. Conduta do Usuário</Text>
          <Text style={styles.paragraph}>
            Ao usar nossa plataforma, você concorda em:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Não postar conteúdo ofensivo, discriminatório ou ilegal</Text>
            <Text style={styles.listItem}>• Respeitar os direitos autorais e propriedade intelectual</Text>
            <Text style={styles.listItem}>• Não usar a plataforma para spam ou atividades maliciosas</Text>
            <Text style={styles.listItem}>• Manter um comportamento profissional e respeitoso</Text>
            <Text style={styles.listItem}>• Não se passar por outra pessoa ou empresa</Text>
          </View>

          <Text style={styles.sectionTitle}>5. Conteúdo do Usuário</Text>
          <Text style={styles.paragraph}>
            Você mantém a propriedade do conteúdo que posta no SocialDev. No entanto, ao postar conteúdo, você nos concede uma licença não exclusiva para usar, modificar, exibir e distribuir esse conteúdo na plataforma.
          </Text>

          <Text style={styles.sectionTitle}>6. Privacidade</Text>
          <Text style={styles.paragraph}>
            Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender como coletamos, usamos e protegemos suas informações pessoais.
          </Text>

          <Text style={styles.sectionTitle}>7. Propriedade Intelectual</Text>
          <Text style={styles.paragraph}>
            O SocialDev e todo o seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do SocialDev e seus licenciadores. O serviço é protegido por direitos autorais, marcas registradas e outras leis.
          </Text>

          <Text style={styles.sectionTitle}>8. Terminação</Text>
          <Text style={styles.paragraph}>
            Podemos terminar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos de Uso.
          </Text>

          <Text style={styles.sectionTitle}>9. Limitação de Responsabilidade</Text>
          <Text style={styles.paragraph}>
            Em nenhuma circunstância o SocialDev será responsável por danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar o serviço.
          </Text>

          <Text style={styles.sectionTitle}>10. Alterações aos Termos</Text>
          <Text style={styles.paragraph}>
            Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes de quaisquer novos termos entrarem em vigor.
          </Text>

          <Text style={styles.sectionTitle}>11. Contato</Text>
          <Text style={styles.paragraph}>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco em:
          </Text>
          <Text style={styles.contactInfo}>
            📧 legal@socialdev.com{'\n'}
            📱 +55 (11) 99999-9999{'\n'}
            🌐 www.socialdev.com/termos
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
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#3b82f6',
    lineHeight: 20,
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
});