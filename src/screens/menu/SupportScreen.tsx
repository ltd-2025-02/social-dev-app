import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen({ navigation }: any) {
  const supportOptions = [
    { 
      id: 'faq',
      icon: 'help-circle-outline', 
      title: 'FAQ', 
      subtitle: 'Perguntas frequentes', 
      color: '#3b82f6' 
    },
    { 
      id: 'chat',
      icon: 'chatbubbles-outline', 
      title: 'Chat ao Vivo', 
      subtitle: 'Suporte em tempo real', 
      color: '#10b981' 
    },
    { 
      id: 'email',
      icon: 'mail-outline', 
      title: 'Email', 
      subtitle: 'suporte@socialdev.com', 
      color: '#f59e0b' 
    },
    { 
      id: 'phone',
      icon: 'call-outline', 
      title: 'Telefone', 
      subtitle: '+55 (11) 99999-9999', 
      color: '#ef4444' 
    },
    { 
      id: 'bug',
      icon: 'bug-outline', 
      title: 'Reportar Bug', 
      subtitle: 'Encontrou um problema?', 
      color: '#8b5cf6' 
    },
    { 
      id: 'feature',
      icon: 'bulb-outline', 
      title: 'Sugerir Funcionalidade', 
      subtitle: 'Sua ideia é importante', 
      color: '#06b6d4' 
    },
  ];

  const handleSupportOption = async (optionId: string) => {
    switch (optionId) {
      case 'faq':
        navigation.navigate('FAQ');
        break;
      
      case 'chat':
        navigation.navigate('LiveChat');
        break;
      
      case 'email':
        try {
          const emailUrl = 'mailto:suporte@socialdev.com?subject=Suporte SocialDev&body=Descreva aqui seu problema ou dúvida...';
          const canOpen = await Linking.canOpenURL(emailUrl);
          if (canOpen) {
            await Linking.openURL(emailUrl);
          } else {
            Alert.alert(
              'Email não disponível',
              'Não foi possível abrir o cliente de email. Envie um email para: suporte@socialdev.com',
              [{ text: 'OK' }]
            );
          }
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível abrir o email.');
        }
        break;
      
      case 'phone':
        Alert.alert(
          'Suporte por Telefone',
          'Deseja ligar para nosso suporte?\n\n📞 +55 (11) 99999-9999\n\nHorário de atendimento:\nSegunda a Sexta: 9h às 18h\nSábado: 9h às 14h',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Ligar',
              onPress: async () => {
                try {
                  const phoneUrl = 'tel:+5511999999999';
                  const canOpen = await Linking.canOpenURL(phoneUrl);
                  if (canOpen) {
                    await Linking.openURL(phoneUrl);
                  } else {
                    Alert.alert('Erro', 'Não foi possível fazer a ligação.');
                  }
                } catch (error) {
                  Alert.alert('Erro', 'Não foi possível fazer a ligação.');
                }
              }
            }
          ]
        );
        break;
      
      case 'bug':
        navigation.navigate('BugReport');
        break;
      
      case 'feature':
        navigation.navigate('FeatureSuggestion');
        break;
      
      default:
        Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como podemos ajudar?</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha a opção que melhor atende sua necessidade
          </Text>
          
          {supportOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionCard}
              onPress={() => handleSupportOption(option.id)}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="headset-outline" size={48} color="#3b82f6" />
          <Text style={styles.contactTitle}>Precisa de ajuda?</Text>
          <Text style={styles.contactText}>
            Nossa equipe está sempre pronta para ajudar você a ter a melhor experiência no SocialDev.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  content: { flex: 1 },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: { flex: 1 },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  contactCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});