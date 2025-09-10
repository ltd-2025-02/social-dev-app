import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
  likes_count?: number;
  comments_count?: number;
  liked_by_user?: boolean;
  image_url?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  likes_count?: number;
  liked_by_user?: boolean;
}

class PostsService {
  async getFeedPosts(userId?: string, limit = 20, offset = 0): Promise<Post[]> {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            name,
            avatar,
            occupation
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: posts, error } = await query;

      if (error) throw error;

      if (!posts) return [];

      const postsWithMetadata = await Promise.all(
        posts.map(async (post) => {
          const [likesCount, commentsCount, userLike] = await Promise.all([
            this.getPostLikesCount(post.id),
            this.getPostCommentsCount(post.id),
            userId ? this.checkUserLikedPost(post.id, userId) : Promise.resolve(false)
          ]);

          return {
            ...post,
            user: post.users,
            likes_count: likesCount,
            comments_count: commentsCount,
            liked_by_user: userLike
          };
        })
      );

      return postsWithMetadata;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  }

  async getPostById(postId: string, userId?: string): Promise<Post | null> {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            name,
            avatar,
            occupation
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      if (!post) return null;

      const [likesCount, commentsCount, userLike] = await Promise.all([
        this.getPostLikesCount(post.id),
        this.getPostCommentsCount(post.id),
        userId ? this.checkUserLikedPost(post.id, userId) : Promise.resolve(false)
      ]);

      return {
        ...post,
        user: post.users,
        likes_count: likesCount,
        comments_count: commentsCount,
        liked_by_user: userLike
      };
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async createPost(userId: string, content: string, imageUrl?: string): Promise<Post> {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userId,
            content: content,
            ...(imageUrl && { image_url: imageUrl })
          }
        ])
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            name,
            avatar,
            occupation
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...post,
        user: post.users,
        likes_count: 0,
        comments_count: 0,
        liked_by_user: false
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async likePost(postId: string, userId: string): Promise<void> {
    try {
      // Check if user already liked this post
      const alreadyLiked = await this.checkUserLikedPost(postId, userId);
      if (alreadyLiked) {
        return; // Already liked, do nothing
      }

      const { error } = await supabase
        .from('post_likes')
        .insert([
          {
            post_id: postId,
            user_id: userId
          }
        ]);

      if (error) {
        // If it's a duplicate key error, ignore it
        if (error.code === '23505') {
          console.log('Post already liked by user');
          return;
        }
        throw error;
      }

      await this.createNotification(postId, userId, 'like');
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  async getPostComments(postId: string, userId?: string): Promise<Comment[]> {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          users!comments_user_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!comments) return [];

      const commentsWithMetadata = await Promise.all(
        comments.map(async (comment) => {
          const [likesCount, userLike] = await Promise.all([
            this.getCommentLikesCount(comment.id),
            userId ? this.checkUserLikedComment(comment.id, userId) : Promise.resolve(false)
          ]);

          return {
            ...comment,
            user: comment.users,
            likes_count: likesCount,
            liked_by_user: userLike
          };
        })
      );

      return commentsWithMetadata;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async createComment(postId: string, userId: string, content: string): Promise<Comment> {
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            content: content
          }
        ])
        .select(`
          *,
          users!comments_user_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      await this.createNotification(postId, userId, 'comment');

      return {
        ...comment,
        user: comment.users,
        likes_count: 0,
        liked_by_user: false
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async sharePost(postId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('shares')
        .insert([
          {
            post_id: postId,
            user_id: userId
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  private async getPostLikesCount(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting likes count:', error);
      return 0;
    }
  }

  private async getPostCommentsCount(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting comments count:', error);
      return 0;
    }
  }

  private async getCommentLikesCount(commentId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting comment likes count:', error);
      return 0;
    }
  }

  private async checkUserLikedPost(postId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  }

  private async checkUserLikedComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user comment like:', error);
      return false;
    }
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comment_likes')
        .insert([
          {
            comment_id: commentId,
            user_id: userId
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }

  private async createNotification(postId: string, userId: string, type: 'like' | 'comment'): Promise<void> {
    try {
      // Get post owner
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (!post || post.user_id === userId) return;

      // Get user info
      const { data: user } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      if (!user) return;

      const title = type === 'like' 
        ? `${user.name} curtiu seu post`
        : `${user.name} comentou no seu post`;

      await supabase
        .from('notifications')
        .insert([
          {
            user_id: post.user_id,
            type: type,
            title: title,
            reference_id: postId,
            reference_type: 'post'
          }
        ]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}

export const postsService = new PostsService();