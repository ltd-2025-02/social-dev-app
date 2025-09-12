
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
import IntelligentJobsScreen from '../screens/jobs/IntelligentJobsScreen';
import SavedJobsScreen from '../screens/jobs/SavedJobsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/EnhancedProfileScreenSimple';
import SettingsScreen from '../screens/main/SettingsScreen';
import PostDetailScreen from '../screens/main/PostDetailScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import JobDetailScreen from '../screens/jobs/JobDetailScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import UserSearchScreen from '../screens/users/UserSearchScreen';

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
import LearningLessonScreen from '../screens/menu/LearningLessonScreen';
import ResumeBuilderScreen from '../screens/menu/ResumeBuilderScreen';
import MyResumesScreen from '../screens/menu/MyResumesScreen';
import ResumeSelectionScreen from '../screens/menu/ResumeSelectionScreen';
import ResumeAnalysisScreen from '../screens/menu/ResumeAnalysisScreen';
import InterviewSimulatorScreen from '../screens/menu/InterviewSimulatorScreen';
import HireScreen from '../screens/menu/HireScreen';

// News Screens
import NewsScreen from '../screens/news/NewsScreen';

// Notification Screens
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

// Analytics Screens
import MetricsDashboard from '../screens/analytics/MetricsDashboard';

// Settings Screens
import ProfileSettings from '../screens/settings/ProfileSettings';
import PrivacySettings from '../screens/settings/PrivacySettings';
import NotificationSettings from '../screens/settings/NotificationSettings';
import AppSettings from '../screens/settings/AppSettings';
import ContentSettings from '../screens/settings/ContentSettings';

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
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        // Enhanced animations
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen as any} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="ChatDetail" 
        component={ChatDetailScreen as any} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen} 
        options={{ 
          headerShown: false,
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
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Learning" 
        component={LearningScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="AIChat" 
        component={AIChatScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="News" 
        component={NewsScreen} 
        options={{ 
          headerShown: false,
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
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="FAQ" 
        component={FAQScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LiveChat" 
        component={LiveChatScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="BugReport" 
        component={BugReportScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="FeatureSuggestion" 
        component={FeatureSuggestionScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LearningTrail" 
        component={LearningTrailScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LearningModule" 
        component={LearningModuleScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LearningLesson" 
        component={LearningLessonScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ResumeBuilder" 
        component={ResumeBuilderScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="MyResumes" 
        component={MyResumesScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ResumeSelection" 
        component={ResumeSelectionScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ResumeAnalysis" 
        component={ResumeAnalysisScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="InterviewSimulator" 
        component={InterviewSimulatorScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Hire" 
        component={HireScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="OtherUserProfile" 
        component={UserProfileScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="UserSearch" 
        component={UserSearchScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      
      {/* Settings Screens */}
      <Stack.Screen 
        name="ProfileSettings" 
        component={ProfileSettings} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettings} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettings} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="AppSettings" 
        component={AppSettings} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ContentSettings" 
        component={ContentSettings} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="MetricsDashboard" 
        component={MetricsDashboard} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="IntelligentJobs" 
        component={IntelligentJobsScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="SavedJobs" 
        component={SavedJobsScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
