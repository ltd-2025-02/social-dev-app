import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { usersService, UserSearchResult, UserSearchFilters } from '../../services/users.service';

const { width } = Dimensions.get('window');

export default function UserSearchScreen() {
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [popularUsers, setPopularUsers] = useState<UserSearchResult[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'nearby' | 'popular' | 'suggested'>('search');

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [popular, suggested] = await Promise.all([
        usersService.getPopularUsers(20),
        usersService.getSuggestedUsers('current-user-id', 10) // Substitua pelo ID do usuário atual
      ]);
      
      setPopularUsers(popular);
      setSuggestedUsers(suggested);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !locationQuery.trim()) {
      Alert.alert('Aviso', 'Digite algo para buscar');
      return;
    }

    try {
      setLoading(true);
      const filters: UserSearchFilters = {
        query: searchQuery.trim() || undefined,
        location: locationQuery.trim() || undefined,
      };

      if (currentLocation) {
        filters.userLatitude = currentLocation.coords.latitude;
        filters.userLongitude = currentLocation.coords.longitude;
        filters.maxDistance = 50; // 50km radius
      }

      const results = await usersService.searchUsers(filters);
      setUsers(results);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Erro', 'Não foi possível realizar a busca');
    } finally {
      setLoading(false);
    }
  };

  const handleNearbyUsers = async () => {
    if (!currentLocation) {
      Alert.alert('Localização', 'Permissão de localização necessária para esta funcionalidade');
      return;
    }

    try {
      setLoading(true);
      const nearbyUsers = await usersService.getUsersByLocation(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        50 // 50km radius
      );
      setUsers(nearbyUsers);
      setActiveTab('nearby');
    } catch (error) {
      console.error('Error getting nearby users:', error);
      Alert.alert('Erro', 'Não foi possível carregar usuários próximos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const renderUserItem = ({ item }: { item: UserSearchResult }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('OtherUserProfile', { userId: item.id })}
    >
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require('../../../assets/images/default-avatar.png')
        }
        style={styles.userAvatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || 'Nome não informado'}</Text>
        <Text style={styles.userOccupation}>
          {item.occupation || 'Ocupação não informada'}
        </Text>
        {item.company && (
          <Text style={styles.userCompany}>🏢 {item.company}</Text>
        )}
        {item.location && (
          <Text style={styles.userLocation}>📍 {item.location}</Text>
        )}
        {item.distance && (
          <Text style={styles.userDistance}>📍 {item.distance.toFixed(1)} km</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.connectButton}>
        <Ionicons name="person-add" size={20} color="#667eea" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTabButton = (
    tab: 'search' | 'nearby' | 'popular' | 'suggested',
    title: string,
    icon: string
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => {
        setActiveTab(tab);
        if (tab === 'popular') setUsers(popularUsers);
        else if (tab === 'suggested') setUsers(suggestedUsers);
        else if (tab === 'nearby') handleNearbyUsers();
      }}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={activeTab === tab ? '#667eea' : '#666'} 
      />
      <Text style={[
        styles.tabText,
        activeTab === tab && styles.activeTabText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getListData = () => {
    switch (activeTab) {
      case 'popular':
        return popularUsers;
      case 'suggested':
        return suggestedUsers;
      default:
        return users;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscar Usuários</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        {/* Campo de busca por nome/ocupação */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome, ocupação..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          
          {/* Campo de busca por localização */}
          <View style={styles.searchInputContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cidade, estado..."
              value={locationQuery}
              onChangeText={setLocationQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Abas de navegação */}
      <View style={styles.tabsContainer}>
        {renderTabButton('search', 'Busca', 'search')}
        {renderTabButton('nearby', 'Próximos', 'location')}
        {renderTabButton('popular', 'Populares', 'star')}
        {renderTabButton('suggested', 'Sugeridos', 'people')}
      </View>

      {/* Lista de usuários */}
      <FlatList
        data={getListData()}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.usersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {activeTab === 'search' && !loading
                ? 'Nenhum usuário encontrado'
                : activeTab === 'nearby'
                ? 'Nenhum usuário próximo encontrado'
                : activeTab === 'popular'
                ? 'Carregando usuários populares...'
                : 'Carregando sugestões...'}
            </Text>
            {activeTab === 'search' && (
              <Text style={styles.emptySubtext}>
                Tente buscar por outros termos ou localização
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Botão flutuante para busca por localização atual */}
      {currentLocation && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleNearbyUsers}
        >
          <Ionicons name="location" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
  searchContainer: {
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userOccupation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: '#888',
    marginBottom: 1,
  },
  userLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 1,
  },
  userDistance: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  connectButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});