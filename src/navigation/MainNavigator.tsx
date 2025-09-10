
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { Animated, Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import FeedScreen from '../screens/main/FeedScreen';
import JobsScreen from '../screens/jobs/JobsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ModernProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import PostDetailScreen from '../screens/main/PostDetailScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import JobDetailScreen from '../screens/jobs/JobDetailScreen';

// Components
import CustomTabBar from '../components/CustomTabBar';
import TabScreenWrapper from '../components/TabScreenWrapper';

// MainTabParamList type removed for JavaScript compatibility

// MainStackParamList type removed for JavaScript compatibility

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Wrapper components for each screen to add transition effects
const HomeScreenWithTransition = (props) => (
  <TabScreenWrapper>
    <HomeScreen {...props} />
  </TabScreenWrapper>
);

const FeedScreenWithTransition = (props) => (
  <TabScreenWrapper>
    <FeedScreen {...props} />
  </TabScreenWrapper>
);

const JobsScreenWithTransition = (props) => (
  <TabScreenWrapper>
    <JobsScreen {...props} />
  </TabScreenWrapper>
);

const ChatScreenWithTransition = (props) => (
  <TabScreenWrapper>
    <ChatScreen {...props} />
  </TabScreenWrapper>
);

const ProfileScreenWithTransition = (props) => (
  <TabScreenWrapper>
    <ProfileScreen {...props} />
  </TabScreenWrapper>
);

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreenWithTransition} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreenWithTransition} 
        options={{ title: 'Feed' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreenWithTransition} 
        options={{ title: 'Vagas' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreenWithTransition} 
        options={{ title: 'Chat' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreenWithTransition} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        // Enhanced animations
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ 
          title: 'Post',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="ChatDetail" 
        component={ChatDetailScreen} 
        options={{ 
          title: 'Chat',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen} 
        options={{ 
          title: 'Detalhes da Vaga',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Configurações',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
