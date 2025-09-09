import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { connectionsService, Connection, UserConnection, ConnectionStats } from '../../services/connections.service';

interface ConnectionsState {
  connections: Connection[];
  connectionRequests: Connection[];
  searchResults: UserConnection[];
  stats: ConnectionStats;
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
}

const initialState: ConnectionsState = {
  connections: [],
  connectionRequests: [],
  searchResults: [],
  stats: {
    total_connections: 0,
    pending_requests: 0,
    sent_requests: 0,
    mutual_connections: 0,
  },
  loading: false,
  error: null,
  searchLoading: false,
};

// Async thunks
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (params: { userId: string; status?: 'accepted' | 'pending' | 'all' }) => {
    const { userId, status = 'accepted' } = params;
    return await connectionsService.getUserConnections(userId, status);
  }
);

export const fetchConnectionRequests = createAsyncThunk(
  'connections/fetchConnectionRequests',
  async (userId: string) => {
    return await connectionsService.getConnectionRequests(userId);
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'connections/sendConnectionRequest',
  async (params: { followerId: string; followingId: string }) => {
    const { followerId, followingId } = params;
    await connectionsService.sendConnectionRequest(followerId, followingId);
    return { followerId, followingId };
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptConnectionRequest',
  async (requestId: string) => {
    await connectionsService.acceptConnectionRequest(requestId);
    return requestId;
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  'connections/rejectConnectionRequest',
  async (requestId: string) => {
    await connectionsService.rejectConnectionRequest(requestId);
    return requestId;
  }
);

export const removeConnection = createAsyncThunk(
  'connections/removeConnection',
  async (params: { userId: string; connectionUserId: string }) => {
    const { userId, connectionUserId } = params;
    await connectionsService.removeConnection(userId, connectionUserId);
    return connectionUserId;
  }
);

export const searchUsers = createAsyncThunk(
  'connections/searchUsers',
  async (params: { query: string; userId: string; filters?: any }) => {
    const { query, userId, filters } = params;
    return await connectionsService.searchUsers(query, userId, filters);
  }
);

export const fetchConnectionStats = createAsyncThunk(
  'connections/fetchConnectionStats',
  async (userId: string) => {
    return await connectionsService.getConnectionStats(userId);
  }
);

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateUserConnectionStatus: (state, action: PayloadAction<{
      userId: string;
      status: 'none' | 'pending' | 'accepted' | 'blocked' | 'sent';
    }>) => {
      const { userId, status } = action.payload;
      const userIndex = state.searchResults.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.searchResults[userIndex].connection_status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch connections
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar conexões';
      })
      
      // Fetch connection requests
      .addCase(fetchConnectionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionRequests = action.payload;
      })
      .addCase(fetchConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar solicitações';
      })
      
      // Send connection request
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const { followingId } = action.payload;
        // Update user status in search results
        const userIndex = state.searchResults.findIndex(user => user.id === followingId);
        if (userIndex !== -1) {
          state.searchResults[userIndex].connection_status = 'sent';
        }
      })
      
      // Accept connection request
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const requestId = action.payload;
        state.connectionRequests = state.connectionRequests.filter(req => req.id !== requestId);
      })
      
      // Reject connection request
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        const requestId = action.payload;
        state.connectionRequests = state.connectionRequests.filter(req => req.id !== requestId);
      })
      
      // Remove connection
      .addCase(removeConnection.fulfilled, (state, action) => {
        const connectionUserId = action.payload;
        state.connections = state.connections.filter(
          conn => conn.user?.id !== connectionUserId
        );
      })
      
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Erro na busca de usuários';
      })
      
      // Fetch connection stats
      .addCase(fetchConnectionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, clearSearchResults, updateUserConnectionStatus } = connectionsSlice.actions;
export default connectionsSlice.reducer;