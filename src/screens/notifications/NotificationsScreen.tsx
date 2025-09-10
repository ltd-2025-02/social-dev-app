import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useNotifications } from '../../hooks/useNotifications';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  fetchNotifications,
} from '../../store/slices/notificationsSlice';
import { Notification } from '../../services/notifications.service';
import { getPersonaImage } from '../../utils/personas';

interface NotificationsScreenProps {
  navigation: any;
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Usar hook de notificações para configurar real-time
  useNotifications(user?.id);

  const filters = [
    { id: 'all', label: 'Todas', icon: 'notifications' },
    { id: 'like', label: 'Curtidas', icon: 'heart' },
    { id: 'comment', label: 'Comentários', icon: 'chatbubbles' },
    { id: 'follow', label: 'Seguidores', icon: 'person-add' },
    { id: 'message', label: 'Mensagens', icon: 'mail' },
  ];

  const filteredNotifications = notifications.filter(notification => 
    selectedFilter === 'all' || notification.type === selectedFilter
  );

  const handleRefresh = async () => {
    if (!user?.id) return;
    
    setRefreshing(true);
    try {
      await dispatch(fetchNotifications({ userId: user.id })).unwrap();
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Marcar como lida se não foi lida
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }

    // Navegar baseado no tipo de notificação
    switch (notification.type) {
      case 'like':
      case 'comment':
        if (notification.reference_id && notification.reference_type === 'post') {
          navigation.navigate('PostDetail', { postId: notification.reference_id });
        }
        break;
      case 'follow':
        if (notification.actor?.id) {
          navigation.navigate('UserProfile', { userId: notification.actor.id });
        }
        break;
      case 'message':
        if (notification.actor?.id) {
          navigation.navigate('ChatDetail', {
            otherUser: notification.actor,
            conversationId: `${user?.id}_${notification.actor.id}`,
          });
        }
        break;
    }
  };

  const handleLongPress = (notification: Notification) => {
    Alert.alert(
      'Opções',
      'O que você gostaria de fazer?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: notification.is_read ? 'Marcar como não lida' : 'Marcar como lida',
          onPress: () => dispatch(markAsRead(notification.id)),
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => dispatch(deleteNotification(notification.id)),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (!user?.id) return;
    
    Alert.alert(
      'Marcar todas como lidas',
      'Tem certeza que deseja marcar todas as notificações como lidas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => dispatch(markAllAsRead(user.id)),
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'follow': return 'person-add';
      case 'message': return 'mail';
      case 'mention': return 'at';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return '#ef4444';
      case 'comment': return '#3b82f6';
      case 'follow': return '#10b981';
      case 'message': return '#f59e0b';
      case 'mention': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getProfileImage = (notification: Notification) => {
    if (notification.actor?.avatar?.startsWith('persona:')) {
      const personaId = notification.actor.avatar.replace('persona:', '');
      return getPersonaImage(personaId) || { uri: `https://ui-avatars.com/api/?name=${notification.actor.name}&background=3b82f6&color=fff` };
    }
    
    if (notification.actor?.avatar) {
      return { uri: notification.actor.avatar };
    }
    
    return { uri: `https://ui-avatars.com/api/?name=${notification.actor?.name || 'User'}&background=3b82f6&color=fff` };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString();
  };

  const renderNotificationItem = ({ item: notification }: { item: Notification }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.notificationItem,
          !notification.is_read && styles.unreadNotification,
          {
            opacity: slideAnim,
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.notificationContent}
          onPress={() => handleNotificationPress(notification)}
          onLongPress={() => handleLongPress(notification)}
          activeOpacity={0.7}
        >
          {/* Avatar do usuário */}
          <View style={styles.avatarContainer}>
            <Image
              source={getProfileImage(notification)}
              style={styles.avatar}
            />
            <View 
              style={[
                styles.notificationTypeIcon, 
                { backgroundColor: getNotificationColor(notification.type) }
              ]}
            >
              <Ionicons 
                name={getNotificationIcon(notification.type) as any} 
                size={12} 
                color="#fff" 
              />
            </View>
          </View>

          {/* Conteúdo da notificação */}
          <View style={styles.notificationBody}>
            <Text style={styles.notificationTitle} numberOfLines={2}>
              <Text style={styles.actorName}>
                {notification.actor?.name || 'Usuário'}
              </Text>
              {' '}
              {notification.title.toLowerCase()}
            </Text>
            
            {notification.content && (
              <Text style={styles.notificationContent} numberOfLines={2}>
                {notification.content}
              </Text>
            )}
            
            <Text style={styles.notificationTime}>
              {formatTime(notification.created_at)}
            </Text>
          </View>

          {/* Indicador não lida */}
          {!notification.is_read && (
            <View style={styles.unreadIndicator} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-outline" size={80} color="#9ca3af" />
      <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
      <Text style={styles.emptySubtitle}>
        Você receberá notificações sobre curtidas, comentários, novos seguidores e mensagens aqui.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={selectedFilter === item.id ? '#fff' : '#6b7280'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === item.id && styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de notificações */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredNotifications.length === 0 && styles.emptyContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  notificationItem: {
    backgroundColor: '#fff',
    marginVertical: 1,
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  notificationTypeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationBody: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  actorName: {
    fontWeight: '600',
  },
  notificationContent: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});