
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatService, ChatRoom, ChatMessage, RoomMember } from '../../services/chat.service';

interface ChatState {
  publicRooms: ChatRoom[];
  userRooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  roomMembers: RoomMember[];
  loading: boolean;
  error: string | null;
  sendingMessage: boolean;
  loadingMembers: boolean;
}

const initialState: ChatState = {
  publicRooms: [],
  userRooms: [],
  currentRoom: null,
  messages: [],
  roomMembers: [],
  loading: false,
  error: null,
  sendingMessage: false,
  loadingMembers: false,
};

// Async thunks
export const fetchPublicRooms = createAsyncThunk(
  'chat/fetchPublicRooms',
  async (userId?: string) => {
    return await chatService.getPublicRooms(userId);
  }
);

export const fetchUserRooms = createAsyncThunk(
  'chat/fetchUserRooms',
  async (userId: string) => {
    return await chatService.getUserRooms(userId);
  }
);

export const fetchRoomMessages = createAsyncThunk(
  'chat/fetchRoomMessages',
  async (params: { roomId: string; userId?: string; limit?: number; offset?: number }) => {
    const { roomId, userId, limit = 50, offset = 0 } = params;
    return await chatService.getRoomMessages(roomId, userId, limit, offset);
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (params: {
    roomId: string;
    userId: string;
    content: string;
    messageType?: 'text' | 'code' | 'image' | 'file' | 'poll' | 'system';
    replyTo?: string;
    metadata?: any;
  }) => {
    const { roomId, userId, content, messageType = 'text', replyTo, metadata } = params;
    return await chatService.sendMessage(roomId, userId, content, messageType, replyTo, metadata);
  }
);

export const joinRoom = createAsyncThunk(
  'chat/joinRoom',
  async (params: { roomId: string; userId: string }) => {
    const { roomId, userId } = params;
    await chatService.joinRoom(roomId, userId);
    return { roomId, userId };
  }
);

export const leaveRoom = createAsyncThunk(
  'chat/leaveRoom',
  async (params: { roomId: string; userId: string }) => {
    const { roomId, userId } = params;
    await chatService.leaveRoom(roomId, userId);
    return { roomId, userId };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action: PayloadAction<ChatRoom | null>) => {
      state.currentRoom = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch public rooms
      .addCase(fetchPublicRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.publicRooms = action.payload;
      })
      .addCase(fetchPublicRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar salas públicas';
      })
      
      // Fetch user rooms
      .addCase(fetchUserRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.userRooms = action.payload;
      })
      .addCase(fetchUserRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar suas salas';
      })
      
      // Fetch room messages
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchRoomMessages.rejected, (state, action) => {
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
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.error.message || 'Erro ao enviar mensagem';
      })
      
      // Join room
      .addCase(joinRoom.fulfilled, (state, action) => {
        const { roomId } = action.payload;
        const publicRoomIndex = state.publicRooms.findIndex(room => room.id === roomId);
        if (publicRoomIndex !== -1) {
          state.publicRooms[publicRoomIndex].user_role = 'member';
        }
      })
      
      // Leave room
      .addCase(leaveRoom.fulfilled, (state, action) => {
        const { roomId } = action.payload;
        state.userRooms = state.userRooms.filter(room => room.id !== roomId);
        
        if (state.currentRoom?.id === roomId) {
          state.currentRoom = null;
          state.messages = [];
        }
      });
  },
});

export const { clearError, setCurrentRoom, clearMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
