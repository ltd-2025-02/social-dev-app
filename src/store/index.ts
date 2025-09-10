
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import feedSlice from './slices/feedSlice';
import jobsSlice from './slices/jobsSlice';
import chatSlice from './slices/chatSlice';
import conversationsSlice from './slices/conversationsSlice';
import connectionsSlice from './slices/connectionsSlice';
import notificationsSlice from './slices/notificationsSlice';
import profileSlice from './slices/profileSlice';
import onboardingSlice from './slices/onboardingSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    feed: feedSlice,
    jobs: jobsSlice,
    chat: chatSlice,
    conversations: conversationsSlice,
    connections: connectionsSlice,
    notifications: notificationsSlice,
    profile: profileSlice,
    onboarding: onboardingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
