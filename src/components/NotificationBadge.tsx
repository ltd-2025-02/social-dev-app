import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  showZero?: boolean;
  maxCount?: number;
}

export default function NotificationBadge({
  size = 'medium',
  color = '#ef4444',
  textColor = '#fff',
  showZero = false,
  maxCount = 99,
}: NotificationBadgeProps) {
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (unreadCount > 0) {
      // Animação de "pop" quando há novas notificações
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          tension: 400,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 400,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [unreadCount, scaleAnim]);

  if (unreadCount === 0 && !showZero) {
    return null;
  }

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();
  
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return { minWidth: 16, height: 16, borderRadius: 8 };
      case 'large':
        return { minWidth: 24, height: 24, borderRadius: 12 };
      default:
        return { minWidth: 20, height: 20, borderRadius: 10 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  return (
    <Animated.View
      style={[
        styles.badge,
        getBadgeSize(),
        { backgroundColor: color, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: textColor, fontSize: getTextSize() },
        ]}
      >
        {displayCount}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});