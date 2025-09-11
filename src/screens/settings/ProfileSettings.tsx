import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
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
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  rightComponent,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
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

export default function ProfileSettings({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, saving } = useSelector((state: RootState) => state.settings);
  const { colors } = useTheme();

  const [visibilityOptions] = useState([
    { label: 'Público', value: 'public', description: 'Qualquer pessoa pode ver seu perfil' },
    { label: 'Conexões', value: 'connections', description: 'Apenas suas conexões podem ver' },
    { label: 'Privado', value: 'private', description: 'Apenas você pode ver seu perfil' },
  ]);

  const [messagesOptions] = useState([
    { label: 'Todos', value: 'everyone', description: 'Qualquer pessoa pode enviar mensagens' },
    { label: 'Conexões', value: 'connections', description: 'Apenas conexões podem enviar mensagens' },
    { label: 'Ninguém', value: 'none', description: 'Ninguém pode enviar mensagens' },
  ]);

  const handleToggleSetting = (key: keyof typeof settings.profile, value: boolean) => {
    if (user?.id) {
      dispatch(updateSetting({
        userId: user.id,
        category: 'profile',
        key,
        value,
      }));
    }
  };

  const showVisibilityPicker = () => {
    Alert.alert(
      'Visibilidade do Perfil',
      'Escolha quem pode ver seu perfil:',
      [
        ...visibilityOptions.map(option => ({
          text: option.label,
          onPress: () => {
            if (user?.id) {
              dispatch(updateSetting({
                userId: user.id,
                category: 'profile',
                key: 'visibility',
                value: option.value,
              }));
            }
          },
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showMessagesPicker = () => {
    Alert.alert(
      'Quem pode enviar mensagens',
      'Escolha quem pode te enviar mensagens:',
      [
        ...messagesOptions.map(option => ({
          text: option.label,
          onPress: () => {
            if (user?.id) {
              dispatch(updateSetting({
                userId: user.id,
                category: 'profile',
                key: 'allowMessages',
                value: option.value,
              }));
            }
          },
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const getVisibilityLabel = () => {
    const option = visibilityOptions.find(opt => opt.value === settings?.profile.visibility);
    return option?.label || 'Público';
  };

  const getMessagesLabel = () => {
    const option = messagesOptions.find(opt => opt.value === settings?.profile.allowMessages);
    return option?.label || 'Conexões';
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Configurações de Perfil" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Configurações de Perfil" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Visibilidade do Perfil */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Visibilidade</Text>
          
          <SettingRow
            icon="eye"
            title="Visibilidade do Perfil"
            subtitle={getVisibilityLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showVisibilityPicker}
          />

          <SettingRow
            icon="globe"
            title="Mostrar Status Online"
            subtitle="Outros usuários podem ver quando você está online"
            rightComponent={
              <Switch
                value={settings.profile.showOnlineStatus}
                onValueChange={(value) => handleToggleSetting('showOnlineStatus', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Informações Visíveis */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Visíveis</Text>
          
          <SettingRow
            icon="mail"
            title="Mostrar Email"
            subtitle="Seu email será visível no perfil"
            rightComponent={
              <Switch
                value={settings.profile.showEmail}
                onValueChange={(value) => handleToggleSetting('showEmail', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="call"
            title="Mostrar Telefone"
            subtitle="Seu telefone será visível no perfil"
            rightComponent={
              <Switch
                value={settings.profile.showPhone}
                onValueChange={(value) => handleToggleSetting('showPhone', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="location"
            title="Mostrar Localização"
            subtitle="Sua cidade será visível no perfil"
            rightComponent={
              <Switch
                value={settings.profile.showLocation}
                onValueChange={(value) => handleToggleSetting('showLocation', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Comunicação */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Comunicação</Text>
          
          <SettingRow
            icon="chatbubbles"
            title="Permitir Mensagens"
            subtitle={getMessagesLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showMessagesPicker}
          />

          <SettingRow
            icon="people"
            title="Permitir Conexões"
            subtitle="Outros usuários podem te enviar pedidos de conexão"
            rightComponent={
              <Switch
                value={settings.profile.allowConnections}
                onValueChange={(value) => handleToggleSetting('allowConnections', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
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