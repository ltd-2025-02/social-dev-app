
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { loadSettings, updateSetting, resetSettings, exportSettings } from '../../store/slices/settingsSlice';
import { signOut } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  rightComponent,
  showArrow = true,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingsItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingsItemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {value && (
          <Text style={[styles.settingsItemValue, { color: colors.textMuted }]}>
            {value}
          </Text>
        )}
        {rightComponent || (showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, loading, saving, error } = useSelector((state: RootState) => state.settings);
  const { colors, isDark, toggleTheme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(loadSettings(user.id));
    }
  }, [dispatch, user?.id]);

  const onRefresh = async () => {
    if (user?.id) {
      setRefreshing(true);
      await dispatch(loadSettings(user.id));
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => dispatch(signOut()),
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Isso irá restaurar todas as configurações para os valores padrão. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            if (user?.id) {
              dispatch(resetSettings(user.id));
            }
          },
        },
      ]
    );
  };

  const handleExportSettings = async () => {
    try {
      if (user?.id) {
        const result = await dispatch(exportSettings(user.id)).unwrap();
        await Share.share({
          message: result,
          title: 'Configurações do SocialDev',
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar as configurações');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente deletados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar exclusão de conta
            Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
          },
        },
      ]
    );
  };

  if (loading && !settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Configurações" showBackButton={true} minimal={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando configurações...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Configurações" showBackButton={true} minimal={true} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* User Info Section */}
        <View style={styles.section}>
          <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
            <View style={styles.userInfo}>
              <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.userAvatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.name || 'Usuário'}
                </Text>
                <Text style={[styles.userEmail, { color: colors.textMuted }]}>
                  {user?.email || 'email@exemplo.com'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acesso Rápido</Text>
          
          <SettingsItem
            icon="moon"
            title="Tema Escuro"
            subtitle="Alternar entre modo claro e escuro"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
            showArrow={false}
          />

          <SettingsItem
            icon="notifications"
            title="Notificações"
            subtitle="Gerenciar notificações push"
            value={settings?.notifications.push ? 'Ativadas' : 'Desativadas'}
            onPress={() => navigation.navigate('NotificationSettings')}
          />

          <SettingsItem
            icon="shield-checkmark"
            title="Privacidade"
            subtitle="Controle de privacidade e dados"
            onPress={() => navigation.navigate('PrivacySettings')}
          />
        </View>

        {/* Main Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações</Text>
          
          <SettingsItem
            icon="person"
            title="Perfil"
            subtitle="Visibilidade e informações do perfil"
            onPress={() => navigation.navigate('ProfileSettings')}
          />

          <SettingsItem
            icon="phone-portrait"
            title="Aplicativo"
            subtitle="Idioma, cache e sincronização"
            onPress={() => navigation.navigate('AppSettings')}
          />

          <SettingsItem
            icon="document-text"
            title="Conteúdo"
            subtitle="Filtros e preferências de conteúdo"
            onPress={() => navigation.navigate('ContentSettings')}
          />

          <SettingsItem
            icon="help-circle"
            title="Ajuda e Suporte"
            subtitle="FAQ, contato e documentação"
            onPress={() => navigation.navigate('Support')}
          />
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Avançado</Text>
          
          <SettingsItem
            icon="download"
            title="Exportar Configurações"
            subtitle="Backup das suas configurações"
            onPress={handleExportSettings}
          />

          <SettingsItem
            icon="refresh"
            title="Resetar Configurações"
            subtitle="Restaurar valores padrão"
            onPress={handleResetSettings}
          />

          <SettingsItem
            icon="information-circle"
            title="Sobre o App"
            subtitle="Versão 1.0.0"
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Zona de Perigo</Text>
          
          <SettingsItem
            icon="log-out"
            title="Sair da Conta"
            subtitle="Fazer logout do aplicativo"
            onPress={handleLogout}
            showArrow={false}
          />

          <SettingsItem
            icon="trash"
            title="Excluir Conta"
            subtitle="Deletar permanentemente sua conta"
            onPress={handleDeleteAccount}
            showArrow={false}
          />
        </View>

        {/* Status */}
        {settings && (
          <View style={styles.statusSection}>
            <Text style={[styles.statusText, { color: colors.textMuted }]}>
              {saving ? 'Salvando...' : 'Todas as alterações são salvas automaticamente'}
            </Text>
            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}
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
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItem: {
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
  settingsItemLeft: {
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
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemValue: {
    fontSize: 14,
    marginRight: 8,
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
