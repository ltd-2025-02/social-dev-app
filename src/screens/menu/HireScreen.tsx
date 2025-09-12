  const [selectedTab, setSelectedTab] = useState('find'); // 'find' or 'offer'
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedTab === 'find') {
      fetchUsers();
    }
  }, [selectedTab]);

  const fetchUsers = async (query: string = '') => {
    try {
      setLoading(true);
      const results = await usersService.searchUsers({ query });
      setUsers(results);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchQuery);
  };

  const getAvatarSource = (avatar: string | null) => {
    if (avatar?.startsWith('persona:')) {
      const personaId = avatar.split(':')[1];
      return getPersonaImage(personaId);
    }
    return { uri: avatar || undefined };
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
            <Image source={getAvatarSource(item.avatar)} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userHeadline}>{item.headline}</Text>
              <Text style={styles.userLocation}>{item.location}</Text>
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
      {selectedTab === 'find' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, cargo ou habilidade..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#8b5cf6" />
          </TouchableOpacity>
        </View>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  userCard: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    alignSelf: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHeadline: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  viewProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    marginBottom: 8,
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
