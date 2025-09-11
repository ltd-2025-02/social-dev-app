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

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>
            Última atualização: 11 de setembro de 2024
          </Text>

          <Text style={styles.introText}>
            Esta Política de Privacidade descreve como o SocialDev coleta, usa e protege suas informações pessoais quando você usa nossa plataforma.
          </Text>

          <Text style={styles.sectionTitle}>1. Informações que Coletamos</Text>
          
          <Text style={styles.subsectionTitle}>1.1 Informações Fornecidas por Você</Text>
          <Text style={styles.paragraph}>
            Coletamos informações que você nos fornece diretamente, incluindo:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Nome completo e informações de perfil</Text>
            <Text style={styles.listItem}>• Endereço de e-mail e número de telefone</Text>
            <Text style={styles.listItem}>• Informações profissionais (cargo, empresa, habilidades)</Text>
            <Text style={styles.listItem}>• Conteúdo que você posta (textos, imagens, vídeos)</Text>
            <Text style={styles.listItem}>• Mensagens e comunicações na plataforma</Text>
          </View>

          <Text style={styles.subsectionTitle}>1.2 Informações Coletadas Automaticamente</Text>
          <Text style={styles.paragraph}>
            Quando você usa nossa plataforma, coletamos automaticamente:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Informações do dispositivo (modelo, sistema operacional)</Text>
            <Text style={styles.listItem}>• Dados de uso (páginas visitadas, tempo gasto)</Text>
            <Text style={styles.listItem}>• Endereço IP e localização aproximada</Text>
            <Text style={styles.listItem}>• Cookies e tecnologias similares</Text>
          </View>

          <Text style={styles.sectionTitle}>2. Como Usamos Suas Informações</Text>
          <Text style={styles.paragraph}>
            Utilizamos suas informações para:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Fornecer e melhorar nossos serviços</Text>
            <Text style={styles.listItem}>• Personalizar sua experiência na plataforma</Text>
            <Text style={styles.listItem}>• Facilitar conexões com outros usuários</Text>
            <Text style={styles.listItem}>• Enviar notificações e atualizações importantes</Text>
            <Text style={styles.listItem}>• Prevenir fraude e garantir segurança</Text>
            <Text style={styles.listItem}>• Cumprir obrigações legais</Text>
          </View>

          <Text style={styles.sectionTitle}>3. Compartilhamento de Informações</Text>
          <Text style={styles.paragraph}>
            Não vendemos suas informações pessoais. Podemos compartilhar suas informações em situações específicas:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Com outros usuários (informações do perfil público)</Text>
            <Text style={styles.listItem}>• Com prestadores de serviços terceirizados</Text>
            <Text style={styles.listItem}>• Por exigência legal ou ordem judicial</Text>
            <Text style={styles.listItem}>• Para proteger nossos direitos e segurança</Text>
          </View>

          <Text style={styles.sectionTitle}>4. Segurança dos Dados</Text>
          <Text style={styles.paragraph}>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Criptografia de dados em trânsito e em repouso</Text>
            <Text style={styles.listItem}>• Controles de acesso rigorosos</Text>
            <Text style={styles.listItem}>• Monitoramento contínuo de segurança</Text>
            <Text style={styles.listItem}>• Auditorias regulares de segurança</Text>
          </View>

          <Text style={styles.sectionTitle}>5. Seus Direitos</Text>
          <Text style={styles.paragraph}>
            Você tem os seguintes direitos em relação às suas informações pessoais:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Acessar suas informações pessoais</Text>
            <Text style={styles.listItem}>• Corrigir informações imprecisas</Text>
            <Text style={styles.listItem}>• Solicitar exclusão de seus dados</Text>
            <Text style={styles.listItem}>• Restringir o processamento de dados</Text>
            <Text style={styles.listItem}>• Portabilidade dos dados</Text>
            <Text style={styles.listItem}>• Retirar consentimento a qualquer momento</Text>
          </View>

          <Text style={styles.sectionTitle}>6. Retenção de Dados</Text>
          <Text style={styles.paragraph}>
            Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
          </Text>

          <Text style={styles.sectionTitle}>7. Cookies e Tecnologias Similares</Text>
          <Text style={styles.paragraph}>
            Usamos cookies e tecnologias similares para melhorar sua experiência, analisar uso da plataforma e personalizar conteúdo. Você pode controlar cookies através das configurações do seu navegador.
          </Text>

          <Text style={styles.sectionTitle}>8. Transferências Internacionais</Text>
          <Text style={styles.paragraph}>
            Suas informações podem ser transferidas e processadas em países diferentes do seu país de residência. Garantimos proteção adequada através de cláusulas contratuais padrão ou outros mecanismos aprovados.
          </Text>

          <Text style={styles.sectionTitle}>9. Menores de Idade</Text>
          <Text style={styles.paragraph}>
            Nossos serviços não são direcionados a menores de 13 anos. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se descobrirmos tal coleta, excluiremos as informações imediatamente.
          </Text>

          <Text style={styles.sectionTitle}>10. Alterações na Política</Text>
          <Text style={styles.paragraph}>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através da plataforma ou por e-mail. Recomendamos revisar esta política regularmente.
          </Text>

          <Text style={styles.sectionTitle}>11. Contato</Text>
          <Text style={styles.paragraph}>
            Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato conosco:
          </Text>
          <Text style={styles.contactInfo}>
            📧 privacy@socialdev.com{'\n'}
            📱 +55 (11) 99999-9999{'\n'}
            🌐 www.socialdev.com/privacidade{'\n'}
            📍 São Paulo, SP - Brasil
          </Text>

          <View style={styles.highlightBox}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>Seu Controle, Nossa Prioridade</Text>
              <Text style={styles.highlightText}>
                Você tem controle total sobre suas informações. Entre em contato conosco a qualquer momento para exercer seus direitos de privacidade.
              </Text>
            </View>
          </View>
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
    marginBottom: 16,
    fontStyle: 'italic',
  },
  introText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'justify',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 6,
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
    marginBottom: 20,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    marginTop: 16,
  },
  highlightContent: {
    marginLeft: 12,
    flex: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },
});