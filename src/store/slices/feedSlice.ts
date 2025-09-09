
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postsService, Post, Comment } from '../../services/posts.service';

interface FeedState {
  posts: Post[];
  currentPost: Post | null;
  postComments: Comment[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: FeedState = {
  posts: [],
  currentPost: null,
  postComments: [],
  loading: false,
  refreshing: false,
  error: null,
  hasMore: true,
  page: 0,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async (params: { userId?: string; refresh?: boolean } = {}) => {
    const { userId, refresh = false } = params;
    const offset = refresh ? 0 : initialState.page * 20;
    return await postsService.getFeedPosts(userId, 20, offset);
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (params: { userId: string; content: string; imageUrl?: string }) => {
    const { userId, content, imageUrl } = params;
    return await postsService.createPost(userId, content, imageUrl);
  }
);

export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (params: { postId: string; userId: string; liked: boolean }) => {
    const { postId, userId, liked } = params;
    
    if (liked) {
      await postsService.unlikePost(postId, userId);
    } else {
      await postsService.likePost(postId, userId);
    }
    
    return { postId, liked: !liked };
  }
);

export const fetchPostById = createAsyncThunk(
  'feed/fetchPostById',
  async (params: { postId: string; userId?: string }) => {
    const { postId, userId } = params;
    return await postsService.getPostById(postId, userId);
  }
);

export const fetchPostComments = createAsyncThunk(
  'feed/fetchPostComments',
  async (params: { postId: string; userId?: string }) => {
    const { postId, userId } = params;
    return await postsService.getPostComments(postId, userId);
  }
);

export const createComment = createAsyncThunk(
  'feed/createComment',
  async (params: { postId: string; userId: string; content: string }) => {
    const { postId, userId, content } = params;
    return await postsService.createComment(postId, userId, content);
  }
);

export const sharePost = createAsyncThunk(
  'feed/sharePost',
  async (params: { postId: string; userId: string }) => {
    const { postId, userId } = params;
    await postsService.sharePost(postId, userId);
    return postId;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.postComments = [];
    },
    updatePostInList: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        
        if (state.page === 0) {
          state.posts = action.payload;
        } else {
          state.posts = [...state.posts, ...action.payload];
        }
        
        state.hasMore = action.payload.length === 20;
        state.page += 1;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.error.message || 'Erro ao carregar posts';
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar post';
      })
      
      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked } = action.payload;
        
        // Update post in list
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].liked_by_user = liked;
          state.posts[postIndex].likes_count += liked ? 1 : -1;
        }
        
        // Update current post if viewing details
        if (state.currentPost?.id === postId) {
          state.currentPost.liked_by_user = liked;
          state.currentPost.likes_count += liked ? 1 : -1;
        }
      })
      
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar post';
      })
      
      // Fetch post comments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.postComments = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar comentários';
      })
      
      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.postComments.push(action.payload);
        
        // Update comments count in current post
        if (state.currentPost) {
          state.currentPost.comments_count = (state.currentPost.comments_count || 0) + 1;
        }
        
        // Update comments count in posts list
        const postIndex = state.posts.findIndex(post => post.id === action.payload.post_id);
        if (postIndex !== -1) {
          state.posts[postIndex].comments_count = (state.posts[postIndex].comments_count || 0) + 1;
        }
      })
      
      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        // Could update share count if we track that
        console.log('Post shared:', action.payload);
      });
  },
});

export const { setRefreshing, clearError, clearCurrentPost, updatePostInList } = feedSlice.actions;
export default feedSlice.reducer;
