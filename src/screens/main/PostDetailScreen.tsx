
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchPostById,
  fetchPostComments,
  createComment,
  toggleLike,
  clearCurrentPost,
} from '../../store/slices/feedSlice';
import { getPersonaImage } from '../../utils/personas';

interface PostDetailScreenProps {
  route: {
    params: {
      postId: string;
    };
  };
  navigation: any;
}

export default function PostDetailScreen({ route, navigation }: PostDetailScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPost, postComments, loading, error } = useSelector((state: RootState) => state.feed);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { postId } = route.params;

  useEffect(() => {
    if (postId && user?.id) {
      dispatch(fetchPostById({ postId, userId: user.id }));
      dispatch(fetchPostComments({ postId, userId: user.id }));
    }
    
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, postId, user?.id]);

  const handleLike = async () => {
    if (!user || !currentPost) return;
    
    try {
      await dispatch(toggleLike({
        postId: currentPost.id,
        userId: user.id,
        liked: currentPost.liked_by_user || false
      })).unwrap();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao curtir post');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user || !currentPost) {
      Alert.alert('Erro', 'Digite um comentário');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(createComment({
        postId: currentPost.id,
        userId: user.id,
        content: commentText.trim()
      })).unwrap();
      
      setCommentText('');
      Alert.alert('Sucesso!', 'Comentário adicionado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar comentário');
    } finally {
      setSubmitting(false);
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

  const getProfileImage = (userProfile: any) => {
    if (userProfile?.persona_id) {
      const personaImage = getPersonaImage(userProfile.persona_id);
      if (personaImage) return personaImage;
    }
    if (userProfile?.avatar) {
      return { uri: userProfile.avatar };
    }
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=2563eb&color=fff` 
    };
  };

  const renderComment = (comment: any) => (
    <View key={comment.id} style={styles.commentItem}>
      <Image
        source={getProfileImage(comment.user)}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.user?.name}</Text>
          <Text style={styles.commentTime}>{formatDate(comment.created_at)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons 
              name={comment.liked_by_user ? "heart" : "heart-outline"} 
              size={16} 
              color={comment.liked_by_user ? "#ef4444" : "#6b7280"} 
            />
            <Text style={[styles.commentActionText, comment.liked_by_user && styles.likedText]}>
              {comment.likes_count || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
            <Text style={styles.commentActionText}>Responder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !currentPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !currentPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              if (user?.id) {
                dispatch(fetchPostById({ postId, userId: user.id }));
                dispatch(fetchPostComments({ postId, userId: user.id }));
              }
            }}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={48} color="#6b7280" />
          <Text style={styles.errorText}>Post não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Post */}
          <View style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity style={styles.userInfo}>
                <Image
                  source={getProfileImage(currentPost.user)}
                  style={styles.avatar}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{currentPost.user?.name}</Text>
                  {currentPost.user?.occupation && (
                    <Text style={styles.userOccupation}>{currentPost.user.occupation}</Text>
                  )}
                  <Text style={styles.postTime}>{formatDate(currentPost.created_at)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <View style={styles.postContent}>
              <Text style={styles.postText}>{currentPost.content}</Text>
              {currentPost.image_url && (
                <Image source={{ uri: currentPost.image_url }} style={styles.postImage} />
              )}
            </View>

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={[styles.actionButton, currentPost.liked_by_user && styles.likedButton]}
                onPress={handleLike}
              >
                <Ionicons 
                  name={currentPost.liked_by_user ? "heart" : "heart-outline"} 
                  size={24} 
                  color={currentPost.liked_by_user ? "#ef4444" : "#6b7280"} 
                />
                <Text style={[styles.actionText, currentPost.liked_by_user && styles.likedText]}>
                  {currentPost.likes_count || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#6b7280" />
                <Text style={styles.actionText}>{currentPost.comments_count || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color="#6b7280" />
                <Text style={styles.actionText}>Compartilhar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comentários ({postComments.length})
            </Text>
            
            {postComments.length === 0 ? (
              <View style={styles.noComments}>
                <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
                <Text style={styles.noCommentsText}>Nenhum comentário ainda</Text>
                <Text style={styles.noCommentsSubtext}>Seja o primeiro a comentar!</Text>
              </View>
            ) : (
              <View style={styles.commentsList}>
                {postComments.map(renderComment)}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image
            source={getProfileImage(user)}
            style={styles.inputAvatar}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escreva um comentário..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!commentText.trim() || submitting) && styles.sendButtonDisabled]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: 8,
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
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
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: '#fef2f2',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  likedText: {
    color: '#ef4444',
  },
  commentsSection: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  commentsList: {
    paddingBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});
