import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  profileService, 
  UserProfile, 
  ProfileStats, 
  ProfileSkill, 
  ProfileExperience, 
  ProfileEducation, 
  ProfileProject 
} from '../../services/profile.service';

interface ProfileState {
  currentProfile: UserProfile | null;
  viewedProfile: UserProfile | null;
  profileStats: ProfileStats | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

const initialState: ProfileState = {
  currentProfile: null,
  viewedProfile: null,
  profileStats: null,
  loading: false,
  error: null,
  updating: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    return await profileService.getProfile(userId);
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (params: { userId: string; updates: Partial<UserProfile> }) => {
    const { userId, updates } = params;
    return await profileService.updateProfile(userId, updates);
  }
);

export const fetchProfileStats = createAsyncThunk(
  'profile/fetchProfileStats',
  async (userId: string) => {
    return await profileService.getProfileStats(userId);
  }
);

export const recordProfileView = createAsyncThunk(
  'profile/recordProfileView',
  async (params: { profileUserId: string; viewerUserId: string }) => {
    const { profileUserId, viewerUserId } = params;
    await profileService.recordProfileView(profileUserId, viewerUserId);
    return params;
  }
);

export const addSkill = createAsyncThunk(
  'profile/addSkill',
  async (params: {
    userId: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
    yearsOfExperience?: number;
  }) => {
    const { userId, name, level, category, yearsOfExperience } = params;
    return await profileService.addProfileSkill(userId, name, level, category, yearsOfExperience);
  }
);

export const removeSkill = createAsyncThunk(
  'profile/removeSkill',
  async (skillId: string) => {
    await profileService.removeProfileSkill(skillId);
    return skillId;
  }
);

export const endorseSkill = createAsyncThunk(
  'profile/endorseSkill',
  async (params: { skillId: string; endorserId: string }) => {
    const { skillId, endorserId } = params;
    await profileService.endorseSkill(skillId, endorserId);
    return params;
  }
);

export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async (params: { userId: string; experience: Omit<ProfileExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'> }) => {
    const { userId, experience } = params;
    return await profileService.addProfileExperience(userId, experience);
  }
);

export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (params: { userId: string; education: Omit<ProfileEducation, 'id' | 'user_id' | 'created_at' | 'updated_at'> }) => {
    const { userId, education } = params;
    return await profileService.addProfileEducation(userId, education);
  }
);

export const addProject = createAsyncThunk(
  'profile/addProject',
  async (params: { userId: string; project: Omit<ProfileProject, 'id' | 'user_id' | 'created_at' | 'updated_at'> }) => {
    const { userId, project } = params;
    return await profileService.addProfileProject(userId, project);
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setViewedProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.viewedProfile = action.payload;
    },
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
    updateCurrentProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.currentProfile) {
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar perfil';
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.currentProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erro ao atualizar perfil';
      })
      
      // Fetch profile stats
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        state.profileStats = action.payload;
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar estatísticas do perfil';
      })
      
      // Record profile view
      .addCase(recordProfileView.fulfilled, (state, action) => {
        // Update view count if we have stats loaded
        if (state.profileStats && action.payload.profileUserId === state.currentProfile?.id) {
          state.profileStats.views_count += 1;
        }
      })
      
      // Add skill
      .addCase(addSkill.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.updating = false;
        if (state.currentProfile?.skills) {
          state.currentProfile.skills.push(action.payload);
        }
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erro ao adicionar habilidade';
      })
      
      // Remove skill
      .addCase(removeSkill.fulfilled, (state, action) => {
        if (state.currentProfile?.skills) {
          state.currentProfile.skills = state.currentProfile.skills.filter(
            skill => skill.id !== action.payload
          );
        }
      })
      
      // Endorse skill
      .addCase(endorseSkill.fulfilled, (state, action) => {
        const { skillId } = action.payload;
        if (state.currentProfile?.skills) {
          const skillIndex = state.currentProfile.skills.findIndex(skill => skill.id === skillId);
          if (skillIndex !== -1) {
            state.currentProfile.skills[skillIndex].is_endorsed = true;
          }
        }
        if (state.viewedProfile?.skills) {
          const skillIndex = state.viewedProfile.skills.findIndex(skill => skill.id === skillId);
          if (skillIndex !== -1) {
            state.viewedProfile.skills[skillIndex].is_endorsed = true;
          }
        }
      })
      
      // Add experience
      .addCase(addExperience.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.updating = false;
        if (state.currentProfile?.experience) {
          state.currentProfile.experience.unshift(action.payload);
        }
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erro ao adicionar experiência';
      })
      
      // Add education
      .addCase(addEducation.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.updating = false;
        if (state.currentProfile?.education) {
          state.currentProfile.education.unshift(action.payload);
        }
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erro ao adicionar educação';
      })
      
      // Add project
      .addCase(addProject.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.updating = false;
        if (state.currentProfile?.projects) {
          state.currentProfile.projects.unshift(action.payload);
        }
      })
      .addCase(addProject.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erro ao adicionar projeto';
      });
  },
});

export const {
  clearError,
  setViewedProfile,
  clearViewedProfile,
  updateCurrentProfile,
} = profileSlice.actions;

export default profileSlice.reducer;