
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobsService, Job, JobFilters } from '../../services/jobs.service';

interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  myApplications: Job[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  apiStatus: {
    theirStack: boolean | null;
    serpAPI: boolean | null;
  };
}

const initialState: JobsState = {
  jobs: [],
  featuredJobs: [],
  myApplications: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    location: '',
    type: '',
    level: '',
    salary_min: undefined,
    salary_max: undefined,
    company: '',
  },
  apiStatus: {
    theirStack: null,
    serpAPI: null,
  },
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: JobFilters = {}, { rejectWithValue }) => {
    try {
      const jobs = await jobsService.searchJobs(filters);
      return jobs;
    } catch (error: any) {
      console.error('fetchJobs error:', error);
      // Return mock data as fallback to ensure we always have something to show
      return jobsService.getMockJobs(filters);
    }
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'jobs/fetchFeaturedJobs', 
  async () => {
    try {
      const jobs = await jobsService.getFeaturedJobs();
      return jobs;
    } catch (error) {
      console.log('Featured jobs API failed, using mock data directly');
      // Return mock data directly to ensure we always have something to show
      return jobsService.getMockFeaturedJobs();
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async (params: { jobId: string; userId: string }) => {
    const { jobId, userId } = params;
    await jobsService.applyToJob(jobId, userId);
    return jobId;
  }
);

export const testAPIs = createAsyncThunk(
  'jobs/testAPIs',
  async () => {
    return await jobsService.testAPI();
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<JobFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        location: '',
        type: '',
        level: '',
        salary_min: undefined,
        salary_max: undefined,
        company: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar vagas';
      })
      .addCase(fetchFeaturedJobs.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredJobs = action.payload;
      })
      .addCase(fetchFeaturedJobs.rejected, (state, action) => {
        // Don't set error if we're using mock data - this prevents error messages from showing
        console.log('Featured jobs fetch rejected, but we should have fallback data');
        // Only set error if we truly have no data to show
        if (state.featuredJobs.length === 0) {
          state.error = 'Erro ao carregar vagas em destaque';
        }
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        const job = state.jobs.find(j => j.id === jobId);
        if (job) {
          job.applied_by_user = true;
          job.applications_count += 1;
        }
      })
      .addCase(testAPIs.fulfilled, (state, action) => {
        state.apiStatus = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
