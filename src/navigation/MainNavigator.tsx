
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

// Menu Screens
import CareerScreen from '../screens/menu/CareerScreen';
import LearningScreen from '../screens/menu/LearningScreen';
import AIChatScreen from '../screens/menu/AIChatScreen';
import SupportScreen from '../screens/menu/SupportScreen';
import AboutScreen from '../screens/menu/AboutScreen';
import TermsOfUseScreen from '../screens/menu/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/menu/PrivacyPolicyScreen';
import FAQScreen from '../screens/menu/FAQScreen';
import LiveChatScreen from '../screens/menu/LiveChatScreen';
import BugReportScreen from '../screens/menu/BugReportScreen';
import FeatureSuggestionScreen from '../screens/menu/FeatureSuggestionScreen';
import LearningTrailScreen from '../screens/menu/LearningTrailScreen';
import LearningModuleScreen from '../screens/menu/LearningModuleScreen';

// Notification Screens
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

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
      <Stack.Screen 
        name="Career" 
        component={CareerScreen} 
        options={{ 
          title: 'Carreira',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Learning" 
        component={LearningScreen} 
        options={{ 
          title: 'Aprenda Tecnologias',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="AIChat" 
        component={AIChatScreen} 
        options={{ 
          title: 'IA Assistant',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ 
          title: 'Suporte',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ 
          title: 'Sobre',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ 
          title: 'Notificações',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="TermsOfUse" 
        component={TermsOfUseScreen} 
        options={{ 
          title: 'Termos de Uso',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen} 
        options={{ 
          title: 'Política de Privacidade',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="FAQ" 
        component={FAQScreen} 
        options={{ 
          title: 'FAQ',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LiveChat" 
        component={LiveChatScreen} 
        options={{ 
          title: 'Chat ao Vivo',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="BugReport" 
        component={BugReportScreen} 
        options={{ 
          title: 'Reportar Bug',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="FeatureSuggestion" 
        component={FeatureSuggestionScreen} 
        options={{ 
          title: 'Sugerir Funcionalidade',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LearningTrail" 
        component={LearningTrailScreen} 
        options={{ 
          title: 'Trilha de Aprendizado',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LearningModule" 
        component={LearningModuleScreen} 
        options={{ 
          title: 'Módulo',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
