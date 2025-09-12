import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UniversalHeader from '../../components/UniversalHeader';
import { usersService, UserSearchResult } from '../../services/users.service';

interface HireScreenProps {
  navigation: any;
}

export default function HireScreen({ navigation }: HireScreenProps) {
  const [selectedTab, setSelectedTab] = useState('find'); // 'find' or 'offer'
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTab === 'find') {
      fetchUsers();
    }
  }, [selectedTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const popularUsers = await usersService.getPopularUsers(20);
      setUsers(popularUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFindProfessionals = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 20 }} />;
    }

    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image source={{ uri: item.avatar || undefined }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userOccupation}>{item.occupation}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.viewProfileButton}
                onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
              >
                <Text style={styles.viewProfileButtonText}>Ver Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.hireButton}
                onPress={() => navigation.navigate('ChatDetail', { otherUser: item })}
              >
                <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    );
  };

  const renderOfferServices = () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="construct-outline" size={64} color="#9ca3af" />
      <Text style={styles.placeholderTitle}>Ofereça Seus Serviços</Text>
      <Text style={styles.placeholderSubtitle}>
        Em breve, você poderá criar um perfil de serviço para ser contratado por outros usuários.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <UniversalHeader title="Contrate" showBackButton={true} />
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'find' && styles.activeTab]}
          onPress={() => setSelectedTab('find')}
        >
          <Text style={[styles.tabText, selectedTab === 'find' && styles.activeTabText]}>
            Encontrar Profissionais
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'offer' && styles.activeTab]}
          onPress={() => setSelectedTab('offer')}
        >
          <Text style={[styles.tabText, selectedTab === 'offer' && styles.activeTabText]}>
            Oferecer Serviços
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'find' ? renderFindProfessionals() : renderOfferServices()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  activeTabText: {
    color: '#fff',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userOccupation: {
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    marginRight: 8,
  },
  viewProfileButtonText: {
    color: '#8b5cf6',
    fontWeight: '600',
    fontSize: 12,
  },
  hireButton: {
    backgroundColor: '#8b5cf6',
    padding: 8,
    borderRadius: 6,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
