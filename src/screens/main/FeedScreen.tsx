import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchPosts, createPost, toggleLike, setRefreshing } from '../../store/slices/feedSlice';
import * as ImagePicker from 'expo-image-picker';
import { useNotificationHelpers } from '../../hooks/useNotifications';
import { getPersonaImage } from '../../utils/personas';
import { Post } from '../../services/posts.service';

const { width } = Dimensions.get('window');

export default function FeedScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, refreshing, error } = useSelector((state: RootState) => state.feed);
  const { user } = useSelector((state: RootState) => state.auth);

  // Usar helpers de notificação
  const { notifyNewPost, notifyLike, notifyComment } = useNotificationHelpers(user?.id || '');

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchPosts({ refresh: true }));
  }, [dispatch]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Erro', 'Digite algo para postar');
      return;
    }

    try {
      const result = await dispatch(createPost({
        content: newPostContent,
        imageUrl: selectedImage || undefined
      })).unwrap();
      
      // Notificar seguidores sobre novo post
      if (result?.id && user?.id) {
        await notifyNewPost(user.id, result.id, newPostContent);
      }
      
      setNewPostContent('');
      setSelectedImage(null);
      setShowCreatePost(false);
      Alert.alert('Sucesso!', 'Post criado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar post');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    try {
      await dispatch(toggleLike({ 
        postId, 
        userId: user.id, 
        liked: post.liked_by_user || false
      })).unwrap();

      // Criar notificação se curtiu (não descurtiu) e não é próprio post
      if (!post.liked_by_user && post.user?.id && post.user.id !== user.id) {
        await notifyLike(post.user.id, user.id, postId);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao curtir post');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getAvatarSource = (avatar: string | null | undefined, name: string) => {
    if (avatar?.startsWith('persona:')) {
      const personaId = avatar.replace('persona:', '');
      const personaImage = getPersonaImage(personaId);
      if (personaImage) {
        return personaImage;
      }
    }
    
    // Fallback para URL ou avatar gerado
    return { 
      uri: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff` 
    };
  };

  const handleUserMenuPress = (post: Post) => {
    setSelectedPost(post);
    setShowUserMenu(true);
  };

  const handleFollowUser = async (userId: string) => {
    try {
      // Aqui você implementaria a lógica de seguir/desseguir
      // Por enquanto, vamos apenas mostrar um alert
      Alert.alert('Seguir Usuário', 'Funcionalidade de seguir será implementada em breve');
      setShowUserMenu(false);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível seguir o usuário');
    }
  };

  const handleShareProfile = async (user: any) => {
    try {
      // Simular compartilhamento do perfil
      Alert.alert(
        'Compartilhar Perfil',
        `Compartilhar perfil de ${user.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Compartilhar', onPress: () => {
            Alert.alert('Sucesso', 'Perfil compartilhado!');
            setShowUserMenu(false);
          }}
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível compartilhar o perfil');
    }
  };

  const handleSendMessage = (userId: string, userName: string) => {
    setShowUserMenu(false);
    // Navegar para o chat com o usuário
    navigation.navigate('ChatDetail', {
      conversationId: `temp-${userId}`, // ID temporário da conversa
      otherUser: {
        id: userId,
        name: userName,
        avatar: selectedPost?.user?.avatar
      }
    });
  };

  const renderPost = (post: Post) => {
    if (!post.user) {
      return null; // Skip posts without user data
    }
    
    return (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate('OtherUserProfile', { userId: post.user.id })}
        >
          <Image
            source={getAvatarSource(post.user.avatar, post.user.name)}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.user.occupation && (
              <Text style={styles.userOccupation}>{post.user.occupation}</Text>
            )}
            <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => handleUserMenuPress(post)}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <TouchableOpacity 
        style={styles.postContent}
        onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
      >
        <Text style={styles.postText}>{post.content}</Text>
        {post.image_url && (
          <Image source={{ uri: post.image_url }} style={styles.postImage} />
        )}
      </TouchableOpacity>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionButton, post.liked_by_user && styles.likedButton]}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons 
            name={post.liked_by_user ? "heart" : "heart-outline"} 
            size={20} 
            color={post.liked_by_user ? "#ef4444" : "#666"} 
          />
          <Text style={[styles.actionText, post.liked_by_user && styles.likedText]}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Post Button */}
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => setShowCreatePost(true)}
      >
        <Image
          source={getAvatarSource(user?.avatar, user?.name || 'User')}
          style={styles.createPostAvatar}
        />
        <Text style={styles.createPostText}>O que você está pensando?</Text>
        <Ionicons name="image-outline" size={20} color="#666" />
      </TouchableOpacity>

      {/* Feed Posts */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {posts
          .filter((post, index, self) => 
            index === self.findIndex(p => p.id === post.id) && post.user
          )
          .map(renderPost)
          .filter(Boolean)
        }
        
        {posts.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>Nenhum post ainda</Text>
            <Text style={styles.emptyStateText}>
              Comece seguindo outros desenvolvedores para ver seus posts aqui
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.modalPostButton}>Postar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.modalUserInfo}>
              <Image
                source={getAvatarSource(user?.avatar, user?.name || 'User')}
                style={styles.modalAvatar}
              />
              <View>
                <Text style={styles.modalUserName}>{user?.name}</Text>
                <Text style={styles.modalUserOccupation}>{user?.occupation || 'Desenvolvedor'}</Text>
              </View>
            </View>

            <TextInput
              style={styles.modalTextInput}
              placeholder="O que você está pensando?"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              autoFocus
            />

            {selectedImage && (
              <View style={styles.modalImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalActionButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color="#3b82f6" />
                <Text style={styles.modalActionText}>Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalActionButton}>
                <Ionicons name="videocam-outline" size={24} color="#3b82f6" />
                <Text style={styles.modalActionText}>Vídeo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalActionButton}>
                <Ionicons name="code-slash-outline" size={24} color="#3b82f6" />
                <Text style={styles.modalActionText}>Código</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        visible={showUserMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUserMenu(false)}
        >
          <View style={styles.userMenuContainer}>
            {selectedPost?.user && (
              <>
                <View style={styles.userMenuHeader}>
                  <Image
                    source={getAvatarSource(selectedPost.user.avatar, selectedPost.user.name)}
                    style={styles.userMenuAvatar}
                  />
                  <View>
                    <Text style={styles.userMenuName}>{selectedPost.user.name}</Text>
                    <Text style={styles.userMenuOccupation}>
                      {selectedPost.user.occupation || 'Desenvolvedor'}
                    </Text>
                  </View>
                </View>

                <View style={styles.userMenuActions}>
                  <TouchableOpacity 
                    style={styles.userMenuAction}
                    onPress={() => {
                      setShowUserMenu(false);
                      navigation.navigate('OtherUserProfile', { userId: selectedPost.user.id });
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color="#3b82f6" />
                    <Text style={styles.userMenuActionText}>Ver Perfil</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.userMenuAction}
                    onPress={() => handleFollowUser(selectedPost.user.id)}
                  >
                    <Ionicons name="person-add-outline" size={20} color="#10b981" />
                    <Text style={styles.userMenuActionText}>Seguir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.userMenuAction}
                    onPress={() => handleSendMessage(selectedPost.user.id, selectedPost.user.name)}
                  >
                    <Ionicons name="chatbubble-outline" size={20} color="#8b5cf6" />
                    <Text style={styles.userMenuActionText}>Enviar Mensagem</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.userMenuAction}
                    onPress={() => handleShareProfile(selectedPost.user)}
                  >
                    <Ionicons name="share-outline" size={20} color="#f59e0b" />
                    <Text style={styles.userMenuActionText}>Compartilhar Perfil</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostText: {
    flex: 1,
    fontSize: 16,
    color: '#9ca3af',
  },
  feed: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  feedContent: {
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userOccupation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  likedButton: {
    opacity: 1,
  },
  likedText: {
    color: '#ef4444',
  },
  emptyState: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalPostButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  modalUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalUserOccupation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  modalTextInput: {
    fontSize: 18,
    color: '#1f2937',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalActionButton: {
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 4,
    fontWeight: '500',
  },
  // User Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMenuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
    maxWidth: 320,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  userMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userMenuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userMenuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userMenuOccupation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  userMenuActions: {
    gap: 12,
  },
  userMenuAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  userMenuActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
});