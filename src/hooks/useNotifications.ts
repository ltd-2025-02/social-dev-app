import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { supabase } from '../services/supabase';
import {
  fetchNotifications,
  fetchUnreadCount,
  addNotification,
  setRealtimeSubscription,
  clearRealtimeSubscription,
} from '../store/slices/notificationsSlice';
import { Notification } from '../services/notifications.service';
import * as Notifications from 'expo-notifications';

export const useNotifications = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  // Configurar notificações push
  useEffect(() => {
    const configurePushNotifications = async () => {
      // Configurar como as notificações são apresentadas
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações não concedida');
        return;
      }

      // Configurar canal de notificação (Android)
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'SocialDev',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3b82f6',
        });
      }
    };

    configurePushNotifications();
  }, []);

  // Configurar subscriptions em tempo real
  useEffect(() => {
    if (!userId) return;

    console.log('🔔 Configurando notificações em tempo real para usuário:', userId);

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('📬 Nova notificação recebida:', payload);
          
          const newNotification = payload.new as Notification;
          
          // Adicionar ao Redux
          dispatch(addNotification(newNotification));
          
          // Mostrar notificação push local
          showLocalNotification(newNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('📝 Notificação atualizada:', payload);
          // Você pode implementar lógica para atualizações aqui
        }
      )
      .subscribe();

    dispatch(setRealtimeSubscription(channel));

    return () => {
      console.log('🔕 Desconectando notificações em tempo real');
      channel.unsubscribe();
      dispatch(clearRealtimeSubscription());
    };
  }, [userId, dispatch]);

  // Carregar notificações iniciais
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications({ userId }));
      dispatch(fetchUnreadCount(userId));
    }
  }, [userId, dispatch]);

  // Função para mostrar notificação local
  const showLocalNotification = async (notification: Notification) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.content || '',
          data: {
            notificationId: notification.id,
            type: notification.type,
            referenceId: notification.reference_id,
          },
        },
        trigger: null, // Mostrar imediatamente
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação local:', error);
    }
  };

  // Função para criar notificações
  const createNotification = useCallback(async (params: {
    targetUserId: string;
    type: 'like' | 'comment' | 'follow' | 'message' | 'mention';
    title: string;
    content?: string;
    referenceId?: string;
    referenceType?: 'post' | 'comment' | 'user' | 'message';
    actorId: string;
  }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: params.targetUserId,
          type: params.type,
          title: params.title,
          content: params.content || null,
          reference_id: params.referenceId || null,
          reference_type: params.referenceType || null,
          actor_id: params.actorId,
          is_read: false,
        });

      if (error) throw error;
      
      console.log('✅ Notificação criada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    createNotification,
  };
};

// Hook para diferentes tipos específicos de notificações
export const useNotificationHelpers = (userId: string) => {
  const { createNotification } = useNotifications(userId);

  const notifyNewPost = useCallback(async (authorId: string, postId: string, postTitle: string) => {
    // Buscar seguidores do autor para notificar
    const { data: followers } = await supabase
      .from('connections')
      .select('follower_id')
      .eq('following_id', authorId)
      .eq('status', 'accepted');

    if (followers) {
      const notifications = followers.map(follower => 
        createNotification({
          targetUserId: follower.follower_id,
          type: 'mention',
          title: 'Novo post publicado',
          content: `${postTitle.substring(0, 50)}...`,
          referenceId: postId,
          referenceType: 'post',
          actorId: authorId,
        })
      );

      await Promise.all(notifications);
    }
  }, [createNotification]);

  const notifyLike = useCallback(async (postOwnerId: string, likerId: string, postId: string) => {
    if (postOwnerId === likerId) return; // Não notificar curtidas próprias

    await createNotification({
      targetUserId: postOwnerId,
      type: 'like',
      title: 'Curtiu seu post',
      content: 'Alguém curtiu seu post',
      referenceId: postId,
      referenceType: 'post',
      actorId: likerId,
    });
  }, [createNotification]);

  const notifyComment = useCallback(async (postOwnerId: string, commenterId: string, postId: string, commentText: string) => {
    if (postOwnerId === commenterId) return; // Não notificar comentários próprios

    await createNotification({
      targetUserId: postOwnerId,
      type: 'comment',
      title: 'Comentou em seu post',
      content: commentText.substring(0, 100),
      referenceId: postId,
      referenceType: 'post',
      actorId: commenterId,
    });
  }, [createNotification]);

  const notifyNewFollower = useCallback(async (targetUserId: string, followerId: string) => {
    await createNotification({
      targetUserId,
      type: 'follow',
      title: 'Novo seguidor',
      content: 'Começou a te seguir',
      referenceId: followerId,
      referenceType: 'user',
      actorId: followerId,
    });
  }, [createNotification]);

  const notifyNewMessage = useCallback(async (recipientId: string, senderId: string, messageText: string) => {
    await createNotification({
      targetUserId: recipientId,
      type: 'message',
      title: 'Nova mensagem',
      content: messageText.substring(0, 100),
      referenceId: senderId,
      referenceType: 'user',
      actorId: senderId,
    });
  }, [createNotification]);

  return {
    notifyNewPost,
    notifyLike,
    notifyComment,
    notifyNewFollower,
    notifyNewMessage,
  };
};