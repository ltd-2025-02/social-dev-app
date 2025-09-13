import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const useThemedStyles = () => {
  const { colors, isDark } = useTheme();

  return useMemo(() => {
    return StyleSheet.create({
      // Common container styles
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      screenContainer: {
        flex: 1,
        backgroundColor: colors.background,
      },
      
      // Card styles
      card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        margin: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      
      // Surface styles
      surface: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
      },
      
      // Text styles
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
      },
      
      text: {
        fontSize: 16,
        color: colors.text,
      },
      
      textSecondary: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      
      textMuted: {
        fontSize: 12,
        color: colors.textMuted,
      },
      
      // Button styles
      button: {
        backgroundColor: colors.buttonBackground,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.buttonText,
      },
      
      // Input styles
      input: {
        backgroundColor: colors.inputBackground,
        borderColor: colors.inputBorder,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.inputText,
      },
      
      // Header styles
      header: {
        backgroundColor: colors.headerBackground,
        paddingVertical: 16,
        paddingHorizontal: 20,
      },
      
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.headerText,
      },
      
      // List item styles
      listItem: {
        backgroundColor: colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      
      // Dracula specific styles
      purpleBackground: {
        backgroundColor: colors.purple,
      },
      
      pinkBackground: {
        backgroundColor: colors.pink,
      },
      
      cyanBackground: {
        backgroundColor: colors.cyan,
      },
      
      greenBackground: {
        backgroundColor: colors.green,
      },
      
      orangeBackground: {
        backgroundColor: colors.orange,
      },
      
      redBackground: {
        backgroundColor: colors.red,
      },
      
      yellowBackground: {
        backgroundColor: colors.yellow,
      },
      
      // Accent styles
      accentText: {
        color: colors.accent,
        fontWeight: '600',
      },
      
      // Gradient alternatives for dark theme
      gradientHeader: {
        backgroundColor: isDark ? colors.surface : colors.primary,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
      },
      
      // Special Dracula combinations
      draculaCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        margin: 16,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.5 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      
      // Icon containers with Dracula colors
      iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `${colors.primary}20`,
      },
      
      // Status colors
      successContainer: {
        backgroundColor: `${colors.success}20`,
        borderColor: colors.success,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
      },
      
      warningContainer: {
        backgroundColor: `${colors.warning}20`,
        borderColor: colors.warning,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
      },
      
      errorContainer: {
        backgroundColor: `${colors.error}20`,
        borderColor: colors.error,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
      },
      
      infoContainer: {
        backgroundColor: `${colors.info}20`,
        borderColor: colors.info,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
      },
    });
  }, [colors, isDark]);
};

// Hook específico para estilos de ProfileScreen
export const useProfileScreenStyles = () => {
  const { colors, isDark } = useTheme();
  
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      profileHeader: {
        backgroundColor: colors.surface,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
      },
      headerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginBottom: 20,
      },
      headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? `${colors.purple}30` : 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      profileInfo: {
        alignItems: 'center',
      },
      profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: colors.purple,
      },
      profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
      },
      profileOccupation: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 4,
      },
      profileCompany: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: 8,
      },
      profileLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      profileLocationText: {
        fontSize: 14,
        color: colors.textMuted,
      },
      statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 16,
        padding: 20,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
      },
      statItem: {
        flex: 1,
        alignItems: 'center',
      },
      statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 8,
      },
      statLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 4,
      },
      bioSection: {
        margin: 16,
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
      },
      bioText: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.textSecondary,
      },
      skillsSection: {
        margin: 16,
        marginTop: 0,
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
      },
      skillItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      },
      skillItemName: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
      },
      skillBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
      },
      skillBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
      },
      actionsSection: {
        margin: 16,
        marginTop: 0,
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
      },
      actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      },
      actionSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 2,
      },
      activitySection: {
        margin: 16,
        marginTop: 0,
        marginBottom: 32,
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
      },
      emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: 40,
      },
      emptyStateText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: 16,
        textAlign: 'center',
      },
      
      // Modal styles
      modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      skillModal: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxWidth: 400,
      },
      
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        textAlign: 'center',
      },
      
      input: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: colors.inputBackground,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 16,
        color: colors.inputText,
      },
      
      bioInput: {
        height: 100,
        textAlignVertical: 'top',
      },
      
      levelSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
      },
      
      levelOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
      },
      
      levelOptionSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      },
      
      levelText: {
        fontSize: 12,
        color: colors.textMuted,
      },
      
      levelTextSelected: {
        color: colors.primaryText,
      },
      
      modalButtons: {
        flexDirection: 'row',
        gap: 12,
      },
      
      modalCancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
      },
      
      modalCancelText: {
        color: colors.textMuted,
        fontWeight: '600',
      },
      
      modalAddButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.buttonBackground,
        alignItems: 'center',
      },
      
      modalAddText: {
        color: colors.buttonText,
        fontWeight: '600',
      },
      
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      
      loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textMuted,
      },
      
      // Edit mode styles
      editHeader: {
        backgroundColor: colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      
      cancelButton: {
        fontSize: 16,
        color: colors.textMuted,
      },
      
      editTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
      },
      
      saveButton: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
      },
      
      editContent: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
      },
      
      editAvatarSection: {
        alignItems: 'center',
        marginBottom: 30,
      },
      
      editAvatarContainer: {
        position: 'relative',
        marginBottom: 16,
      },
      
      editAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.primary,
      },
      
      editAvatarOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.surface,
      },
      
      avatarSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
      },
      
      avatarSectionSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 4,
      },
      
      selectPersonaButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
      },
      
      selectPersonaText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'center',
      },
      
      editForm: {
        gap: 20,
      },
      
      inputGroup: {
        gap: 8,
      },
      
      inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
      },
      
      skillsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      
      skillsList: {
        gap: 8,
      },
      
      skillTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
      },
      
      skillName: {
        fontSize: 14,
        color: colors.text,
        flex: 1,
      },
      
      skillLevel: {
        fontSize: 12,
        color: colors.textMuted,
        marginLeft: 8,
      },
      
      skillsContainer: {
        gap: 12,
      },
      
      actionsContainer: {
        gap: 16,
      },
      
      actionContent: {
        flex: 1,
      },
      
      emptyActivity: {
        alignItems: 'center',
        paddingVertical: 40,
      },
      
      emptyActivityText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: 16,
        textAlign: 'center',
      },
    });
  }, [colors, isDark]);
};