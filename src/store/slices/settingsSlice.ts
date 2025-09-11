import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsService, UserSettings } from '../../services/settings.service';

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSync: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
  lastSync: null,
};

// Async Thunks
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (userId: string) => {
    return await settingsService.loadSettings(userId);
  }
);

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async ({ userId, settings }: { userId: string; settings: UserSettings }) => {
    await settingsService.saveSettings(userId, settings);
    return settings;
  }
);

export const updateSetting = createAsyncThunk(
  'settings/updateSetting',
  async ({ 
    userId, 
    category, 
    key, 
    value 
  }: { 
    userId: string; 
    category: keyof UserSettings; 
    key: string; 
    value: any 
  }) => {
    await settingsService.updateSetting(userId, category, key as any, value);
    return { category, key, value };
  }
);

export const resetSettings = createAsyncThunk(
  'settings/resetSettings',
  async (userId: string) => {
    await settingsService.resetSettings(userId);
    return await settingsService.loadSettings(userId);
  }
);

export const exportSettings = createAsyncThunk(
  'settings/exportSettings',
  async (userId: string) => {
    return await settingsService.exportSettings(userId);
  }
);

export const importSettings = createAsyncThunk(
  'settings/importSettings',
  async ({ userId, settingsJson }: { userId: string; settingsJson: string }) => {
    await settingsService.importSettings(userId, settingsJson);
    return await settingsService.loadSettings(userId);
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSettings: (state) => {
      state.settings = null;
      state.lastSync = null;
    },
    // Ação para atualizar configurações localmente (otimistic update)
    updateSettingLocal: (state, action: PayloadAction<{
      category: keyof UserSettings;
      key: string;
      value: any;
    }>) => {
      if (state.settings) {
        const { category, key, value } = action.payload;
        (state.settings[category] as any)[key] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Settings
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar configurações';
      })
      
      // Save Settings
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Erro ao salvar configurações';
      })
      
      // Update Setting
      .addCase(updateSetting.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.saving = false;
        if (state.settings) {
          const { category, key, value } = action.payload;
          (state.settings[category] as any)[key] = value;
        }
        state.lastSync = new Date().toISOString();
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Erro ao atualizar configuração';
      })
      
      // Reset Settings
      .addCase(resetSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Erro ao resetar configurações';
      })
      
      // Import Settings
      .addCase(importSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(importSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(importSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Erro ao importar configurações';
      });
  },
});

export const { clearError, clearSettings, updateSettingLocal } = settingsSlice.actions;
export default settingsSlice.reducer;