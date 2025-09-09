
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobsService, Job, JobFilters } from '../../services/jobs.service';

interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  myApplications: Job[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
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
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: JobFilters = {}) => {
    return await jobsService.searchJobs(filters);
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'jobs/fetchFeaturedJobs', 
  async () => {
    return await jobsService.getFeaturedJobs();
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
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredJobs = action.payload;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        const job = state.jobs.find(j => j.id === jobId);
        if (job) {
          job.applied_by_user = true;
          job.applications_count += 1;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
