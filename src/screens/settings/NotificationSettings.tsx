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

export default function NotificationSettings({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, saving } = useSelector((state: RootState) => state.settings);
  const { colors } = useTheme();

  const handleToggleSetting = (key: keyof typeof settings.notifications, value: boolean) => {
    if (user?.id) {
      dispatch(updateSetting({
        userId: user.id,
        category: 'notifications',
        key,
        value,
      }));
    }
  };

  const requestPushPermission = async () => {
    Alert.alert(
      'Permissão de Notificações',
      'Para receber notificações push, você precisa permitir nas configurações do seu dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Configurar',
          onPress: () => {
            // Aqui você pode abrir as configurações do sistema
            Alert.alert('Info', 'Vá em Configurações > Notificações > SocialDev para gerenciar as permissões.');
          }
        }
      ]
    );
  };

  const toggleAllNotifications = (enabled: boolean) => {
    const keys: (keyof typeof settings.notifications)[] = [
      'likes', 'comments', 'follows', 'messages', 'jobAlerts', 
      'postUpdates', 'connectionRequests', 'weeklyDigest'
    ];
    
    keys.forEach(key => {
      if (user?.id) {
        dispatch(updateSetting({
          userId: user.id,
          category: 'notifications',
          key,
          value: enabled,
        }));
      }
    });
  };

  const showQuietHoursInfo = () => {
    Alert.alert(
      'Horário Silencioso',
      'Durante o horário silencioso, você não receberá notificações push. Esta funcionalidade estará disponível em breve.',
      [{ text: 'OK' }]
    );
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Notificações" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Notificações" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Configurações Gerais */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações Gerais</Text>
          
          <SettingRow
            icon="notifications"
            title="Notificações Push"
            subtitle="Receber notificações no dispositivo"
            iconColor={settings.notifications.push ? '#10B981' : colors.textMuted}
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.notifications.push}
                  onValueChange={(value) => {
                    if (value) {
                      requestPushPermission();
                    }
                    handleToggleSetting('push', value);
                  }}
                  trackColor={{ false: colors.border, true: '#10B981' }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={requestPushPermission} style={styles.infoButton}>
                  <Ionicons name="settings-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="mail"
            title="Notificações por Email"
            subtitle="Receber resumos por email"
            rightComponent={
              <Switch
                value={settings.notifications.email}
                onValueChange={(value) => handleToggleSetting('email', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Interações Sociais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Interações Sociais</Text>
            <TouchableOpacity
              onPress={() => {
                const allEnabled = settings.notifications.likes && 
                                 settings.notifications.comments && 
                                 settings.notifications.follows;
                toggleAllNotifications(!allEnabled);
              }}
              style={styles.toggleAllButton}
            >
              <Text style={[styles.toggleAllText, { color: colors.primary }]}>
                Alternar Todas
              </Text>
            </TouchableOpacity>
          </View>
          
          <SettingRow
            icon="heart"
            title="Curtidas"
            subtitle="Quando alguém curtir seus posts"
            rightComponent={
              <Switch
                value={settings.notifications.likes}
                onValueChange={(value) => handleToggleSetting('likes', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="chatbubble"
            title="Comentários"
            subtitle="Quando alguém comentar em seus posts"
            rightComponent={
              <Switch
                value={settings.notifications.comments}
                onValueChange={(value) => handleToggleSetting('comments', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="person-add"
            title="Novos Seguidores"
            subtitle="Quando alguém começar a te seguir"
            rightComponent={
              <Switch
                value={settings.notifications.follows}
                onValueChange={(value) => handleToggleSetting('follows', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="people"
            title="Pedidos de Conexão"
            subtitle="Quando receber pedidos de conexão"
            rightComponent={
              <Switch
                value={settings.notifications.connectionRequests}
                onValueChange={(value) => handleToggleSetting('connectionRequests', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Mensagens e Comunicação */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mensagens e Comunicação</Text>
          
          <SettingRow
            icon="chatbubbles"
            title="Mensagens Diretas"
            subtitle="Quando receber mensagens privadas"
            rightComponent={
              <Switch
                value={settings.notifications.messages}
                onValueChange={(value) => handleToggleSetting('messages', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="document-text"
            title="Atualizações de Posts"
            subtitle="Quando posts que você interagiu receberem novos comentários"
            rightComponent={
              <Switch
                value={settings.notifications.postUpdates}
                onValueChange={(value) => handleToggleSetting('postUpdates', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Carreira e Oportunidades */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Carreira e Oportunidades</Text>
          
          <SettingRow
            icon="briefcase"
            title="Alertas de Vagas"
            subtitle="Novas vagas compatíveis com seu perfil"
            iconColor="#F59E0B"
            rightComponent={
              <Switch
                value={settings.notifications.jobAlerts}
                onValueChange={(value) => handleToggleSetting('jobAlerts', value)}
                trackColor={{ false: colors.border, true: '#F59E0B' }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Resumos e Relatórios */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumos</Text>
          
          <SettingRow
            icon="newspaper"
            title="Resumo Semanal"
            subtitle="Relatório das suas atividades da semana"
            rightComponent={
              <Switch
                value={settings.notifications.weeklyDigest}
                onValueChange={(value) => handleToggleSetting('weeklyDigest', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Configurações Avançadas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações Avançadas</Text>
          
          <SettingRow
            icon="moon"
            title="Horário Silencioso"
            subtitle="22:00 - 08:00 (Em breve)"
            rightComponent={
              <View style={styles.comingSoonContainer}>
                <Text style={[styles.comingSoonText, { color: colors.textMuted }]}>Em breve</Text>
                <TouchableOpacity onPress={showQuietHoursInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="phone-portrait"
            title="Configurações do Sistema"
            subtitle="Gerenciar nas configurações do dispositivo"
            rightComponent={
              <Ionicons name="open-outline" size={20} color={colors.textMuted} />
            }
            onPress={requestPushPermission}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  toggleAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  toggleAllText: {
    fontSize: 14,
    fontWeight: '600',
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
  comingSoonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    fontStyle: 'italic',
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