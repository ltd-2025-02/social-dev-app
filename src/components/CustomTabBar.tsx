import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = width / state.routes.length;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index * tabWidth,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  const getIconName = (routeName: string, focused: boolean) => {
    let iconName;
    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Feed':
        iconName = focused ? 'newspaper' : 'newspaper-outline';
        break;
      case 'Jobs':
        iconName = focused ? 'briefcase' : 'briefcase-outline';
        break;
      case 'Chat':
        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'help-outline';
    }
    return iconName;
  };

  const getTabTitle = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'Início';
      case 'Feed':
        return 'Feed';
      case 'Jobs':
        return 'Vagas';
      case 'Chat':
        return 'Chat';
      case 'Profile':
        return 'Perfil';
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: indicatorAnim }],
            width: tabWidth,
          },
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.indicatorGradient}
        />
      </Animated.View>

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Add haptic feedback and smooth transition
            // TODO: Add expo-haptics when dependency conflicts are resolved
            // if (Platform.OS === 'ios') {
            //   const { HapticFeedback } = require('expo-haptics');
            //   HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
            // }
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <TabIcon
              routeName={route.name}
              focused={isFocused}
              iconName={getIconName(route.name, isFocused)}
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {getTabTitle(route.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface TabIconProps {
  routeName: string;
  focused: boolean;
  iconName: any;
}

function TabIcon({ routeName, focused, iconName }: TabIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Enhanced animation sequence with rotation and glow
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.3,
            tension: 400,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 400,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { rotate: rotateInterpolate },
        ],
      }}
    >
      {/* Glow effect background */}
      {focused && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.4],
                  }),
                },
              ],
            },
          ]}
        />
      )}
      
      <Ionicons
        name={iconName}
        size={24}
        color={focused ? '#667eea' : '#9ca3af'}
      />
      
      {focused && (
        <Animated.View
          style={[
            styles.activeDot,
            {
              opacity: bounceAnim,
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
  },
  indicatorGradient: {
    flex: 1,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    fontWeight: '500',
  },
  labelActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#667eea',
  },
  glowEffect: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    top: -4,
    left: -4,
  },
});