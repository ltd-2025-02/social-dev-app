import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateSetting } from '../../store/slices/settingsSlice';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  iconColor?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  rightComponent,
  onPress,
  iconColor,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (iconColor || colors.primary) + '15' }]}>
          <Ionicons name={icon as any} size={20} color={iconColor || colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent && (
        <View style={styles.settingRight}>
          {rightComponent}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function PrivacySettings({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, saving } = useSelector((state: RootState) => state.settings);
  const { colors } = useTheme();

  const handleToggleSetting = (key: keyof typeof settings.privacy, value: boolean) => {
    if (user?.id) {
      dispatch(updateSetting({
        userId: user.id,
        category: 'privacy',
        key,
        value,
      }));
    }
  };

  const showTwoFactorInfo = () => {
    Alert.alert(
      'Autenticação de Dois Fatores',
      'A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta. Quando habilitada, você precisará inserir um código adicional além da sua senha.',
      [
        {
          text: 'Configurar',
          onPress: () => {
            Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const showDataInfo = () => {
    Alert.alert(
      'Coleta de Dados',
      'Permitimos a coleta de dados de uso para melhorar a experiência do aplicativo. Seus dados pessoais sempre permanecerão privados e seguros.',
      [{ text: 'OK' }]
    );
  };

  const showAnalyticsInfo = () => {
    Alert.alert(
      'Analytics',
      'Coletamos dados anônimos sobre como você usa o aplicativo para melhorar nossos serviços. Nenhuma informação pessoal é compartilhada.',
      [{ text: 'OK' }]
    );
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Privacidade e Dados" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Privacidade e Dados" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Dados e Privacidade */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Coleta de Dados</Text>
          
          <SettingRow
            icon="analytics"
            title="Coleta de Dados de Uso"
            subtitle="Permitir coleta de dados para melhorar o app"
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.privacy.dataCollection}
                  onValueChange={(value) => handleToggleSetting('dataCollection', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={showDataInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="bar-chart"
            title="Analytics"
            subtitle="Dados anônimos para melhorar os serviços"
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.privacy.analytics}
                  onValueChange={(value) => handleToggleSetting('analytics', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={showAnalyticsInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="mail"
            title="Emails de Marketing"
            subtitle="Receber emails sobre novidades e promoções"
            rightComponent={
              <Switch
                value={settings.privacy.marketingEmails}
                onValueChange={(value) => handleToggleSetting('marketingEmails', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Segurança</Text>
          
          <SettingRow
            icon="shield-checkmark"
            title="Autenticação de Dois Fatores"
            subtitle={settings.privacy.twoFactorAuth ? 'Ativada' : 'Desativada'}
            iconColor={settings.privacy.twoFactorAuth ? '#10B981' : colors.primary}
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.privacy.twoFactorAuth}
                  onValueChange={(value) => {
                    if (value) {
                      showTwoFactorInfo();
                    } else {
                      handleToggleSetting('twoFactorAuth', false);
                    }
                  }}
                  trackColor={{ false: colors.border, true: '#10B981' }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={showTwoFactorInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="notifications"
            title="Notificações de Login"
            subtitle="Ser notificado sobre novos logins na conta"
            rightComponent={
              <Switch
                value={settings.privacy.loginNotifications}
                onValueChange={(value) => handleToggleSetting('loginNotifications', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações</Text>
          
          <SettingRow
            icon="document-text"
            title="Política de Privacidade"
            subtitle="Leia nossa política de privacidade completa"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />

          <SettingRow
            icon="shield-outline"
            title="Termos de Uso"
            subtitle="Leia nossos termos de uso"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => navigation.navigate('TermsOfService')}
          />

          <SettingRow
            icon="download"
            title="Baixar Meus Dados"
            subtitle="Solicitar uma cópia dos seus dados"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => {
              Alert.alert(
                'Baixar Dados',
                'Você receberá um email com seus dados em até 30 dias.',
                [{ text: 'OK' }]
              );
            }}
          />
        </View>

        {/* Zona de Perigo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Zona de Perigo</Text>
          
          <SettingRow
            icon="trash"
            title="Excluir Todos os Dados"
            subtitle="Remover permanentemente todos os seus dados"
            iconColor={colors.error}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            }
            onPress={() => {
              Alert.alert(
                'Excluir Todos os Dados',
                'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos de nossos servidores.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
                    }
                  }
                ]
              );
            }}
          />
        </View>

        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.savingText, { color: colors.textMuted }]}>
              Salvando alterações...
            </Text>
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    marginLeft: 8,
    padding: 4,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  savingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});