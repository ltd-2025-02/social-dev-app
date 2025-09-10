import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { signOut } from '../store/slices/authSlice';
import { getPersonaImage } from '../utils/personas';

const { width, height } = Dimensions.get('window');

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
}

interface MenuItem {
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
  route?: string;
  onPress?: () => void;
  badge?: string;
  gradient?: [string, string];
}

export default function HamburgerMenu({ isVisible, onClose, navigation }: HamburgerMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentProfile } = useSelector((state: RootState) => state.profile);
  
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const itemsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isVisible]);

  const openMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(itemsAnim, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(itemsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleItemPress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
    onClose();
  };

  const handleLogout = () => {
    dispatch(signOut());
    onClose();
  };

  const getProfileImage = () => {
    const profile = currentProfile || user;
    
    // First check if persona_id is available (local state)
    if (profile?.persona_id) {
      const personaImage = getPersonaImage(profile.persona_id);
      if (personaImage) return personaImage;
    }
    
    // Then check if avatar contains persona data (from database)
    if (profile?.avatar && profile.avatar.startsWith('persona:')) {
      const personaId = profile.avatar.replace('persona:', '');
      const personaImage = getPersonaImage(personaId);
      if (personaImage) return personaImage;
    }
    
    // If avatar is a regular URL
    if (profile?.avatar && !profile.avatar.startsWith('persona:')) {
      return { uri: profile.avatar };
    }
    
    // Default fallback
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=3b82f6&color=fff` 
    };
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Meu Perfil',
      subtitle: 'Editar informações pessoais',
      color: '#3b82f6',
      route: 'Profile',
    },
    {
      icon: 'briefcase-outline',
      title: 'Carreira',
      subtitle: 'Planeje seu crescimento',
      color: '#10b981',
      route: 'Career',
    },
    {
      icon: 'school-outline',
      title: 'Aprenda Tecnologias',
      subtitle: 'Cursos e tutoriais',
      color: '#f59e0b',
      route: 'Learning',
      badge: 'Novo',
    },
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'IA Assistant',
      subtitle: 'Seu guia pessoal',
      color: '#8b5cf6',
      route: 'AIChat',
      gradient: ['#8b5cf6', '#3b82f6'],
    },
    {
      icon: 'help-circle-outline',
      title: 'Suporte',
      subtitle: 'Central de ajuda',
      color: '#06b6d4',
      route: 'Support',
    },
    {
      icon: 'information-circle-outline',
      title: 'Sobre',
      subtitle: 'Sobre o SocialDev',
      color: '#6366f1',
      route: 'About',
    },
    {
      icon: 'settings-outline',
      title: 'Configurações',
      subtitle: 'Preferências do app',
      color: '#6b7280',
      route: 'Settings',
    },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
      
      {/* Overlay */}
      <Animated.View 
        style={[styles.overlay, { opacity: overlayAnim }]}
      >
        <TouchableOpacity 
          style={styles.overlayTouch} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Menu */}
      <Animated.View 
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1f2937', '#111827']}
          style={styles.menuGradient}
        >
          <SafeAreaView style={styles.menuContent}>
            {/* Header */}
            <View style={styles.menuHeader}>
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={getProfileImage()}
                    style={styles.avatar}
                  />
                  <View style={styles.onlineIndicator} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>{(currentProfile?.name || user?.name) || 'Usuário'}</Text>
                  <Text style={styles.userEmail}>{(currentProfile?.email || user?.email) || 'email@exemplo.com'}</Text>
                  <Text style={styles.userOccupation}>{(currentProfile?.occupation || user?.occupation) || 'Desenvolvedor'}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <Animated.View 
              style={[
                styles.menuItems,
                {
                  opacity: itemsAnim,
                  transform: [
                    {
                      translateY: itemsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
              >
                {menuItems.map((item, index) => (
                  <Animated.View
                    key={item.title}
                    style={{
                      opacity: itemsAnim,
                      transform: [
                        {
                          translateX: itemsAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleItemPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.itemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                          {item.gradient ? (
                            <LinearGradient
                              colors={item.gradient}
                              style={styles.iconGradient}
                            >
                              <Ionicons name={item.icon as any} size={24} color="#fff" />
                            </LinearGradient>
                          ) : (
                            <Ionicons name={item.icon as any} size={24} color={item.color} />
                          )}
                        </View>
                        <View style={styles.itemText}>
                          <View style={styles.titleRow}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            {item.badge && (
                              <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                              </View>
                            )}
                          </View>
                          {item.subtitle && (
                            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}

                {/* Logout */}
                <Animated.View
                  style={{
                    opacity: itemsAnim,
                    transform: [
                      {
                        translateX: itemsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[styles.menuItem, styles.logoutItem]}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.iconContainer, styles.logoutIcon]}>
                        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                      </View>
                      <View style={styles.itemText}>
                        <Text style={[styles.itemTitle, styles.logoutText]}>Sair</Text>
                        <Text style={styles.itemSubtitle}>Fazer logout da conta</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </Animated.View>

                {/* Version */}
                <View style={styles.versionContainer}>
                  <Text style={styles.versionText}>SocialDev v1.0.0</Text>
                  <Text style={styles.versionSubtext}>Conectando desenvolvedores</Text>
                </View>
              </ScrollView>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.85,
    height: height,
    maxWidth: 320,
  },
  menuGradient: {
    flex: 1,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileSection: {
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  userOccupation: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  badge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  logoutItem: {
    marginTop: 20,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  logoutIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    color: '#ef4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  versionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 2,
  },
});