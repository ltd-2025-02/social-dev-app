import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import NotificationBadge from './NotificationBadge';

interface UniversalHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightActions?: React.ReactNode;
  style?: any;
  minimal?: boolean; // New prop to show only back button and title
}

export default function UniversalHeader({ 
  title, 
  showBackButton = false, 
  rightActions,
  style,
  minimal = false
}: UniversalHeaderProps) {
  const navigation = useNavigation();
  const { isDark, colors, toggleTheme, animatedValue } = useTheme();

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: colors.headerBackground, 
        borderBottomColor: colors.border 
      },
      style
    ]}>
      {/* Left section */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.headerText} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.headerText }]}>{title}</Text>
      </View>

      {/* Right section */}
      <View style={styles.rightSection}>
        {rightActions}
        
        {!minimal && (
          <>
            {/* Search Button */}
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('UserSearch')}
            >
              <Ionicons name="search-outline" size={24} color={colors.headerText} />
            </TouchableOpacity>
            
            {/* Theme Toggle Button */}
            <TouchableOpacity 
              style={[styles.headerButton, styles.themeButton]}
              onPress={toggleTheme}
            >
              <Animated.View style={{
                transform: [{
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  })
                }]
              }}>
                <Ionicons 
                  name={isDark ? "sunny-outline" : "moon-outline"} 
                  size={24} 
                  color={colors.headerText} 
                />
              </Animated.View>
            </TouchableOpacity>
            
            {/* Notifications Button */}
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.headerText} />
              <NotificationBadge />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  themeButton: {
    backgroundColor: 'rgba(103, 126, 234, 0.1)',
  },
});