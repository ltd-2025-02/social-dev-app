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

export default function ContentSettings({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, saving } = useSelector((state: RootState) => state.settings);
  const { colors } = useTheme();

  const handleToggleSetting = (key: keyof typeof settings.content, value: boolean) => {
    if (user?.id) {
      dispatch(updateSetting({
        userId: user.id,
        category: 'content',
        key,
        value,
      }));
    }
  };

  const showMaturityFilterInfo = () => {
    Alert.alert(
      'Filtro de Maturidade',
      'O filtro de maturidade oculta conteúdo que pode ser inadequado para menores de idade. Quando ativo, posts com linguagem adulta, violência ou conteúdo sensível serão filtrados.',
      [{ text: 'OK' }]
    );
  };

  const showSensitiveContentInfo = () => {
    Alert.alert(
      'Conteúdo Sensível',
      'Esta configuração oculta conteúdo que pode ser perturbador ou controverso, incluindo discussões sobre temas delicados ou imagens que podem causar desconforto.',
      [{ text: 'OK' }]
    );
  };

  const showContentPreferences = () => {
    Alert.alert(
      'Preferências de Conteúdo',
      'Personalize os tipos de conteúdo que deseja ver no seu feed:',
      [
        {
          text: 'Tecnologia',
          onPress: () => {
            Alert.alert('Em breve', 'Personalização de tópicos estará disponível em breve.');
          }
        },
        {
          text: 'Carreira',
          onPress: () => {
            Alert.alert('Em breve', 'Personalização de tópicos estará disponível em breve.');
          }
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const showBlockedUsers = () => {
    Alert.alert(
      'Usuários Bloqueados',
      'Você não possui usuários bloqueados no momento.',
      [{ text: 'OK' }]
    );
  };

  const showBlockedWords = () => {
    Alert.alert(
      'Palavras Bloqueadas',
      'Gerencie palavras e frases que deseja filtrar do seu feed.',
      [
        {
          text: 'Adicionar Palavra',
          onPress: () => {
            Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Configurações de Conteúdo" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Configurações de Conteúdo" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Filtros de Conteúdo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filtros de Conteúdo</Text>
          
          <SettingRow
            icon="shield-checkmark"
            title="Filtro de Maturidade"
            subtitle="Ocultar conteúdo inadequado para menores"
            iconColor={settings.content.maturityFilter ? '#10B981' : colors.textMuted}
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.content.maturityFilter}
                  onValueChange={(value) => handleToggleSetting('maturityFilter', value)}
                  trackColor={{ false: colors.border, true: '#10B981' }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={showMaturityFilterInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />

          <SettingRow
            icon="eye-off"
            title="Ocultar Conteúdo Sensível"
            subtitle="Filtrar conteúdo perturbador ou controverso"
            rightComponent={
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.content.hideSensitiveContent}
                  onValueChange={(value) => handleToggleSetting('hideSensitiveContent', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                  disabled={saving}
                />
                <TouchableOpacity onPress={showSensitiveContentInfo} style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            }
          />
        </View>

        {/* Mídia e Reprodução */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mídia e Reprodução</Text>
          
          <SettingRow
            icon="play-circle"
            title="Reprodução Automática de Vídeos"
            subtitle="Vídeos começam a tocar automaticamente"
            rightComponent={
              <Switch
                value={settings.content.autoPlayVideos}
                onValueChange={(value) => handleToggleSetting('autoPlayVideos', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Visualização e Layout */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Visualização</Text>
          
          <SettingRow
            icon="time"
            title="Mostrar Tempo de Leitura"
            subtitle="Exibir tempo estimado de leitura em posts longos"
            rightComponent={
              <Switch
                value={settings.content.showReadingTime}
                onValueChange={(value) => handleToggleSetting('showReadingTime', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />

          <SettingRow
            icon="list"
            title="Visualização Compacta"
            subtitle="Mostrar mais posts na tela com layout condensado"
            rightComponent={
              <Switch
                value={settings.content.compactView}
                onValueChange={(value) => handleToggleSetting('compactView', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={saving}
              />
            }
          />
        </View>

        {/* Preferências de Conteúdo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferências</Text>
          
          <SettingRow
            icon="heart"
            title="Tópicos de Interesse"
            subtitle="Personalizar tipos de conteúdo no feed"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showContentPreferences}
          />

          <SettingRow
            icon="trending-up"
            title="Conteúdo em Alta"
            subtitle="Mostrar posts populares primeiro"
            rightComponent={
              <Switch
                value={true}
                onValueChange={() => {
                  Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={true}
              />
            }
          />
        </View>

        {/* Bloqueios e Filtros */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bloqueios e Filtros</Text>
          
          <SettingRow
            icon="person-remove"
            title="Usuários Bloqueados"
            subtitle="Gerenciar usuários que você bloqueou"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showBlockedUsers}
          />

          <SettingRow
            icon="text"
            title="Palavras Bloqueadas"
            subtitle="Filtrar posts com palavras específicas"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={showBlockedWords}
          />
        </View>

        {/* Relatórios e Moderação */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Moderação</Text>
          
          <SettingRow
            icon="flag"
            title="Histórico de Denúncias"
            subtitle="Ver posts e usuários que você denunciou"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => {
              Alert.alert('Histórico Vazio', 'Você não fez nenhuma denúncia ainda.');
            }}
          />

          <SettingRow
            icon="help-circle"
            title="Diretrizes da Comunidade"
            subtitle="Leia nossas regras de conduta"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            }
            onPress={() => navigation.navigate('CommunityGuidelines')}
          />
        </View>

        {/* Estatísticas de Conteúdo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Estatísticas</Text>
          
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Posts visualizados hoje
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                47
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Conteúdo filtrado
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {settings.content.maturityFilter || settings.content.hideSensitiveContent ? '3' : '0'}
              </Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    marginLeft: 8,
    padding: 4,
  },
  statsCard: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
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