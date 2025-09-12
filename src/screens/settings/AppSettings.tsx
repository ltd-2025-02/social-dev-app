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
  Platform,
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

export default function AppSettings({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, saving } = useSelector((state: RootState) => state.settings);
  const { colors, toggleTheme } = useTheme();

  const handleToggleSetting = (key: keyof typeof settings.app, value: any) => {
    if (user?.id) {
      dispatch(updateSetting({
        userId: user.id,
        category: 'app',
        key,
        value,
      }));
    }
  };

  const showThemePicker = () => {
    const themeOptions = [
      { label: 'Claro', value: 'light' },
      { label: 'Escuro', value: 'dark' },
      { label: 'Sistema', value: 'system' },
    ];

    Alert.alert(
      'Tema do Aplicativo',
      'Escolha o tema que deseja usar:',
      [
        ...themeOptions.map(option => ({
          text: option.label,
          onPress: () => handleToggleSetting('theme', option.value),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showLanguagePicker = () => {
    const languageOptions = [
      { label: 'Português', value: 'pt' },
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es' },
    ];

    Alert.alert(
      'Idioma do Aplicativo',
      'Escolha o idioma que deseja usar:',
      [
        ...languageOptions.map(option => ({
          text: option.label,
          onPress: () => handleToggleSetting('language', option.value),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showDataUsagePicker = () => {
    const dataOptions = [
      { label: 'Baixo', value: 'low', description: 'Menor qualidade, economia de dados' },
      { label: 'Médio', value: 'medium', description: 'Qualidade equilibrada' },
      { label: 'Alto', value: 'high', description: 'Máxima qualidade' },
    ];

    Alert.alert(
      'Uso de Dados',
      'Escolha a qualidade de mídia que deseja:',
      [
        ...dataOptions.map(option => ({
          text: `${option.label} - ${option.description}`,
          onPress: () => handleToggleSetting('dataUsage', option.value),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showSyncFrequencyPicker = () => {
    const syncOptions = [
      { label: 'Tempo Real', value: 'real-time' },
      { label: 'A Cada Hora', value: 'hourly' },
      { label: 'Diário', value: 'daily' },
    ];

    Alert.alert(
      'Frequência de Sincronização',
      'Escolha com que frequência sincronizar dados:',
      [
        ...syncOptions.map(option => ({
          text: option.label,
          onPress: () => handleToggleSetting('syncFrequency', option.value),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showCacheSizePicker = () => {
    const sizeOptions = [
      { label: '50 MB', value: 50 },
      { label: '100 MB', value: 100 },
      { label: '200 MB', value: 200 },
      { label: '500 MB', value: 500 },
    ];

    Alert.alert(
      'Tamanho do Cache',
      'Escolha o tamanho máximo do cache:',
      [
        ...sizeOptions.map(option => ({
          text: option.label,
          onPress: () => handleToggleSetting('cacheSize', option.value),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const clearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover todos os dados temporários salvos no aplicativo. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          }
        }
      ]
    );
  };

  const getThemeLabel = () => {
    const themes = { light: 'Claro', dark: 'Escuro', system: 'Sistema' };
    return themes[settings?.app.theme] || 'Sistema';
  };

  const getLanguageLabel = () => {
    const languages = { pt: 'Português', en: 'English', es: 'Español' };
    return languages[settings?.app.language] || 'Português';
  };

  const getDataUsageLabel = () => {
    const usages = { low: 'Baixo', medium: 'Médio', high: 'Alto' };
    return usages[settings?.app.dataUsage] || 'Médio';
  };

  const getSyncFrequencyLabel = () => {
    const frequencies = { 'real-time': 'Tempo Real', 'hourly': 'A Cada Hora', 'daily': 'Diário' };
    return frequencies[settings?.app.syncFrequency] || 'Tempo Real';
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Configurações do App" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Configurações do App" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Aparência */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
          
          <SettingRow
            icon="contrast"
            title="Tema"
            subtitle={getThemeLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showThemePicker}
          />
        </View>

        {/* Idioma e Região */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Idioma e Região</Text>
          
          <SettingRow
            icon="language"
            title="Idioma"
            subtitle={getLanguageLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showLanguagePicker}
          />
        </View>

        {/* Dados e Sincronização */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dados e Sincronização</Text>
          
          <SettingRow
            icon="cloud-download"
            title="Download Automático de Imagens"
            subtitle="Baixar imagens automaticamente"
            rightComponent={
              <Switch
                value={settings.app.autoDownloadImages}
                onValueChange={(value) => handleToggleSetting('autoDownloadImages', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="videocam"
            title="Download Automático de Vídeos"
            subtitle="Baixar vídeos automaticamente"
            rightComponent={
              <Switch
                value={settings.app.autoDownloadVideos}
                onValueChange={(value) => handleToggleSetting('autoDownloadVideos', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="cellular"
            title="Qualidade de Dados"
            subtitle={getDataUsageLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showDataUsagePicker}
          />

          <SettingRow
            icon="sync"
            title="Frequência de Sincronização"
            subtitle={getSyncFrequencyLabel()}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showSyncFrequencyPicker}
          />
        </View>

        {/* Armazenamento e Cache */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Armazenamento</Text>
          
          <SettingRow
            icon="server"
            title="Tamanho do Cache"
            subtitle={`${settings.app.cacheSize} MB`}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showCacheSizePicker}
          />

          <SettingRow
            icon="trash"
            title="Limpar Cache"
            subtitle="Remover dados temporários"
            iconColor={colors.error}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            }
            onPress={clearCache}
          />
        </View>

        {/* Desenvolvimento (Debug) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Avançado</Text>
          
          <SettingRow
            icon="bug"
            title="Modo Desenvolvedor"
            subtitle="Ativar logs de debug"
            rightComponent={
              <Switch
                value={false}
                onValueChange={() => {
                  Alert.alert(
                    'Modo Desenvolvedor',
                    'Esta funcionalidade estará disponível em breve.',
                    [{ text: 'OK' }]
                  );
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={true}
              />
            }
          />

          <SettingRow
            icon="information-circle"
            title="Informações do Sistema"
            subtitle="Ver detalhes técnicos"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => {
              Alert.alert(
                'Informações do Sistema',
                `Versão: 1.0.0\nPlataforma: ${Platform.OS}\nCache: ${settings.app.cacheSize}MB\nSincronização: ${getSyncFrequencyLabel()}`,
                [{ text: 'OK' }]
              );
            }}
          />
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance</Text>
          
          <View style={[styles.performanceCard, { backgroundColor: colors.surface }]}>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: colors.textMuted }]}>
                Cache Usado
              </Text>
              <Text style={[styles.performanceValue, { color: colors.text }]}>
                {Math.floor(settings.app.cacheSize * 0.3)} MB / {settings.app.cacheSize} MB
              </Text>
            </View>
            
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: '30%'
                  }
                ]} 
              />
            </View>
          </View>
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
  performanceCard: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceLabel: {
    fontSize: 14,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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