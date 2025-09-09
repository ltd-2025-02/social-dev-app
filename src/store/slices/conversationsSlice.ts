import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { conversationsService, Conversation, Message } from '../../services/conversations.service';

interface ConversationsState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendingMessage: boolean;
}

const initialState: ConversationsState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  sendingMessage: false,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (userId: string) => {
    return await conversationsService.getUserConversations(userId);
  }
);

export const getOrCreateConversation = createAsyncThunk(
  'conversations/getOrCreateConversation',
  async (params: { userId1: string; userId2: string }) => {
    const { userId1, userId2 } = params;
    return await conversationsService.getOrCreateConversation(userId1, userId2);
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'conversations/fetchConversationMessages',
  async (params: { conversationId: string; userId: string }) => {
    const { conversationId, userId } = params;
    return await conversationsService.getConversationMessages(conversationId, userId);
  }
);

export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async (params: { 
    conversationId: string; 
    senderId: string; 
    content: string; 
    messageType?: 'text' | 'image' | 'file' 
  }) => {
    const { conversationId, senderId, content, messageType = 'text' } = params;
    return await conversationsService.sendMessage(conversationId, senderId, content, messageType);
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'conversations/markMessagesAsRead',
  async (params: { conversationId: string; userId: string }) => {
    const { conversationId, userId } = params;
    await conversationsService.markMessagesAsRead(conversationId, userId);
    return conversationId;
  }
);

export const deleteConversation = createAsyncThunk(
  'conversations/deleteConversation',
  async (params: { conversationId: string; userId: string }) => {
    const { conversationId, userId } = params;
    await conversationsService.deleteConversation(conversationId, userId);
    return conversationId;
  }
);

export const searchMessages = createAsyncThunk(
  'conversations/searchMessages',
  async (params: { conversationId: string; query: string }) => {
    const { conversationId, query } = params;
    return await conversationsService.searchMessages(conversationId, query);
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      
      // Update last message in conversations list
      const conversationIndex = state.conversations.findIndex(
        conv => conv.id === action.payload.conversation_id
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].last_message = action.payload;
      }
    },
    updateConversationUnreadCount: (state, action: PayloadAction<{ conversationId: string; count: number }>) => {
      const { conversationId, count } = action.payload;
      const conversationIndex = state.conversations.findIndex(conv => conv.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unread_count = count;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar conversas';
      })
      
      // Get or create conversation
      .addCase(getOrCreateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        
        // Add to conversations list if not already present
        const exists = state.conversations.some(conv => conv.id === action.payload.id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(getOrCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar conversa';
      })
      
      // Fetch conversation messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar mensagens';
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.messages.push(action.payload);
        
        // Update last message in conversations list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversation_id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].last_message = action.payload;
          // Move conversation to top
          const conversation = state.conversations.splice(conversationIndex, 1)[0];
          state.conversations.unshift(conversation);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.error.message || 'Erro ao enviar mensagem';
      })
      
      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        
        // Update unread count in conversations list
        const conversationIndex = state.conversations.findIndex(conv => conv.id === conversationId);
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unread_count = 0;
        }
        
        // Mark messages as read in current conversation
        if (state.currentConversation?.id === conversationId) {
          state.messages = state.messages.map(message => ({
            ...message,
            is_read: true
          }));
        }
      })
      
      // Delete conversation
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const conversationId = action.payload;
        state.conversations = state.conversations.filter(conv => conv.id !== conversationId);
        
        // Clear current conversation if it was deleted
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = null;
          state.messages = [];
        }
      })
      
      // Search messages
      .addCase(searchMessages.fulfilled, (state, action) => {
        // Could store search results in a separate state property
        console.log('Search results:', action.payload);
      });
  },
});

export const {
  clearError,
  setCurrentConversation,
  clearMessages,
  addMessage,
  updateConversationUnreadCount,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;