import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  notificationsService, 
  Notification, 
  NotificationSettings 
} from '../../services/notifications.service';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  settings: NotificationSettings | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  settings: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { userId: string; limit?: number; offset?: number }) => {
    const { userId, limit = 50, offset = 0 } = params;
    return await notificationsService.getUserNotifications(userId, limit, offset);
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (userId: string) => {
    return await notificationsService.getUnreadNotificationsCount(userId);
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    await notificationsService.markNotificationAsRead(notificationId);
    return notificationId;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: string) => {
    await notificationsService.markAllNotificationsAsRead(userId);
    return userId;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string) => {
    await notificationsService.deleteNotification(notificationId);
    return notificationId;
  }
);

export const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAllNotifications',
  async (userId: string) => {
    await notificationsService.deleteAllNotifications(userId);
    return userId;
  }
);

export const fetchNotificationsByType = createAsyncThunk(
  'notifications/fetchNotificationsByType',
  async (params: { userId: string; type: 'like' | 'comment' | 'follow' | 'message' | 'mention'; limit?: number }) => {
    const { userId, type, limit = 20 } = params;
    return await notificationsService.getNotificationsByType(userId, type, limit);
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'notifications/fetchRecentActivity',
  async (params: { userId: string; days?: number }) => {
    const { userId, days = 7 } = params;
    return await notificationsService.getRecentActivity(userId, days);
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  'notifications/fetchNotificationSettings',
  async (userId: string) => {
    return await notificationsService.getNotificationSettings(userId);
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateNotificationSettings',
  async (params: { userId: string; settings: Partial<NotificationSettings> }) => {
    const { userId, settings } = params;
    await notificationsService.updateNotificationSettings(userId, settings);
    return settings;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification to the beginning
      state.notifications.unshift(action.payload);
      
      // Update unread count if the notification is unread
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar notificações';
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar contagem não lida';
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1 && !state.notifications[notificationIndex].is_read) {
          state.notifications[notificationIndex].is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao marcar como lida';
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          is_read: true
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao marcar todas como lidas';
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
          const wasUnread = !state.notifications[notificationIndex].is_read;
          state.notifications.splice(notificationIndex, 1);
          
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao deletar notificação';
      })
      
      // Delete all notifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao deletar todas as notificações';
      })
      
      // Fetch notifications by type
      .addCase(fetchNotificationsByType.fulfilled, (state, action) => {
        // This could be used for filtering - for now just replace notifications
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsByType.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar notificações por tipo';
      })
      
      // Fetch recent activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        // This could be stored separately or replace notifications
        state.notifications = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar atividade recente';
      })
      
      // Fetch notification settings
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar configurações de notificação';
      })
      
      // Update notification settings
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        if (state.settings) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao atualizar configurações de notificação';
      });
  },
});

export const {
  clearError,
  addNotification,
  updateSettings,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;